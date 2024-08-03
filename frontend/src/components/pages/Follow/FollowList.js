import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Navbar from "../../ui/Navbar";
import UserCard from "./UserCard";
import ProjectCard from "./ProjectCard";

function FollowList() {
    const [followingUsers, setFollowingUsers] = useState([]);
    const [followingProjects, setFollowingProjects] = useState([]);
    const [followedByUsers, setFollowedByUsers] = useState([]);
    const [error, setError] = useState(null);
    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchFollowData = async () => {
            try {
                const response = await fetch("http://localhost:9001/api/follow/list", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Basic ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }

                const data = await response.json();
                setFollowingUsers(data.followingUsers);
                setFollowingProjects(data.followingProjects);
                setFollowedByUsers(data.followedByUsers);
            } catch (error) {
                setError(error);
            }
        };

        fetchFollowData();
    }, [token]);

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    if (!followingUsers.length && !followingProjects.length && !followedByUsers.length) {
        return (
            <div className="spinner-border" role="status">
                <span className="sr-only">Loading...</span>
            </div>
        );
    }

    return (
        <div>
            <Navbar />
            <Container>
                <Row>
                    <Col>
                        <h2>Following Users</h2>
                        {followingUsers.map((user) => (
                            <Col key={user.id} xs={12} md={12} className="mb-4">
                                <UserCard user={user} initialFollowing={true}/>
                            </Col>
                        ))}
                    </Col>
                    <Col>
                        <h2>Following Projects</h2>
                        {followingProjects.map((project) => (
                            <Col key={project.id} xs={12} md={12} className="mb-4">
                                <ProjectCard project={project} initialFollowing={true}/>
                            </Col>
                        ))}
                    </Col>
                    <Col>
                        <h2>Followed By Users</h2>
                        {followedByUsers.map((user) => (
                            <Col key={user.id} xs={12} md={12} className="mb-4">
                                <UserCard user={user} initialFollowing={user.following}/>
                            </Col>
                        ))}
                    </Col>
                </Row>
            </Container>
        </div>

    );
}

export default FollowList;
