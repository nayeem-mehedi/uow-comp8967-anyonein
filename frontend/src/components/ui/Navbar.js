import React from "react";
import { NavLink } from "react-router-dom";
import Dropdown from 'react-bootstrap/Dropdown';

function ProfileDropdown() {
  return (
    <Dropdown>
      <Dropdown.Toggle className="grey-btn"></Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Item href="#/action-1">View Profile</Dropdown.Item>
        <Dropdown.Item href="#/action-2">Logout</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}

function Navbar(props) {
    return (
      <div className="nav-container">
          <nav className="navbar">
              <div className="nav-links">
                <NavLink to="/home" className="nav-items">Home</NavLink>
                <NavLink to="/about" className="nav-items">About Us</NavLink>
                <NavLink to="/contact" className="nav-items">Contact Us</NavLink>
              </div>
              {props.isLoggedIn === false ? (<NavLink to="/login" className="main-btn">Login</NavLink>) : (<ProfileDropdown />)}
          </nav>
      </div>
    );
  }

  export default Navbar;