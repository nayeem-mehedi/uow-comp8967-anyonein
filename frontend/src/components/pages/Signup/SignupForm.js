import React, { useState } from "react";
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import { useNavigate } from "react-router-dom";
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import axios from 'axios';

function SignupForm() {
    const navigate = useNavigate();
    const [validated, setValidated] = useState(false);
    const [error, setError] = useState("");

    const [values, setValues] = useState({
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        password: "",
        phone: "",
    });

    const handleInput = (event) => {
        setValues(prev => ({ ...prev, [event.target.name]: event.target.value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const form = event.currentTarget;
    
        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {
            try {
                // Create User
                const userResponse = await axios.post('http://localhost:9001/api/auth/register', values);
    
                if (userResponse.data) {
                    const userId = userResponse.data.id;
    
                    // Default values for profile
                    const githubProfile = "N/A";
                    const otherProfile = "N/A";
                    const profilePicture = `https://ui-avatars.com/api/?name=${values.firstName}+${values.lastName}.jpg`;
    
                    // Retrieve token
                    const authToken = localStorage.getItem('token');
                    console.log('Authorization token:', authToken); // Log token for debugging
    
                    // Create Profile
                    await axios.post('http://localhost:9001/api/profiles', {
                        githubProfile,
                        otherProfile,
                        profilePicture,
                        userId,
                    }, {
                        headers: {
                            'Authorization': `Bearer ${authToken}`, // Include the token in the request headers
                            'Content-Type': 'application/json'
                        }
                    });
    
                    navigate('/login');
                }
            } catch (error) {
                setError("Registration failed. Please try again.");
                console.error(error);
            }
        }
    
        setValidated(true);
    };

    return (
        <Form noValidate validated={validated} onSubmit={handleSubmit} className="signup-form">
            <div className="fl-name">
                <Row>
                    <Col>
                        <FloatingLabel controlId="floatingInputGrid" label="First Name" className="signup-field">
                            <Form.Control required type="text" placeholder="First Name" name="firstName" onChange={handleInput} />
                            <Form.Control.Feedback type="invalid">Please enter your first name.</Form.Control.Feedback>
                        </FloatingLabel>
                    </Col>
                    <Col>
                        <FloatingLabel controlId="floatingInputGrid" label="Last Name" className="signup-field">
                            <Form.Control required type="text" placeholder="Last Name" name="lastName" onChange={handleInput} />
                            <Form.Control.Feedback type="invalid">Please enter your last name.</Form.Control.Feedback>
                        </FloatingLabel>
                    </Col>
                </Row>
            </div>
            <FloatingLabel controlId="floatingInput" label="Username" className="signup-field">
                <Form.Control required type="text" placeholder="username123" name="username" onChange={handleInput} />
                <Form.Control.Feedback type="invalid">Please enter your username.</Form.Control.Feedback>
            </FloatingLabel>
            <FloatingLabel controlId="floatingInput" label="Email address" className="signup-field">
                <Form.Control required type="email" placeholder="name@example.com" name="email" onChange={handleInput} />
                <Form.Control.Feedback type="invalid">Please enter a valid email address.</Form.Control.Feedback>
            </FloatingLabel>
            <FloatingLabel controlId="floatingPassword" label="Password" className="signup-field">
                <Form.Control required type="password" placeholder="Password" name="password" onChange={handleInput} />
                <Form.Control.Feedback type="invalid">Please enter a valid password.</Form.Control.Feedback>
            </FloatingLabel>
            <FloatingLabel controlId="floatingInput" label="Phone Number" className="signup-field">
                <Form.Control required type="text" placeholder="Phone Number" name="phone" onChange={handleInput} />
                <Form.Control.Feedback type="invalid">Please enter a valid phone number.</Form.Control.Feedback>
            </FloatingLabel>
            <button className="grey-btn signup-btn" type="submit">Register</button>
            {error && <div className="alert alert-danger mt-3">{error}</div>}
        </Form>
    );
}

export default SignupForm;
