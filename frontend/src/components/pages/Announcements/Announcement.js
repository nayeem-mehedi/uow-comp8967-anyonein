import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button, Modal, Form } from "react-bootstrap";
import Navbar from "../../ui/Navbar";
import { isLoggedIn } from '../../../helper/auth';

function Announcement() {
    const navigate = useNavigate();
    const { id } = useParams();
    const token = localStorage.getItem("token");

    // console.log(id);

    const [loggedIn, setLoggedIn] = useState(false);
    const [announcements, setAnnouncements] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

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
            const response = await fetch('http://localhost:9001/api/announcements/user/2', {
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

    const handleCreateAnnouncement = async () => {
        try {
            const response = await fetch('http://localhost:9001/api/announcements/user', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Basic ${token}`,
                },
                body: JSON.stringify({ title, content })
            });

            if (response.status === 401) {
                console.error("Unauthorized: Please check your authentication token.");
            } else if (!response.ok) {
                console.error("Error creating announcement:", response.statusText);
            } else {
                setShowModal(false);
                fetchAnnouncements();  // Refresh the announcements list
            }
        } catch (error) {
            console.error("Error creating announcement:", error);
        }
    };

    return (
        <Container>
            <Row>
                <Navbar />
            </Row>
            <Row className="mb-3">
                <Col>
                    <Button onClick={() => setShowModal(true)}>Create Announcement</Button>
                </Col>
            </Row>
            <Row>
                <Col>
                    <fieldset>
                        <legend>Announcements</legend>
                        {announcements.length > 0 ? (
                            announcements.map((announcement) => (
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
                            <p>No announcements available.</p>
                        )}
                    </fieldset>
                </Col>
            </Row>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Create Announcement</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formTitle">
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group controlId="formContent">
                            <Form.Label>Content</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="Enter content"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleCreateAnnouncement}>
                        Create Announcement
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}

export default Announcement;