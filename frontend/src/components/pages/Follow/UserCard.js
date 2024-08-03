import React from "react";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import {FOLLOW_TYPES, FollowButton} from "./FollowButton";
import {followUser} from "../../../helper/apiURL";

function UserCard({ user, initialFollowing }) {

    return (
        <Card className="mb-1 p-1">
            <Card.Body className="p-1 d-flex justify-content-between align-items-center">
                <div>
                    <Card.Title>{`${user.firstName} ${user.lastName}`}</Card.Title>
                    <Link to={`/profile/${user.id}`}>
                        <Card.Subtitle className="mb-2 text-muted">@{user.username}</Card.Subtitle>
                    </Link>
                </div>
                <FollowButton type={FOLLOW_TYPES.USER} followUrl={followUser} id={user.id} initialFollowing={initialFollowing} />
            </Card.Body>
        </Card>
    );
}

export default UserCard;
