import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function Footer(){

    const currentYear = new Date().getFullYear();

    return(
      <div className="foot">
        <footer className="footer">
          <div className="footer-top">
            <p>© {currentYear} AnyoneIn</p>
            <h1>AnyoneIn</h1>
            <a className="main-btn footer-btn">Learn More</a>
          </div>
          <div className="footer-bottom">
            <div className="foot-nav">
                <nav className="navbar">
                    <div className="nav-links">
                        <a href="./Landing.js">Home</a>
                        <a href="#">About Us</a>
                        <a href="#">Contact Us</a>
                    </div>
                </nav>
            </div>
            <div className="foot-socials">
                <a href="https://www.facebook.com/">Facebook</a>
                <a href="https://www.facebook.com/">Linkedin</a>
                <a href="https://www.facebook.com/">Twitter</a>
                <a href="https://www.facebook.com/">Youtube</a>
                <a href="https://www.facebook.com/">Instagram</a>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  export default Footer;