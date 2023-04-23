import './style.css';
import { Link, Navigate } from 'react-router-dom';
import Navbar from '../../Components/Navbar/index';
import { useState } from 'react';
import { API_URL } from '../../config';

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [redirect, setRedirect] = useState(false);

    function submit(e) {
        e.preventDefault();
        fetch(`${API_URL}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username, password
            })
        }).then(res => {
            if (res.ok) {
                res.json()
                    .then(data => {
                        localStorage.setItem(data.key, data.value)
                        setRedirect(true);
                    })
                    .catch(err => console.log(err));
            }
            else{
                alert("Login Failed!...");
            }
        }).catch(err => console.log(err));
    }
    
    if (redirect) {
        return <Navigate to="/" />
    }
    return (
        <div className="login">
            <Navbar hideButtons />
            <main>
                <h1 className="title">Login</h1>
                <form onSubmit={ submit }>
                    <input type="text" 
                        placeholder="Username" 
                        value={ username }
                        onChange={e => setUsername(e.target.value)}
                        required
                    />
                    <input type="password" 
                        placeholder="Password" 
                        value={ password }
                        onChange={e => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit" className="submit">Login</button>
                </form>
                <p>
                    Don't have an account? <Link to="/signup" className="signup redirect">Sign Up</Link>
                </p>
            </main>
        </div>
    );
}

export default Login;
