import React from "react";
import { Link, NavLink } from "react-router-dom";
import SignupForm from "./SignupForm";

function Signup(){
    return (
        <div className="signup-container">
            <div className="signup-content">
                <div className="back">
                    <NavLink to="/login" className="grey-btn back-btn">Go Back</NavLink>
                </div>
                <h1>Sign Up</h1>
                <div className="signup-form">
                    <SignupForm />
                </div>
                <p>Already have an account? <Link to="/login" className="login-link">Login</Link></p>
                {/* <div className="signup-socials">
                    <button className="alt-btn" type="submit">Sign-up with Icon</button>
                    <p>or</p>
                    <button className="alt-btn" type="submit">Sign-up with Icon</button>
                </div> */}
            </div>
        </div>
    );
}

export default Signup;