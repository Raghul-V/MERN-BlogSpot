import './style.css';
import Navbar from '../../Components/Navbar/index';
import { Link, Navigate, useParams } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { format } from 'date-fns';
import { UserContext } from '../../UserContext';
import { API_URL } from '../../config';

function PostPage() {
    const { id } = useParams();
    const [postInfo, setPostInfo] = useState(null);
    const [redirect, setRedirect] = useState(false);
    const { userInfo } = useContext(UserContext);

    useEffect(() => {
        fetch(`${API_URL}/post/${id}`)
            .then(res => {
                if (!res.ok) {
                    alert("Post doesn't exist!...");
                }
                else {
                    return res.json()
                }
            })
            .then(postInfo => {
                if (!postInfo) return;
                setPostInfo(postInfo);
            })
            .catch(err => console.log(err));
    }, [id]);

    function deletePost() {
        const toDelete = prompt("Type \"DELETE\" to delete the post:")?.trim() === "DELETE";
        if (toDelete) {
            fetch(`${API_URL}/delete/post/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    localStorage
                })
            });
            setRedirect(true);
        }
    }

    if (redirect) {
        return <Navigate to="/" />;
    }
    if (!postInfo) {
        return "";
    }
    else {
        const { title, thumbnail, content, createdAt, author } = postInfo;
        return (
            <div className="post-page">
                <Navbar />
                <main>
                    <h1 className="post-title">{ title }</h1>
                    <div className="info-and-edit">
                        <p className="post-info">
                            <Link to={`/profile/${author._id}`} className="author-info">
                                <span className="name">{ author.name }</span> <span className="username">@{ author.username }</span>
                            </Link> <time className="time">{ format(new Date(createdAt), "MMM d, yyyy HH:mm") }</time>
                        </p>
                        { (userInfo.id === author._id) && (
                            <div className="btns">
                                <Link to={`/edit/${id}`} className="edit-btn">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                    </svg>
                                    Edit this post
                                </Link>
                                <Link onClick={deletePost} className="delete-btn">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                    </svg>
                                    Delete post
                                </Link>
                            </div>
                        )}
                    </div>
                    <img className="thumbnail" src={`${API_URL}/` + thumbnail} alt="Blog Thumbnail" />
                    <div className="post-content" dangerouslySetInnerHTML={{ __html: content }} />
                </main>
            </div>
        );
    }
}

export default PostPage;
