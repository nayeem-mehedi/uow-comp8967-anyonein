import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button, Modal, Form } from "react-bootstrap";
import { isLoggedIn } from '../../../helper/auth';
import {CreateAnnouncement, ANNOUNCEMENT_TYPE} from "../Announcements/CreateAnnouncement";

function ProjectAnnouncement({projectId}) {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    // console.log(id);
    const [showModal, setShowModal] = useState(false);
    const [loggedIn, setLoggedIn] = useState(false);
    const [announcements, setAnnouncements] = useState([]);


    useEffect(() => {
        if (!isLoggedIn()) {
            navigate('/login');
        } else {
            setLoggedIn(true);
        }
    }, [navigate]);

    useEffect(() => {
        if (loggedIn) {
            fetchAnnouncements();
        }
    }, [loggedIn]);

    const fetchAnnouncements = async () => {
        try {
            const response = await fetch(`http://localhost:9001/api/announcements/project/${projectId}`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Basic ${token}`,
                }
            });
            const data = await response.json();
            setAnnouncements(data.data);  // Accessing the 'data' array from the response
        } catch (error) {
            console.error("Error fetching announcements:", error);
        }
    };

    return (
        <div>
            <Container>
                <div className="createButtonSection">
                    <Button onClick={() => setShowModal(true)} className="main-btn-alt">Create Announcement</Button>
                </div>
                <Row>
                    <Col>
                        <fieldset>
                            <legend>Announcements</legend>
                            {announcements && announcements.length > 0 ? (
                                announcements.map(announcement => (
                                    <Card key={announcement.id} className="mb-3">
                                        <Card.Body>
                                            <Card.Title>{announcement.title}</Card.Title>
                                            <Card.Text>{announcement.content}</Card.Text>
                                            <Card.Footer>
                                                <small className="text-muted">
                                                    Created at: {new Date(announcement.createdAt).toLocaleString()}
                                                </small>
                                            </Card.Footer>
                                        </Card.Body>
                                    </Card>
                                ))
                            ) : (
                                <span>You do not have any announcements. Create one 💬</span>
                            )}
                        </fieldset>
                    </Col>
                </Row>
                <Modal show={showModal} onHide={() => setShowModal(false)}>
                    <CreateAnnouncement
                        type={ANNOUNCEMENT_TYPE.PROJECT_ANNOUNCEMENT}
                        succFunc={() => {
                        setShowModal(false);
                        fetchAnnouncements();  // Refresh the announcements list
                    }}
                        projectId={projectId}/>
                </Modal>
            </Container>
        </div>

    );
}

export default ProjectAnnouncement;