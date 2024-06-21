import React from "react";
import { Link, NavLink } from "react-router-dom";
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

function SignupForm() {
    return (
        <div>
            <Row className="g-2">
                <Col md>
                <FloatingLabel controlId="floatingInputGrid" label="First Name" className="signup-field">
                    <Form.Control type="text" placeholder="First Name" />
                </FloatingLabel>
                </Col>
                <Col md>
                <FloatingLabel controlId="floatingInputGrid" label="Last Name" className="signup-field">
                    <Form.Control type="text" placeholder="Last Name" />
                </FloatingLabel>
                </Col>
            </Row>
            <FloatingLabel
                controlId="floatingInput"
                label="Email address"
                className="signup-field"
            >
                <Form.Control type="email" placeholder="name@example.com" />
            </FloatingLabel>
            <FloatingLabel controlId="floatingPassword" label="Password" className="signup-field">
                <Form.Control type="password" placeholder="Password" />
            </FloatingLabel>
            <FloatingLabel controlId="floatingPassword" label="Confirm Password" className="signup-field">
                <Form.Control type="password" placeholder="Confirm Password" />
            </FloatingLabel>
        </div>
      
    );
  }

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
                <div className="signup-btn-div">
                    <button className="grey-btn signup-btn" type="submit">Register</button>
                    <p>Already have an account? <Link to="/login" className="signup-link">Login</Link></p>
                </div>
                <div className="signup-socials">
                    <button className="alt-btn" type="submit">Sign-up with Icon</button>
                    <p>or</p>
                    <button className="alt-btn" type="submit">Sign-up with Icon</button>
                </div>
            </div>
        </div>
    );
}

export default Signup;