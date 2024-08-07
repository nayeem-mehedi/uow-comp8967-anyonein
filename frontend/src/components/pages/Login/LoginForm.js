import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import {useUserDispatch} from "../../context/UserContext";

function LoginForm() {
    const dispatch = useUserDispatch();

    const navigate = useNavigate();
    const [validated, setValidated] = useState(false);
    const [error, setError] = useState("");
    
    const [values, setValues] = useState({
        username: "",
        password: ""
    });

    const handleInput = (event) => {
        setValues(prev => ({...prev, [event.target.name]: event.target.value}));
    };

      const fetchProfile = async (token) => {

          console.log(token)
        try {
            const response = await fetch(`http://localhost:9001/api/profiles/self`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${token}`,
              },
            });
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            const data = await response.json();
            dispatch({type: 'LOGIN', payload: data});
        } catch (error) {
          // setError(error);
          console.log("Profile fetch error", error);
          navigate('/login');
        }
      };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
          event.stopPropagation();
        } else {
            try {
                console.log(values);
                const response = await axios.post('http://localhost:9001/api/auth/login', values);
                if (response.data) {
                    localStorage.setItem('token', response.data.token);

                    await fetchProfile(response.data.token);
                    navigate('/feed');
                }
            } catch (error) {
                setError("Login failed. Please check your username and password.");
            }
        }
        setValidated(true);
    };

    return (
        <Form noValidate validated={validated} onSubmit={handleSubmit} className="login-form">
            <FloatingLabel
                controlId="floatingInput"
                label="Username"
                className="mb-3 login-field"
            >
                <Form.Control 
                    required
                    type="username" 
                    placeholder="username" 
                    name="username" 
                    onChange={handleInput}
                />
                <Form.Control.Feedback type="invalid">Please enter a valid username.</Form.Control.Feedback>
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