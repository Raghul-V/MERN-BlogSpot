import { Link } from 'react-router-dom';
import './style.css';
import { format } from 'date-fns';
import { API_URL } from '../../config';

function Post({ _id, title, summary, thumbnail, createdAt, author }) {
    title = cutshort(title, 50);
    summary = cutshort(summary, 300);

    function cutshort(text, limit) {
        if (text.length < limit) return text;

        let index = text.lastIndexOf(" ", limit-3);
        if (index === -1) {
            return text.slice(0, limit-3) + "...";
        }
        return text.slice(0, index) + "...";
    }

    return (
        <section className="blog">
            <div className="blog-img-container">
                <Link to={`/post/${_id}`}>
                    <img src={ `${API_URL}/` + thumbnail } alt="Blog Img" />
                </Link>
            </div>
            <div className="blog-content">
                <Link to={`/post/${_id}`}>
                    <h2 className="blog-title">{ title }</h2>
                </Link>
                <p className="blog-info">
                    <Link to={`/profile/${author._id}`} className="author">
                        { author.username }
                    </Link> <time>{
                        format(new Date(createdAt), "MMM d, yyyy HH:mm")
                    }</time>
                </p>
                <Link to={`/post/${_id}`}>
                    <p className="blog-desc">{ summary }</p>
                </Link>
            </div>
        </section>
    );
}

export default Post;

