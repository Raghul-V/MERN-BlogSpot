import Navbar from '../Components/Navbar/index';
import { useContext, useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { UserContext } from '../UserContext';
import Editor from '../Components/Editor';
import { API_URL } from '../config';

function EditPost() {
    const { id } = useParams();
    const [title, setTitle] = useState("");
    const [summary, setSummary] = useState("");
    const [thumbnails, setThumbnails] = useState([]);
    const [content, setContent] = useState("");
    const [redirect, setRedirect] = useState(false);
    const [authorId, setAuthorId] = useState(null);
    const { userInfo } = useContext(UserContext);

    useEffect(() => {
        fetch(`${API_URL}/post/${id}`)
            .then(res => {
                if (!res.ok) return;
                res.json()
                    .then(postInfo => {
                        setAuthorId(postInfo.author._id);
                        setTitle(postInfo.title);
                        setSummary(postInfo.summary);
                        setContent(postInfo.content);
                    })
                    .catch(err => console.log(err));
            }).catch(err => console.log(err));
    }, [id]);

    function updatePost(e) {
        e.preventDefault();
        if (!content.trim()) {
            alert("The Blog post cannot be empty!...");
            return;
        }

        const data = new FormData();

        data.set("title", title);
        data.set("summary", summary);
        if (thumbnails) {
            data.set("thumbnail", thumbnails[0]);
        }
        data.set("content", content);

        fetch(`${API_URL}/edit/post/${id}`, {
            method: "PUT",
            body: data,
        }).then(res => {
            if (res.ok){
                alert("Post updated successfully!...");
                setRedirect(true);
            }
            else {
                alert("Error occurred! Post not updated!...");
            }
        }).catch(err => console.log(err));
    }

    if (!authorId || !userInfo || authorId !== userInfo.id) {
        return "";
    }
    if (redirect) {
        return <Navigate to={`/post/${id}`} />
    }
    return (
        <div className="edit-post">
            <Navbar />
            <main>
                <form onSubmit={updatePost}>
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
                    />
                    <Editor 
                        value={content} 
                        onChange={newValue => setContent(newValue)} 
                    />
                    <button className="submit">Update Post</button>
                </form>
            </main>
        </div>
    );
}

export default EditPost;
