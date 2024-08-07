import React from 'react';
import { Dropdown, ButtonGroup } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

const ProfileDropdown = ({ loggedIn, profile }) => {
    return loggedIn ? (
        <Dropdown as={ButtonGroup} align="end">
            <Dropdown.Toggle variant="outline-dark" className="d-flex align-items-center">
                <img src={profile.profilePicture} alt="User Avatar" className="rounded-circle me-2" style={{ width: '30px', height: '30px' }} />
            </Dropdown.Toggle>

            <Dropdown.Menu>
                <Dropdown.Item as={NavLink} to="/profile/self">
                    View Profile
                </Dropdown.Item>
                <Dropdown.Item as={NavLink} to="/logout">
                    Logout
                </Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    ) : (
        <NavLink to="/login" className="btn btn-primary">
            Login
        </NavLink>
    );
};

export default ProfileDropdown;
