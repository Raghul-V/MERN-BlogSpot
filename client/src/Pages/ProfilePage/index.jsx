import { Link, useParams } from 'react-router-dom';
import './style.css';
import Navbar from '../../Components/Navbar/index';
import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../UserContext';
import Post from '../../Components/Post/index';
import ProfilePic from '../../Components/ProfilePic/index';
import { API_URL } from '../../config';

function ProfilePage() {
    const { id: profileId } = useParams();
    const [hideProfileBtn, setHideProfileBtn] = useState(true);
    const { userInfo } = useContext(UserContext);
    const [profileData, setProfileData] = useState(null);
    const [profilepicSrc, setProfilepicSrc] = useState("");
    const [bio, setBio] = useState("");

    useEffect(() => {
        if (userInfo && profileId && userInfo.id !== profileId) {
            setHideProfileBtn(false);
        }
        else {
            setHideProfileBtn(true);
        }
        if (userInfo) {
            fetch(`${API_URL}/profile/${profileId}`)
                .then(res => {
                    if (!res.ok) return;
                    res.json()
                        .then(data => setProfileData(data))
                        .catch(err => console.log(err));
                })
                .catch(err => console.log(err));
            fetch(`${API_URL}/profile-data/${profileId}`)
                .then(res => {
                    if (!res.ok) return;
                    res.json()
                        .then(data => {
                            if (!data) return;
                            if (data.profilepic) {
                                setProfilepicSrc(`${API_URL}/` + data.profilepic);
                            }
                            setBio(data.bio);
                        }).catch(err => console.log(err));
                })
                .catch(err => console.log(err));
        }
    }, [profileId, userInfo]);

    if (!profileData) {
        return "";
    }

    const { posts, author } = profileData;

    return (
        <div className="profile">
            <Navbar hideProfileBtn={hideProfileBtn} />
            <main>
                <div className="header">
                    <ProfilePic src={profilepicSrc} />
                    <div className="author-info">
                        <p className="name">{ author.name }</p>
                        <p className="username">@{ author.username }</p>
                        { bio && <p className="bio">{ bio }</p> }
                    </div>
                </div>
                {
                    hideProfileBtn && (
                        <div className="btns">
                            <Link to={`/edit/profile/${profileId}`} className="edit-btn">Edit Profile</Link>
                            <Link to={`/delete/user/${profileId}`} className="delete-btn">Delete Account</Link>
                        </div>
                    )
                }
                <hr />
                <p className="post-count">
                    { !posts.length ? "No Posts" : posts.length === 1 ? "1 Post" : posts.length + " Posts" }
                </p>
                <div className="posts">
                    { posts.map(post => <Post key={post._id} {...post} author={author} />) }
                </div>
            </main>
        </div>
    );
}

export default ProfilePage;

