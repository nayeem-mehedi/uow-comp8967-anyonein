import React from "react";
import { Link, NavLink } from "react-router-dom";
import LoginForm from "./LoginForm";
import videoBG from "../../../assets/login-signup-page/login-video-bg.mp4"

function Login(){
    return (
        <div className="login-container">
            <div className="video-bg">
                <video src={videoBG} autoPlay muted loop className="video" />
            </div>
            <div className="login-content">
                <div className="back">
                    <NavLink to="/home" className="grey-btn back-btn">Go Back</NavLink>
                </div>
                <h1>Login</h1>
                <div className="login-form">
                    <LoginForm />
                </div>
                <p>Don't Have an Account? <Link to="/signup" className="signup-link">Sign Up</Link></p>
                {/* <div className="login-socials">
                    <button className="alt-btn" type="submit">Login with Icon</button>
                    <p>or</p>
                    <button className="alt-btn" type="submit">Login with Icon</button>
                </div> */}
            </div>
        </div>
    );
}

export default Login;