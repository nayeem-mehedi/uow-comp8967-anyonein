import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Dropdown from 'react-bootstrap/Dropdown';
import { isLoggedIn } from '../../helper/auth';

function PublicNavbar(props) {

    const navigate = useNavigate();

    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        if (isLoggedIn()) {
            setLoggedIn(true);
        }
    }, [navigate]);

    const ProfileDropdown = loggedIn ? <>
        <Dropdown>
            <Dropdown.Toggle className="grey-btn"></Dropdown.Toggle>

            <Dropdown.Menu>
                <Dropdown.Item>
                    <NavLink to="/profile/self" className="nav-items">View Profile</NavLink>
                </Dropdown.Item>
                <Dropdown.Item>
                    <NavLink to="/logout" className="nav-items">Logout</NavLink>
                </Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    </> : <><NavLink to="/login" className="main-btn">Login</NavLink></>

    return (
        <div className="nav-container">
            <nav className="navbar">
                <div className="nav-links">
                    <NavLink to="/home" className="nav-items">Home</NavLink>
                    <NavLink to="/search" className="nav-items">Search Users</NavLink>
                    <NavLink to="/searchproject" className="nav-items">Search Projects</NavLink>
                    <NavLink to="/projects" className="nav-items">Projects</NavLink>
                    <NavLink to="/about" className="nav-items">About Us</NavLink>
                    <NavLink to="/contact" className="nav-items">Contact Us</NavLink>
                </div>
                {ProfileDropdown}
            </nav>
        </div>
    );
}

export default PublicNavbar;