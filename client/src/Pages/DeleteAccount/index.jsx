import { Navigate, useParams } from 'react-router-dom';
import { useContext, useState } from 'react';
import { UserContext } from '../../UserContext';
import Navbar from '../../Components/Navbar/index';
import './style.css';
import { API_URL } from '../../config';

function DeleteAccount() {
    const { id } = useParams();
    const { userInfo, setUserInfo } = useContext(UserContext);
    const [redirect, setRedirect] = useState(false);
    const [confirmText, setConfirmText] = useState("");
    const [password, setPassword] = useState("");

    function submit(e) {
        e.preventDefault();
        
        if (confirmText.trim() !== "CONFIRM") {
            alert("Please type \"CONFIRM\" to confirm!");
            return;
        }
        if (password) {
            fetch(`${API_URL}/delete/user/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ password, localStorage })
            })
                .then(res => {
                    if (!res.ok) {
                        alert("Invalid credentials! Account not Deleted!...");
                        return;
                    };
                    setUserInfo({});
                    setRedirect(true);
                    setTimeout(() => {
                        alert("Account deleted successfully!...");
                    }, 2000);
                    res.json()
                        .then(data => localStorage.setItem(data.key, data.value))
                        .catch(err => console.log(err));
                })
                .catch(err => console.log(err));
        }
    }

    if (redirect) {
        return <Navigate to="/" />
    }
    if (userInfo?.id !== id) {
        return "";
    }
    return (
        <div className="delete-profile">
            <Navbar />
            <main>
                <h1 className="title">Delete Account</h1>
                <p className="info">If you delete this account, all your posts in this account would be deleted and you cannot revert it back!... Please confirm before you delete your account!</p>
                <form onSubmit={ submit }>
                    <input type="password" 
                        placeholder="Password" 
                        value={password} 
                        onChange={e => setPassword(e.target.value)}
                        required
                    />
                    <input type="text" 
                        placeholder={"Type \"CONFIRM\" to confirm"} 
                        value={confirmText} 
                        onChange={e => setConfirmText(e.target.value)}
                        required
                    />
                    <button type="submit" className="submit del-acc-btn">Delete Account</button>
                </form>
            </main>
        </div>
    );
}

export default DeleteAccount;


      