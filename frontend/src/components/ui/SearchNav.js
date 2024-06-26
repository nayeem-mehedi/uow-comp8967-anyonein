import React from "react";
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function FormExample() {
  return (
    <Navbar className="bg-body-tertiary">
        <Form className="ms-auto">
            <Row>
            <Col></Col>
            <Col xs="auto">
                <Form.Control
                type="text"
                placeholder="Search"
                className="me-sm-2"
                />
            </Col>
            <Col xs="auto">
                <Button type="submit" className="alt-btn">Submit</Button>
            </Col>
            </Row>
        </Form>
    </Navbar>
  );
}

function SearchNav(){
    return (
        <FormExample />
    );
}

export default SearchNav;