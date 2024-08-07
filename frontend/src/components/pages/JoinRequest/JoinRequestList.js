import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { isLoggedIn } from '../../../helper/auth';

const JoinRequestList = ({projectId}) => {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const [joinRequests, setJoinRequests] = useState([]);

    // console.log(id);
    // const [showModal, setShowModal] = useState(false);
    const [loggedIn, setLoggedIn] = useState(false);
    // const [announcements, setAnnouncements] = useState([]);


    useEffect(() => {
        if (!isLoggedIn()) {
            navigate('/login');
        } else {
            setLoggedIn(true);
        }
    }, [navigate]);

    useEffect(() => {
        if (loggedIn) {
            fetchAnnouncements(projectId);
        }
    }, [loggedIn]);

    const fetchAnnouncements = async (id) => {
        try {
            const response = await fetch(`http://localhost:9001/api/projects/${id}/join-requests`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Basic ${token}`,
                }
            });
            const data = await response.json();
            setJoinRequests(data);  // Accessing the 'data' array from the response
        } catch (error) {
            console.error("Error fetching announcements:", error);
        }
    };

    const handleReject = (id) => {
        console.log(id)
    }

    const handleAccept = (id) => {
        console.log(id)
    }

    return (
        <div>
            <Container>
                <Row>
                    <Col>
                        <fieldset>
                            <legend>Join Requests</legend>
                            {joinRequests && joinRequests.length > 0 ? (
                                joinRequests.map(joinRequest => (
                                    <Card key={joinRequest.id} className="mb-3">
                                        <Card.Body>
                                            <Card.Title>{`Join Request from - ${joinRequest.user.username}`}</Card.Title>
                                            <Card.Text>
                                                <span>Message:</span>
                                                <p>{joinRequest.message}</p>
                                            </Card.Text>
                                            <Card.Footer>
                                                <Button onClick={() => handleReject(joinRequest.id)} className="btn-danger main-btn-alt">Reject</Button>
                                                <Button onClick={() => handleAccept(joinRequest.id)} className="btn-success main-btn-alt">Accept</Button>
                                            </Card.Footer>
                                        </Card.Body>
                                    </Card>
                                ))
                            ) : (
                                <span>You do not have any JOin Request</span>
                            )}
                        </fieldset>
                    </Col>
                </Row>
            </Container>
        </div>

    );
}

export default JoinRequestList;