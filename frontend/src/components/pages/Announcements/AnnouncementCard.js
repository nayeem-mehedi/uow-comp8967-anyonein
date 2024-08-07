import React from "react";
import { Link } from 'react-router-dom';

const AnnouncementCard = ({ announcement }) => {
    return (
        <div key={announcement.id} className="announcement-card">
            <h3>{announcement.title}</h3>
            <p>{announcement.content}</p>
            <div className="announcement-meta">
                {announcement.user ? (
                    <div>
                        <Link
                            to={`/profile/${announcement.user.profile.id}`}
                            className="announcement-user"
                            style={{ display: 'block', marginTop: '5px' }}
                        >
                            Posted by: {announcement.user.username}
                        </Link>
                        {announcement.user.profile && (
                            <div className="announcement-profile">
                                <img src={announcement.user.profile.profilePicture} alt="avatar" className="avatar"/>
                            </div>
                        )}
                    </div>
                ) : (
                    <Link
                        to={`/projects/${announcement.project.id}`}
                        className="announcement-project"
                        style={{ display: 'block', marginTop: '5px' }}
                    >
                        Project: {announcement.project.name}
                    </Link>
                )}
                <span className="announcement-date">
                                    {new Date(announcement.createdAt).toLocaleString()}
                                </span>
            </div>
        </div>
    )
}

export default AnnouncementCard;