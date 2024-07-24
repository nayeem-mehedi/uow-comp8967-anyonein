import React, {useState, useEffect} from "react";
import {Badge} from "react-bootstrap";
import {NavLink} from "react-router-dom";
import { FaBell, FaBellSlash } from "react-icons/fa";

function NotificationBadge() {
    const [unreadCount, setUnreadCount] = useState(0);
    const token = localStorage.getItem("token");

    const fetchUnreadCount = async () => {
        try {
            const response = await fetch("http://localhost:9001/api/notifications/count", {
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
            setUnreadCount(data.count);
        } catch (error) {
            console.error("Error fetching notification count:", error);
        }
    };

    useEffect(() => {
        fetchUnreadCount(); // Initial fetch when component mounts

        const intervalId = setInterval(fetchUnreadCount, 5000); // Poll every 5 seconds

        return () => clearInterval(intervalId); // Cleanup on unmount
    }, [token]);

    return (
        <NavLink to="/notifications" className="nav-items align-items-center">
            {unreadCount > 0 ? (
                <>
                    <FaBell className="me-1" />
                    <span className="badge bg-primary">{unreadCount}</span>
                </>
            ) : (
                <FaBellSlash className="me-1" />
            )}
        </NavLink>
    );
}

export default NotificationBadge;
