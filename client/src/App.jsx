import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Pages/Home/index';
import Login from './Pages/Login/index';
import Signup from './Pages/Signup/index';
import CreatePost from './Pages/CreatePost/index';
import EditPost from './Pages/EditPost';
import PostPage from './Pages/PostPage/index';
import ProfilePage from './Pages/ProfilePage/index';
import DeleteAccount from './Pages/DeleteAccount/index';
import EditProfile from './Pages/EditProfile/index';
import ChangePassword from './Pages/ChangePassword/index';
import './App.css';

function App() {
    return (
        <div className="app">
            <Router>
                <Routes>
                    <Route path="/" element={ <Home /> } />
                    <Route path="/login" element={ <Login /> } />
                    <Route path="/signup" element={ <Signup /> } />
                    <Route path="/createpost" element={ <CreatePost /> } />
                    <Route path="/post/:id" element={ <PostPage /> } />
                    <Route path="/edit/:id" element={ <EditPost /> } />
                    <Route path="/profile/:id" element={ <ProfilePage /> } />
                    <Route path="/delete/user/:id" element={ <DeleteAccount /> } />
                    <Route path="/edit/profile/:id" element={ <EditProfile /> } />
                    <Route path="/changepassword" element={ <ChangePassword /> } />
                </Routes>
            </Router>
        </div>
    );
}

export default App;

