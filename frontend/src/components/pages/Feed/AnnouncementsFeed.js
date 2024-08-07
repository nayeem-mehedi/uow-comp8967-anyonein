import React, { useState, useEffect } from 'react';
import Navbar from "../../ui/Navbar";
import { Container } from 'react-bootstrap';
import AnnouncementCard from "../Announcements/AnnouncementCard";

const AnnouncementsFeed = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                const response = await fetch('http://localhost:9001/api/announcements/feed', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Basic ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                setAnnouncements(data);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchAnnouncements();
    }, [token]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error fetching announcements: {error.message}</div>;

    return (
        <div className="general-bg">
            <Navbar />
            <Container>
                <div className="announcements-feed">
                    {announcements.map((announcement) => (
                        <AnnouncementCard announcement={announcement} />
                    ))}
                </div>
            </Container>
        </div>
    );
};

export default AnnouncementsFeed;
