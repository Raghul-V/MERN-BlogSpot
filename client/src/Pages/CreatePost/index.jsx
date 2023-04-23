import './style.css';
import Navbar from '../../Components/Navbar/index';
import { useContext, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../../UserContext';
import Editor from '../../Components/Editor';
import { API_URL } from '../../config';

function CreatePost() {
    const [title, setTitle] = useState("");
    const [summary, setSummary] = useState("");
    const [thumbnails, setThumbnails] = useState([]);
    const [content, setContent] = useState("");
    const [redirect, setRedirect] = useState(false);
    const [postId, setPostId] = useState("");
    const [disableSubmit, setDisableSubmit] = useState(false);
    const { userInfo } = useContext(UserContext);

    function createNewPost(e) {
        e.preventDefault();

        if (disableSubmit) return;

        if (!content.trim()) {
            alert("The Blog post cannot be empty!...");
            return;
        }

        const data = new FormData();

        data.set("title", title);
        data.set("summary", summary);
        data.set("thumbnail", thumbnails[0]);
        data.set("content", content);
        data.set("author", userInfo.id);

        setDisableSubmit(true);
        fetch(`${API_URL}/createpost`, {
            method: "POST",
            body: data,
        }).then(res => {
            if (res.ok) {
                alert("Post created successfully!...");
                res.json().then(postInfo => {
                    setPostId(postInfo._id);
                    setRedirect(true);
                    setDisableSubmit(false);
                }).catch(err => {
                    console.log(err);
                    setDisableSubmit(false);
                });
            }
            else {
                alert("Error occurred! Post not created!...");
                setDisableSubmit(false);
            }
        }).catch(err => {
            console.log(err);
            setDisableSubmit(false);
        });
    }

    if (redirect) {
        return <Navigate to={`/post/${postId}`} />
    }
    return (
        <div className="create-post">
            <Navbar hideButtons />
            <main>
                <form onSubmit={createNewPost}>
                    <input type="text" 
                        placeholder="Blog Title" 
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        required
                    />
                    <input type="summary" 
                        placeholder="Summary" 
                        value={summary}
                        onChange={e => setSummary(e.target.value)}
                        required
                    />
                    <input type="file"
                        onChange={e => setThumbnails(e.target.files)} 
                        required
                    />
                    <Editor 
                        value={content} 
                        onChange={newValue => setContent(newValue)} 
                    />
                    <button className="submit" disabled={disableSubmit}>Create Post</button>
                </form>
            </main>
        </div>
    );
}

export default CreatePost;
