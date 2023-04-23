const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const UserSchema = new Schema({
    username: {
        type: String, 
        required: true, 
        minLength: 6, 
        maxLength: 20,
        unique: true,
        validate: {
            validator: val => /^[\w-]+$/.test(val)
        }
    },
    name: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 25,
    },
    email: {
        type: String, 
        required: true, 
        lowercase: true, 
        minLength: 10,
        validate: {
            validator: val => {
                const emailPattern = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
                return emailPattern.test(val);
            }
        }
    },
    password: {
        type: String, 
        required: true, 
        minLength: 8,
        validate: {
            validator: val => {
                const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
                return passwordPattern.test(val);
            }
        }
    },
    profilepic: String,
    bio: String,
});

const UserModel = model("User", UserSchema);

module.exports = UserModel;

