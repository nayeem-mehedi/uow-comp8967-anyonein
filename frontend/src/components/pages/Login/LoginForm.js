import React, { useState } from "react";
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';

function LoginForm() {

    const [validated, setValidated] = useState(false);

    //FOR BACKEND TEAM
    const [values, setValues] = useState({
        email: "",
        password: ""
    });

    const handleInput = (event) => {
        setValues(prev => ({...prev, [event.target.name]: [event.target.value]}));
    };

    const handleSubmit = (event) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
          event.preventDefault();
          event.stopPropagation();
        }
        setValidated(true);

        //BACKEND TEAM CALL YOUR API HERE
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