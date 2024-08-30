import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, /*Card,Form,*/ Button, Modal } from "react-bootstrap";
import Navbar from "../../ui/Navbar";
import { isLoggedIn } from '../../../helper/auth';
import {CreateAnnouncement, ANNOUNCEMENT_TYPE} from "./CreateAnnouncement";
import AnnouncementCard from "./AnnouncementCard";

function Announcement() {
    const navigate = useNavigate();
    const { /*id*/ } = useParams();
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
            const response = await fetch('http://localhost:9001/api/announcements/user/self', {
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
        <div className="general-bg">
            <Navbar />
            <Container>
                <div className="createButtonSection">
                    <Button onClick={() => setShowModal(true)} className="main-btn-alt">Create Announcement</Button>
                </div>
                <Row>
                    <Col>
                        <fieldset>
                            <legend>Announcements</legend>
                            {announcements && announcements.length > 0 ? (
                                announcements.map((announcement) => (
                                    <AnnouncementCard announcement={announcement} />
                                ))
                            ) : (
                                <span>You do not have any announcements. Create one 💬</span>
                            )}
                        </fieldset>
                    </Col>
                </Row>
                <Modal show={showModal} onHide={() => setShowModal(false)}>
                    <CreateAnnouncement type={ANNOUNCEMENT_TYPE.USER_ANNOUNCEMENT} succFunc={() => {
                        setShowModal(false);
                        fetchAnnouncements();  // Refresh the announcements list
                    }}/>
                </Modal>
            </Container>
        </div>

    );
}

export default Announcement;