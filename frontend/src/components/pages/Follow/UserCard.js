import React, { useState } from "react";
import { Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaUserPlus, FaUserMinus } from "react-icons/fa";

function UserCard({ user, initialFollowing }) {
    const [following, setFollowing] = useState(initialFollowing);
    const followUrl = `http://localhost:9001/api/follow/user/${user.id}`;
    const followText = following ? "Unfollow" : "Follow";
    const FollowIcon = following ? FaUserMinus : FaUserPlus;
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
            console.error("Error following/unfollowing user:", error);
        }
    };

    return (
        <Card className="mb-1 p-1">
            <Card.Body className="p-1 d-flex justify-content-between align-items-center">
                <div>
                    <Card.Title>{`${user.firstName} ${user.lastName}`}</Card.Title>
                    <Link to={`/profile/${user.id}`}>
                        <Card.Subtitle className="mb-2 text-muted">@{user.username}</Card.Subtitle>
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

export default UserCard;
