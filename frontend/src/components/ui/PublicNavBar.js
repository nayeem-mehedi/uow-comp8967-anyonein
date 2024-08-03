import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Dropdown from 'react-bootstrap/Dropdown';
import { isLoggedIn } from '../../helper/auth';
import NotificationBadge from "../pages/Notification/NotificationBadge";
import { ButtonGroup } from "react-bootstrap";

function PublicNavbar(props) {

    const navigate = useNavigate();

    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        if (isLoggedIn()) {
            setLoggedIn(true);
        }
    }, [navigate]);

    const loggedInItems = loggedIn ? <>
        <NavLink to="/search" className="nav-items">Search Users</NavLink>
        <NavLink to="/searchproject" className="nav-items">Search Projects</NavLink>
        <NavLink to="/projects" className="nav-items">Projects</NavLink>
        <NavLink to="/announcement" className="nav-items">Announcements</NavLink>
        <NavLink to="/follow-list" className="nav-items">Follow List</NavLink>
    </> : <></>

    const ProfileDropdown = loggedIn ? <>
        <Dropdown as={ButtonGroup}>
            <Dropdown.Toggle className="grey-btn"></Dropdown.Toggle>

            <Dropdown.Menu >
                <Dropdown.Item className="nav-items-alt">
                    <NavLink to="/profile/self" className="nav-items-alt">View Profile</NavLink>
                </Dropdown.Item>
                <Dropdown.Item className="nav-items-alt">
                    <NavLink to="/logout" className="nav-items-alt">Logout</NavLink>
                </Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    </> : <><NavLink to="/login" className="main-btn">Login</NavLink></>

    return (
        <div className="nav-container">
            <nav className="navbar">
                <div className="nav-links">
                    <NavLink to="/home" className="nav-items">Home</NavLink>
                    {loggedInItems}
                    {/*<NavLink to="/about" className="nav-items">About Us</NavLink>*/}
                    {/*<NavLink to="/contact" className="nav-items">Contact Us</NavLink>*/}
                    {/*<NotificationBadge/>*/}
                </div>
                {ProfileDropdown}
            </nav>
        </div>
    );
}

export default PublicNavbar;