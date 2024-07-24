import React, { useState } from "react";
import { Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaRegBookmark, FaBookmark } from "react-icons/fa";

function ProjectCard({ project, initialFollowing }) {
    const [following, setFollowing] = useState(initialFollowing);
    const followUrl = `http://localhost:9001/api/follow/project/${project.id}`;
    const followText = following ? "Unfollow" : "Follow";
    const FollowIcon = following ? FaBookmark : FaRegBookmark;
    const buttonVariant = following ? "outline-primary" : "primary";

    const handleFollowClick = async () => {
        try {
            const response = await fetch(followUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Basic ${localStorage.getItem("token")}`,
                },
            });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            // Toggle following state
            setFollowing(!following);
        } catch (error) {
            console.error("Error following/unfollowing project:", error);
        }
    };

    return (
        <Card className="mb-1 p-1">
            <Card.Body className="p-1 d-flex justify-content-between align-items-center">
                <div>
                    <Card.Title>{project.name}</Card.Title>
                    <Link to={`/project/${project.id}`}>
                        <Card.Subtitle className="mb-2 text-muted">View Project</Card.Subtitle>
                    </Link>
                </div>
                <Button
                    variant={buttonVariant}
                    onClick={handleFollowClick}
                    className="mt-1 d-flex align-items-center"
                >
                    <FollowIcon className="me-1" /> {followText}
                </Button>
            </Card.Body>
        </Card>
    );
}

export default ProjectCard;
