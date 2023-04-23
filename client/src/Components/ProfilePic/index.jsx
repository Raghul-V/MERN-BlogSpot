import DefaultProfilePic from './DefaultProfilePic';
import './style.css';

function ProfilePic({ src }) {
    return (
        <div className="profile-pic">
            { src ? <img src={src} alt='Profile-Pic' /> : <DefaultProfilePic /> }
        </div>
    );
}

export default ProfilePic;

