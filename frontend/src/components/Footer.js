import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { NavLink } from "react-router-dom";

function Footer(){

    const currentYear = new Date().getFullYear();

    return(
      <div className="foot">
        <footer className="footer">
          <div className="footer-top">
            <p>© {currentYear} AnyoneIn</p>
            <h1>AnyoneIn</h1>
            <NavLink to="/learn-more" className="main-btn learn-btn">Learn More</NavLink>
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
                <Link to="https://www.facebook.com/" className="socials">Facebook</Link>
                <Link to="https://www.linkedin.com/" className="socials">Linkedin</Link>
                <Link to="https://x.com/" className="socials">Twitter</Link>
                <Link to="https://www.youtube.com/" className="socials">Youtube</Link>
                <Link to="https://www.instagram.com/" className="socials">Instagram</Link>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  export default Footer;