import React from "react";
import { NavLink } from "react-router-dom";

function Navbar() {
    return (
      <div className="nav-div">
          <nav className="navbar">
              <div className="nav-links">
                <NavLink to="/home" className="nav-items">Home</NavLink>
                <NavLink to="/about" className="nav-items">About Us</NavLink>
                <NavLink to="/contact" className="nav-items">Contact Us</NavLink>
              </div>
              
                <NavLink to="/login" className="main-btn login-btn">Login</NavLink>
          </nav>
      </div>
    );
  }

  export default Navbar;