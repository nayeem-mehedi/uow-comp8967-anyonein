import React, { useState, useEffect } from "react";
import { Container, Row, Col, ListGroup, Modal, Button } from "react-bootstrap";
import Navbar from "../../ui/Navbar";

function NotificationPage() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const token = localStorage.getItem('token');

    const fetchNotifications = async () => {
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

    const readNotification = async (id) => {
        try {
            const response = await fetch(`http://localhost:9001/api/notifications/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            console.log(data);
        } catch (err) {
            setError(err.message);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);



    const handleNotificationClick = async (notification) => {
        await readNotification(notification.id);
        await fetchNotifications();

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
                <Col md={8}>
                    <ListGroup>
                        {notifications.map(notification => (
                            <ListGroup.Item
                                key={notification.id}
                                onClick={() => handleNotificationClick(notification)}
                                style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                            >
                                <span> {notification.isRead ? `${notification.content} [unread]` :
                                    <strong>{`${notification.content} [read]`}</strong>}
                                </span>
                                <span style={{
                                    marginLeft: 'auto',
                                    whiteSpace: 'nowrap'
                                }}>
                                    {new Date(notification.createdAt).toLocaleString()}
                                </span>
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
