import Navbar from '../../Components/Navbar/index';
import { useState, useContext, useEffect } from 'react';
import { UserContext } from '../../UserContext';
import { Link, Navigate, useParams } from 'react-router-dom';
import ProfilePic from '../../Components/ProfilePic/index';
import { API_URL } from '../../config';
import './style.css';

function EditProfile() {
    const { id } = useParams();
    const [profilePic, setProfilePic] = useState(null);
    const [fullname, setFullname] = useState("");
    const [email, setEmail] = useState("");
    const { userInfo, setUserInfo } = useContext(UserContext);
    const [profilepicSrc, setProfilepicSrc] = useState("");
    const [oldProfilepicSrc, setOldProfilepicSrc] = useState("");
    const [bio, setBio] = useState("");
    const [showPage, setShowPage] = useState(false);
    const [redirect, setRedirect] = useState(false);

    useEffect(() => {
        fetch(`${API_URL}/profile-data/${id}`)
            .then(res => {
                if (!res.ok) {
                    return;
                }
                res.json()
                    .then(data => {
                        setFullname(data.name);
                        setEmail(data.email);
                        if (data.profilepic) {
                            setProfilepicSrc(`${API_URL}/` + data.profilepic);
                            setOldProfilepicSrc(`${API_URL}/` + data.profilepic);
                        }
                        if (data.bio) {
                            setBio(data.bio);
                        }
                        setShowPage(true);
                    })
                    .catch(err => console.log(err));
            })
            .catch(err => console.log(err));
    }, [id]);
    
    function fileInputHandle(e) {
        if (!e.target.files[0]) {
            setProfilePic(null);
            setProfilepicSrc(oldProfilepicSrc);
            return;
        }
        setProfilePic(e.target.files[0]);
        let reader = new FileReader();
        reader.readAsDataURL(e.target.files[0]);
        reader.onload = () => {
            setProfilepicSrc(reader.result);
        }
    }

    function deleteProfilePic(e) {
        e.preventDefault();
        
        fetch(`${API_URL}/delete/profilepic`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ id })
        }).then(res => {
            if (res.ok) {
                setProfilePic(null);
                setProfilepicSrc("");
            }
            else {
                alert("Error occurred! Profile Photo not deleted!...");
            }
        }).catch(err => console.log(err));
    }

    function submit(e) {
        e.preventDefault();

        if (!userInfo) {
            alert("First you need to login to edit your profile!...");
            return;
        }

        if (fullname.length < 3 || fullname.length > 25) {
            alert("Full name cannot be less than 3 or more than 25 characters!...");
            return;
        }
        const emailPattern = /^([a-zA-Z0-9_\-.]+)@([a-zA-Z0-9_\-.]+)\.([a-zA-Z]{2,5})$/;
        if (!emailPattern.test(email) || email.length < 10) {
            alert("Please enter a valid email id!...");
            return;
        }

        const data = new FormData();

        data.set("id", id);
        data.set("name", fullname);
        data.set("email", email);
        if (profilePic) {
            data.set("profilepic", profilePic);
        }
        data.set("bio", bio);

        fetch(`${API_URL}/edit/profile`, {
            method: "PUT",
            body: data,
        }).then(res => {
            if (res.ok) {
                alert("Changes saved successfully!...");
                if (fullname) {
                    setUserInfo({ ...userInfo, name: fullname });
                }
                setRedirect(true);
            }
            else {
                alert("Error occurred! Profile not updated!...");
            }
        }).catch(err => console.log(err));

        return;
    }

    if (redirect) {
        return <Navigate to={`/profile/${id}`} />;
    }
    if (!showPage) {
        return "";
    }
    return (
        <div className="edit-profile">
            <Navbar />
            <main>
                <h1 className="title">Edit Profile</h1>
                <form onSubmit={ submit }>
                    <div className="profile-img-container">
                        <ProfilePic src={profilepicSrc} />
                        <input type="file"
                            id="profile-pic"
                            onChange={fileInputHandle}
                        />
                        <label htmlFor="profile-pic" className="add-profile-pic">
                            <span>{ !profilepicSrc ? 'Add' : 'Edit' } Profile Photo</span>
                        </label>
                        { profilepicSrc && 
                            <button className="del-profile-pic" 
                                onClick={deleteProfilePic}>Delete Profile Photo</button>
                        }
                    </div>
                    <input type="text" 
                        placeholder="Full name" 
                        value={fullname} 
                        onChange={e => setFullname(e.target.value)}
                        minLength="3"
                        maxLength="25"
                        required
                    />
                    <input type="email" 
                        placeholder="Email" 
                        value={email} 
                        onChange={e => setEmail(e.target.value)}
                        required
                    />
                    <textarea 
                        placeholder="Add Bio" 
                        className="add-bio" 
                        value={bio}
                        onChange={e => setBio(e.target.value)}
                    ></textarea>
                    <button className="change-pw-btn">
                        <Link to="/changepassword">Change Password</Link>
                    </button>
                    <button type="submit" className="submit">Save Changes</button>
                </form>
            </main>
        </div>
    );
}

export default EditProfile;

