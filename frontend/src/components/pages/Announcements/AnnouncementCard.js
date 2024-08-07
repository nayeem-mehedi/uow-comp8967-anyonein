import React from "react";

const AnnouncementCard = ({ announcement }) => {
    return (
        <div key={announcement.id} className="announcement-card">
            <h3>{announcement.title}</h3>
            <p>{announcement.content}</p>
            <div className="announcement-meta">
                {announcement.user ? (
                    <div>
                        <a href={`/profile/${announcement.user.profile.id}`} className="announcement-user">
                            Posted by: {announcement.user.username}
                        </a>
                        {announcement.user.profile && (
                            <div className="announcement-profile">
                                <img src={announcement.user.profile.profilePicture} alt="avatar" className="avatar"/>
                            </div>
                        )}
                    </div>
                ) : (
                    <a href={`/projects/${announcement.project.id}`} className="announcement-project">
                        Project: {announcement.project.name}
                    </a>
                )}
                <span className="announcement-date">
                                    {new Date(announcement.createdAt).toLocaleString()}
                                </span>
            </div>
        </div>
    )
}

export default AnnouncementCard;