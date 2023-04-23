import './style.css';
import { Link } from 'react-router-dom';
import { useEffect, useContext } from 'react';
import { UserContext } from '../../UserContext';
import { API_URL } from '../../config';

function Navbar({ hideButtons, hideProfileBtn }) {
    const { userInfo, setUserInfo } = useContext(UserContext);

    useEffect(() => {
        fetch(`${API_URL}/profile`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                localStorage
            })
        })
            .then(res => {
                if (!res.ok) return;
                res.json().then(userData => {
                    setUserInfo(userData);
                }).catch(err => console.log(err));
            })
            .catch(err => console.log(err));
    }, [setUserInfo]);

    function logout() {
        fetch(`${API_URL}/logout`)
            .then(res => {
                if (!res.ok) return;
                res.json()
                    .then(data => {
                        localStorage.setItem(data.key, data.value)
                        setUserInfo({})
                    })
                    .catch(err => console.log(err));
            })
            .catch(err => console.log(err));
    }

    return (
        <nav>
            <Link to="/" className="logo">BlogSpot</Link>
            { (!userInfo.username && !hideButtons) ? (
                <>
                    <Link to="/login" className="login">Login</Link>
                    <Link to="/signup" className="register">Sign Up</Link>
                </>
                ) : ""
            }
            { userInfo.username && (
                <>
                    { !hideProfileBtn && (
                        <Link to={`/profile/${userInfo.id}`} className="profile-btn">Profile</Link>
                    )}
                    { !hideButtons && (
                        <Link to="/createpost" className="create-post">Create New Post</Link>
                    )}
                    <Link to="/" onClick={logout} className="logout">Logout</Link>
                </>
            )}
        </nav>
    );
}

export default Navbar;
