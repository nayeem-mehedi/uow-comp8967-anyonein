import React, { useState } from "react";
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

function SignupForm() {

    const [validated, setValidated] = useState(false);

    //FOR BACKEND TEAM
    const [values, setValues] = useState({
        fname: "",
        lname: "",
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
        <Form noValidate validated={validated} onSubmit={handleSubmit} className="signup-form">
            <div className="fl-name">
                <Row>
                    <Col>
                    <FloatingLabel controlId="floatingInputGrid" label="First Name" className="signup-field">
                        <Form.Control required type="text" placeholder="First Name" name="fname" onChange={handleInput}/>
                        <Form.Control.Feedback type="invalid">Please your first name.</Form.Control.Feedback>
                    </FloatingLabel>
                    </Col>
                    <Col>
                    <FloatingLabel controlId="floatingInputGrid" label="Last Name" className="signup-field">
                        <Form.Control required type="text" placeholder="Last Name" name="lname" onChange={handleInput}/>
                        <Form.Control.Feedback type="invalid">Please enter your last name.</Form.Control.Feedback>
                    </FloatingLabel>
                    </Col>
                </Row>
            </div>
            <FloatingLabel
                controlId="floatingInput"
                label="Email address"
                className="signup-field"
            >
                <Form.Control required type="email" placeholder="name@example.com" name="email" onChange={handleInput}/>
                <Form.Control.Feedback type="invalid">Please enter a valid email address.</Form.Control.Feedback>
            </FloatingLabel>
            <FloatingLabel controlId="floatingPassword" label="Password" className="signup-field">
                <Form.Control required type="password" placeholder="Password" name="password" onChange={handleInput}/>
                <Form.Control.Feedback type="invalid">Please enter a valid password.</Form.Control.Feedback>
            </FloatingLabel>
            <button className="grey-btn signup-btn" type="submit">Register</button>
        </Form>
      
    );
  }

  export default SignupForm;