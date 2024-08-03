import React, {useState} from "react";
import {Button} from "react-bootstrap";
import {FaRegBookmark, FaBookmark} from "react-icons/fa";
import { FaUserPlus, FaUserMinus } from "react-icons/fa";

function FollowButton({type=FOLLOW_TYPES.USER, followUrl, id, initialFollowing}) {
    console.log(followUrl);
    const [following, setFollowing] = useState(initialFollowing);
    const finalFollowUrl = `${followUrl}/${id}`;
    const followText = following ? "Unfollow" : "Follow";
    const FollowIcon = type === FOLLOW_TYPES.USER ? following ? FaUserMinus : FaUserPlus : following ? FaBookmark : FaRegBookmark;
    const buttonVariant = following ? "outline-primary" : "primary";

    const handleFollowClick = async () => {
        try {
            const response = await fetch(finalFollowUrl, {
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
        <Button
            variant={buttonVariant}
            onClick={handleFollowClick}
            className="mt-1 d-flex align-items-center"
        >
            <FollowIcon className="me-1"/> {followText}
        </Button>
    );
}

const FOLLOW_TYPES = {USER: 1, PROJECT: 2};

export {FollowButton, FOLLOW_TYPES};
