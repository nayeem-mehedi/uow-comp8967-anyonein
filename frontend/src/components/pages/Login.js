import React from "react";
import { Link, NavLink } from "react-router-dom";
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';

function LoginForm() {
    return (
      <>
        <FloatingLabel
          controlId="floatingInput"
          label="Email address"
          className="mb-3 login-field"
        >
          <Form.Control type="email" placeholder="name@example.com" />
        </FloatingLabel>
        <FloatingLabel controlId="floatingPassword" label="Password" className="login-field">
          <Form.Control type="password" placeholder="Password" />
        </FloatingLabel>
      </>
    );
  }

function Login(){
    return (
        <div className="login-container">
            <div className="login-content">
                <div className="back">
                    <NavLink to="/home" className="grey-btn back-btn">Go Back</NavLink>
                </div>
                <h1>Login</h1>
                <div className="login-form">
                    <LoginForm />
                </div>
                <div className="login-btn-div">
                    <button className="grey-btn login-btn" type="submit">Login</button>
                    <p>Don't Have an Account? <Link to="/signup" className="signup-link">Sign Up</Link></p>
                </div>
                <div className="login-socials">
                    <button className="alt-btn" type="submit">Login with Icon</button>
                    <p>or</p>
                    <button className="alt-btn" type="submit">Login with Icon</button>
                </div>
            </div>
        </div>
    );
}

export default Login;