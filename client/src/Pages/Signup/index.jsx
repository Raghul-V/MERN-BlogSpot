import './style.css';
import Navbar from '../../Components/Navbar/index';
import { Link, Navigate } from 'react-router-dom';
import { useState } from 'react';
import { API_URL } from '../../config';

function Signup() {
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [redirect, setRedirect] = useState(false);

    function submit(e) {
        e.preventDefault();
        
        const usernamePattern = /^[\w-]+$/;
        if (!usernamePattern.test(username) || username.length < 6 || username.length > 20) {
            alert("Username doesn't match specified criteria!...");
            return;
        }
        if (name.length < 3 || name.length > 25) {
            alert("Full name cannot be less than 3 or more than 25 characters!...");
            return;
        }
        const emailPattern = /^([a-zA-Z0-9_\-.]+)@([a-zA-Z0-9_\-.]+)\.([a-zA-Z]{2,5})$/;
        if (!emailPattern.test(email) || email.length < 10) {
            alert("Please enter a valid email id!...");
            return;
        }
        const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
        if (!passwordPattern.test(password) || password.length < 8) {
            alert("Password doesn't match specified criteria!...");
            return;
        }
        if (password !== confirmPassword) {
            alert("Password and confirm password are not same!...");
            return;
        }
        fetch(`${API_URL}/signup`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username, name, email, password, confirmPassword
            })
        }).then(res => {
            if (res.ok) {
                alert("Successfully registered!...");
                setRedirect(true);
            }
            else {
                res.json().then(err => {
                    if (err?.keyPattern?.username) {
                        alert("Username already taken!...");
                    }
                    else {
                        alert("Registration failed!...");
                    }
                });
            }
        }).catch(err => console.log(err));
    }

    if (redirect) {
        return <Navigate to="/login" />
    }
    return (
        <div className="signup">
            <Navbar hideButtons />
            <main>
                <h1 className="title">Sign Up</h1>
                <form onSubmit={ submit }>
                    <div>
                        <input type="text" 
                            placeholder="Username" 
                            value={username} 
                            onChange={e => setUsername(e.target.value)}
                            minLength="6"
                            maxLength="20"
                            required
                        />
                        <span className="criteria">Username can contain only A-Z, a-z, 0-9, _<br />Min length: 6, Max length: 20</span>
                    </div>
                    <div>
                        <input type="text" 
                            placeholder="Full Name" 
                            value={name} 
                            onChange={e => setName(e.target.value)}
                            minLength="3"
                            maxLength="25"
                            required
                        />
                        <span className="criteria">Min length: 3, Max length: 25</span>
                    </div>
                    <div>
                        <input type="email" 
                            placeholder="Email Id" 
                            value={email} 
                            onChange={e => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <input type="password" 
                            placeholder="Password" 
                            value={password} 
                            onChange={e => setPassword(e.target.value)}
                            minLength="8"
                            required
                        />
                        <span className="criteria">Password should contain 1 lowercase, 1 uppercase, 1 number and 1 special character. Min length: 8</span>
                    </div>
                    <div>
                        <input type="password" 
                            placeholder="Confirm Password" 
                            value={confirmPassword} 
                            onChange={e => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="submit">Sign Up</button>
                </form>
                <p>
                    Already have an account? <Link to="/login" className="login redirect">Login</Link>
                </p>
            </main>
        </div>
    );
}

export default Signup;
