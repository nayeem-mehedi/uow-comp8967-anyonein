import React from "react";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NavLink } from "react-router-dom";

function Footer(){

    const currentYear = new Date().getFullYear();

    return(
      <div className="foot">
        <footer className="footer">
          <div className="footer-top">
            <p>© {currentYear} AnyoneIn</p>
            <h1>AnyoneIn</h1>
            <NavLink to="/learn-more" className="main-btn-alt learn-btn">Learn More</NavLink>
          </div>
          <div className="footer-bottom">
            <div className="foot-nav">
                <nav className="navbar">
                    <div className="nav-links">
                      <NavLink to="/home" className="nav-items">Home</NavLink>
                      <NavLink to="/about" className="nav-items">About Us</NavLink>
                      <NavLink to="/contact" className="nav-items">Contact Us</NavLink>
                    </div>
                </nav>
            </div>
            <div className="foot-socials">
                <a href="https://www.facebook.com/" className="socials">Facebook</a>
                <a href="https://www.linkedin.com/" className="socials">Linkedin</a>
                <a href="https://x.com/" className="socials">Twitter</a>
                <a href="https://www.youtube.com/" className="socials">Youtube</a>
                <a href="https://www.instagram.com/" className="socials">Instagram</a>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  export default Footer;