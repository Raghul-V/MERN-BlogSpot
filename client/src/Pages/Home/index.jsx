import './style.css';
import Navbar from '../../Components/Navbar/index';
import Post from '../../Components/Post/index';
import { useState, useEffect } from 'react';
import { API_URL } from '../../config';

function Home() {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        fetch(`${API_URL}/posts`)
            .then(res => res.json())
            .then(posts => setPosts(posts))
            .catch(err => console.log(err));
    }, []);

    return (
        <div className="home">
            <Navbar />
            <main>
                { posts.map(post => <Post key={post._id} {...post} />) }
            </main>
        </div>
    );
}

export default Home;
