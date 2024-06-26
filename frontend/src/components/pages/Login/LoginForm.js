import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import axios from 'axios';

function LoginForm() {

    const navigate = useNavigate();
    const [validated, setValidated] = useState(false);
    const [error, setError] = useState("");
    
    const [values, setValues] = useState({
        email: "",
        password: ""
    });

    const handleInput = (event) => {
        setValues(prev => ({...prev, [event.target.name]: [event.target.value]}));
    };

    const handleSubmit = async (event) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
          event.preventDefault();
          event.stopPropagation();
        } else {
            try {
                const response = await axios.post('http://localhost:9001/api/auth/login', values);
                if (response.data) {
                    localStorage.setItem('token', response.data.token); 
                    navigate('/profile'); 
                }
            } catch (error) {
                setError("Login failed. Please check your email and password.");
            }
        }
        setValidated(true);
    };

    return (
        <Form noValidate validated={validated} onSubmit={handleSubmit} className="login-form">
            <FloatingLabel
                controlId="floatingInput"
                label="Email address"
                className="mb-3 login-field"
            >
                <Form.Control 
                    required
                    type="email" 
                    placeholder="name@example.com" 
                    name="email" 
                    onChange={handleInput}
                />
                <Form.Control.Feedback type="invalid">Please enter a valid email.</Form.Control.Feedback>
            </FloatingLabel>
            <FloatingLabel
                controlId="floatingPassword" 
                label="Password" 
                className="login-field"
            >
                <Form.Control
                    required
                    type="password" 
                    placeholder="Password" 
                    name="password" 
                    onChange={handleInput}
                />
                <Form.Control.Feedback type="invalid">Please enter a valid password.</Form.Control.Feedback>
            </FloatingLabel>
            <button className="grey-btn login-btn" type="submit">Login</button>
        </Form>
    );
}

export default LoginForm;