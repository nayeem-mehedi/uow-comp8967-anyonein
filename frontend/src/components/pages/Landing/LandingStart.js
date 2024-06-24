import React from "react";
import { Link } from 'react-router-dom';

function LandingStart(){
    return(
        <div className="landing-start-container">
            <div className="landing-start-text">
                <h1>AnyoneIn: Connect, Collaborate, Create</h1>
                <p>We are a community platform aiming to connect innovators with like-minded individuals, help them build their dream project with their dream team. Let’s ignite the power of collaboration!</p>
                <div className="landing-start-buttons">
                    <Link to="/get-started" className="main-btn get-started-btn">Get Started</Link>
                    <Link to="/learn-more" className="main-btn learn-btn">Learn More</Link>
                </div>
            </div>
        </div>
    );
  }

  export default LandingStart;