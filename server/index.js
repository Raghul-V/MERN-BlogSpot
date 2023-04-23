const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./models/User");
const Post = require("./models/Post");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");
const fs = require("fs");

const DATABASE = process.env.DATABASE || "mongodb://localhost/testdb";
const SECRET_KEY = process.env.SECRET_KEY || "e8gW36Uvk0Ya1pN";
// const APP_URL = "https://blogspot-mern.netlify.app";
const APP_URL = "http://localhost:3000";
const PORT = 4000;

const app = express();
app.use(express.json());
app.use(cors({ credentials: true, origin: APP_URL }));

const salt = bcrypt.genSaltSync(10);

const Storage = new GridFsStorage({
    url: DATABASE, 
    file: (req, file) => {
        return {
            filename: file.originalname,
            bucketName: "uploads"
        }
    }
});
const upload = multer({ storage: Storage });

mongoose.connect(DATABASE, {
    useUnifiedTopology: true,
    useNewUrlParser: true
});

const gridBucket = new mongoose.mongo.GridFSBucket(mongoose.connection, {
    bucketName: "uploads"
});


app.post("/signup", async (req, res) => {
    const { username, name, email, password } = req.body;
    const passwordPattern = /^(?=.*[A-Z]+)(?=.*[a-z]+)(?=.*\d+)(?=.*[_\W]+).{8,}$/;
    if (!passwordPattern.test(password)) {
        return res.status(400).json("password doesn't match the pattern");
    }
    try {
        await User.create({ username, name, email, password: bcrypt.hashSync(password, salt) });
        res.json("account created");
    }
    catch (e) {
        res.status(400).json(e);
    }
});

app.post("/login", async (req, res) => {
    const { username, password } = req.body;
    const doesExist = await User.exists({ username });
    if (!doesExist) {
        return res.status(400).json("user doesn't exist");
    }
    const user = await User.findOne({ username });
    const isPasswordCorrect = bcrypt.compareSync(password, user.password);
    if (isPasswordCorrect) {
        jwt.sign({ username, id: user._id }, SECRET_KEY, {}, (err, token) => {
            if (err) throw err;
            res.json({ key: "token", value: token });
        });
    }
    else {
        res.status(400).json("wrong credentials");
    }
});

app.post("/profile", (req, res) => {
    const { token } = req.body.localStorage;
    if (token) {
        jwt.verify(token, SECRET_KEY, {}, (err, data) => {
            if (err) throw err;
            res.json(data);
        });
    }
    else {
        res.end();
    }
});

app.get("/profile/:authorId", async (req, res) => {
    try {
        const { authorId } = req.params;
        const posts = await Post.find({ author: authorId }).sort({ createdAt: -1 });
        const user = await User.findById(authorId);
        if (!posts || !user) throw Error;
        res.json({ posts, author: { name: user.name, username: user.username } });
    }
    catch (e) {
        res.status(400).json(e);
    }
});

app.get("/logout", (req, res) => {
    res.json({ key: "token", value: "" });
});

app.post("/createpost", upload.single("thumbnail"), async (req, res) => {
    try {
        const thumbnailPath = "uploads/" + req.file.id.toString();
        const { title, summary, content, author } = req.body;
        const post = await Post.create({
            title, summary, content, thumbnail: thumbnailPath, author
        });
        res.json(post);
    }
    catch (e) {
        res.status(400).json(e);
    }
});

app.get("/uploads/:imageId", async (req, res) => {
    try {
        let { imageId } = req.params;
        imageId = new mongoose.Types.ObjectId(imageId);
        const image = await gridBucket.find({ _id: imageId }).toArray();
        if (!image || !image.length) {
            return res.status(400).json("file not found");
        }
        gridBucket.openDownloadStream(imageId).pipe(res);
    }
    catch (e) {
        console.log(e);
        res.status(400).json("file not found");
    }
});

app.get("/posts", async (req, res) => {
    const posts = await Post.find().sort({ "createdAt": -1 }).populate("author", ["username"]);
    res.json(posts);
});

app.get("/post/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate("author", ["username", "name"]);
        res.json(post);
    }
    catch (e) {
        res.status(400).json("post doesn't exist");
    }
});

app.put("/edit/post/:id", upload.single("thumbnail"), async (req, res) => {
    try {
        const { id } = req.params;
        const { title, summary, content } = req.body;
        const post = await Post.findById(id);

        post.title = title;
        post.summary = summary;
        post.content = content;

        if (req.file) {
            // slice(8) is to remove the prefix "uploads/"
            let oldPath = new mongoose.Types.ObjectId(post.thumbnail.slice(8));
            gridBucket.delete(oldPath);
            let newPath = "uploads/" + req.file.id.toString();
            post.thumbnail = newPath;
        }

        await post.save();
        res.json(post);
    }
    catch (e) {
        res.status(400).json(e);
    }
});

app.delete("/delete/post/:id", async (req, res) => {
    const { token } = req.body.localStorage;
    if (token) {
        jwt.verify(token, SECRET_KEY, {}, async (err, data) => {
            if (err) throw err;
            
            const { id } = req.params;
            const post = await Post.findById(id).populate("author");
            if (JSON.stringify(data.id) === JSON.stringify(post.author._id)) {
                // slice(8) is to remove the prefix "uploads/"
                let oldPath = new mongoose.Types.ObjectId(post.thumbnail.slice(8));
                gridBucket.delete(oldPath);
                await Post.deleteOne({ _id: id });
                res.end();
            }
            else {
                res.json("permission denied");
            }
        });
    }
    else {
        res.end();
    }
});

app.delete("/delete/user/:id", async (req, res) => {
    try {
        const { id } = req.params;
        
        // check user with cookies and password
        const { password } = req.body;
        const { token } = req.body.localStorage;
        if (!token) {
            res.status(400).json("user not logged in");
            return;
        }

        let userInfo;
        jwt.verify(token, SECRET_KEY, {}, async (err, data) => {
            if (err) throw err;
            userInfo = data;
        });

        const doesExist = await User.exists({ _id: userInfo.id });
        if (!doesExist || userInfo.id !== id) {
            res.status(400).json("permission denied");
            return;
        }
        const user = await User.findById(id);
        const passwordCorrect = bcrypt.compareSync(password, user.password);
        if (!passwordCorrect) {
            res.status(400).json("permission denied");
            return;
        }
        
        // // delete upload files
        const posts = await Post.find({ author: id });
        for (let post of posts) {
            // slice(8) is to remove the prefix "uploads/"
            let oldPath = new mongoose.Types.ObjectId(post.thumbnail.slice(8));
            gridBucket.delete(oldPath);
        }
        
        // delete posts
        await Post.deleteMany({ author: id });
        
        // delete user from db
        await User.deleteOne({ _id: id });
        
        // destroy cookies
        res.json({ key: "token", value: "" });
    }
    catch (e) {
        res.status(400).json(e);
    }
});

app.put("/changepassword", async (req, res) => {
    const { userId, oldPassword, newPassword } = req.body;
    const doesExist = await User.exists({ _id: userId });
    if (!doesExist) {
        res.status(400).json("user doesn't exist");
        return;
    }
    const user = await User.findById(userId);
    const passwordCorrect = bcrypt.compareSync(oldPassword, user.password);
    if (!passwordCorrect) {
        res.status(400).json("permission denied");
        return;
    }
    const passwordPattern = /^(?=.*[A-Z]+)(?=.*[a-z]+)(?=.*\d+)(?=.*[_\W]+).{8,}$/;
    if (!passwordPattern.test(newPassword)) {
        return res.status(400).json("new password doesn't match the pattern");
    }
    try {
        user.password = bcrypt.hashSync(newPassword, salt);
        await user.save();
        res.json("changed password");
    }
    catch (e) {
        res.status(400).json(e);
    }
});

app.get("/profile-data/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        res.json({ name: user.name, email: user.email, bio: user.bio, profilepic: user.profilepic });
    }
    catch (e) {
        res.status(400).json(e);
    }
});

app.put("/edit/profile", upload.single("profilepic"), async (req, res) => {
    try {
        const { id, name, email, bio } = req.body;
        const user = await User.findById(id);
        
        if (req.file) {
            if (user.profilepic) {
                // slice(7) is to remove the prefix "upload/"
                let oldPath = new mongoose.Types.ObjectId(user.profilepic.slice(7));
                gridBucket.delete(oldPath);
            }
            let newPath = "uploads/" + req.file.id.toString();
            user.profilepic = newPath;
        }

        if (name) {
            user.name = name;
        }
        if (email) {
            user.email = email;
        }
        user.bio = bio;

        await user.save();
        res.json("profile edited");
    }
    catch (e) {
        res.status(400).json(e);
    }
});

app.delete("/delete/profilepic", async (req, res) => {
    const { id } = req.body;
    const user = await User.findById(id);
    if (!user) {
        res.status(400).json("user not found");
        return;
    }
    if (user.profilepic) {
        // slice(7) is to remove the prefix "upload/"
        let oldPath = new mongoose.Types.ObjectId(user.profilepic.slice(7));
        gridBucket.delete(oldPath);
    }
    user.profilepic = "";
    await user.save();
    res.json("profile photo deleted");
});


app.listen(PORT);

