import React, { useState, useEffect } from "react";
import { Container, Row, Col, ListGroup, Modal, Button } from "react-bootstrap";
import Navbar from "../../ui/Navbar";

function NotificationPage() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const fetchNotifications = async () => {
            const token = localStorage.getItem('token'); // Adjust the way you store/retrieve the token as needed

            try {
                const response = await fetch("http://localhost:9001/api/notifications", {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                setNotifications(data.notifications);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchNotifications();
    }, []);

    const handleNotificationClick = async (notification) => {
        if (notification.announcement) {
            setSelectedAnnouncement(notification.announcement);
            setShowModal(true);
        } else {
            console.error('Notification does not have a valid announcement');
        }
    };

    const handleCloseModal = () => setShowModal(false);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="general-bg">
        <Navbar />
        <Container>
            <Row className="my-4">
                <Col>
                    <h1>Notifications</h1>
                </Col>
            </Row>
            <Row>
                <Col>
                    <ListGroup>
                        {notifications.map(notification => (
                            <ListGroup.Item
                                key={notification.id}
                                onClick={() => handleNotificationClick(notification)}
                                style={{ cursor: 'pointer' }}
                            >
                                {notification.content}
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </Col>
            </Row>

            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>{selectedAnnouncement?.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>{selectedAnnouncement?.content}</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button className="grey-btn" variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
        </div>

    );
}

export default NotificationPage;
