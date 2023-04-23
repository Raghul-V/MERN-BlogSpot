import Navbar from '../../Components/Navbar/index';
import { useContext, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../../UserContext';
import './style.css';
import { API_URL } from '../../config';

function ChangePassword() {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const { userInfo } = useContext(UserContext);
    const [redirect, setRedirect] = useState(false);

    function submit(e) {
        e.preventDefault();

        if (!userInfo.id) {
            alert("You first need to login to change your password!...");
            return;
        }
        const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
        if (!passwordPattern.test(oldPassword) || newPassword.length < 8) {
            alert("Old Password is incorrect!...");
            return;
        }
        if (!passwordPattern.test(newPassword) || newPassword.length < 8) {
            alert("New Password should contain 1 lowercase, 1 uppercase, 1 number and 1 special character. Min length: 8. New Password doesn't match the criteria!...");
            return;
        }
        if (newPassword !== confirmPassword) {
            alert("New Password and confirm new password are not same!...");
            return;
        }
        fetch(`${API_URL}/changepassword`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                userId: userInfo.id, oldPassword, newPassword
            })
        }).then(res => {
            if (res.ok) {
                alert("Password changed successfully!...");
                setRedirect(true);
            }
            else {
                res.json().then(data => {
                    if (data === "user doesn't exist") {
                        alert("Username doesn't exist!...");
                    }
                    else if (data === "permission denied") {
                        alert("Old Password is incorrect!...");
                    }
                    else {
                        alert("Error occurred! Password not changed!...");
                    }
                })
            }
        }).catch(err => console.log(err));
        return;
    }

    if (redirect) {
        return <Navigate to="/" />
    }
    return (
        <div className="change-password">
            <Navbar />
            <main>
                <h1 className="title">Change Password</h1>
                <form onSubmit={ submit }>
                    <input type="password" 
                        placeholder="Old Password" 
                        value={oldPassword} 
                        onChange={e => setOldPassword(e.target.value)}
                        minLength="8"
                        required
                    />
                    <input type="password" 
                        placeholder="New Password" 
                        value={newPassword} 
                        onChange={e => setNewPassword(e.target.value)}
                        minLength="8"
                        required
                    />
                    <input type="password" 
                        placeholder="Confirm New Password" 
                        value={confirmPassword} 
                        onChange={e => setConfirmPassword(e.target.value)}
                        required
                    />
                    <button type="submit" className="submit">Change Password</button>
                </form>
            </main>
        </div>
    );
}

export default ChangePassword;

