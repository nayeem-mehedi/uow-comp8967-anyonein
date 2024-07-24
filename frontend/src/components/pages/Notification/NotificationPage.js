import React from "react";
import { Container, Row, Col, ListGroup } from "react-bootstrap";
import Navbar from "../../ui/Navbar";

// TODO: @Turjo
const demoNotifications = [
    { id: 1, message: "You have a new follower!" },
    { id: 2, message: "Your post has been liked!" },
    { id: 3, message: "Someone commented on your post." },
    { id: 4, message: "Your profile has been viewed." },
    { id: 5, message: "You have a new message." }
];

function NotificationPage() {
    return (
        <Container>
            <Row>
                <Navbar />
            </Row>
            <Row className="my-4">
                <Col>
                    <h1>Notifications</h1>
                </Col>
            </Row>
            <Row>
                <Col>
                    <ListGroup>
                        {demoNotifications.map(notification => (
                            <ListGroup.Item key={notification.id}>
                                {notification.message}
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </Col>
            </Row>
        </Container>
    );
}

export default NotificationPage;
