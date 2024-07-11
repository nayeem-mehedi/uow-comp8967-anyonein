import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col, Card } from 'react-bootstrap';
import Navbar from "../../ui/Navbar";

function Searchproject() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [allProjects, setAllProjects] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('http://localhost:9001/api/projects', {
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
        setAllProjects(data);
        setResults(data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchProjects();
  }, [token]);

  const handleSearch = (event) => {
    event.preventDefault();
    if (!query) {
      setResults(allProjects);
    } else {
      const filteredResults = allProjects.filter(project =>
        project.name.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filteredResults);
    }
  };

  const handleInputChange = (event) => {
    const inputValue = event.target.value;
    setQuery(inputValue);

    if (inputValue === '') {
      setResults(allProjects);
    } else {
      const filteredResults = allProjects.filter(project =>
        project.name.toLowerCase().includes(inputValue.toLowerCase())
      );
      setResults(filteredResults);
    }
  };

  if (results === null) {
    return (
      <div className="spinner-border" role="status">
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  return (
    <Container>
      <Row className="justify-content-md-center">
        <Navbar />
        <Col md="6">
          <h1 className="text-center search-h1">Search Projects</h1>
          <Form className="search-form" onSubmit={handleSearch}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Control
                type="text"
                placeholder="Project Name"
                value={query}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Button variant="primary" type="submit" style={{ marginBottom: '10px' }}>
              Search
            </Button>
          </Form>
        </Col>
      </Row>
      <Row>
        {results.map((project) => (
          <Col md={4} key={project.id} className="mb-4">
            <Card>
              <Card.Body>
                <Card.Title>{project.name}</Card.Title>
                <Card.Text>
                  <strong>Description:</strong> {project.description}<br />
                  <strong>Source Code Link:</strong> {project.sourceCodeLink ? <a href={project.sourceCodeLink}>View Source</a> : 'N/A'}<br />
                  <strong>Skills:</strong> {project.skills.map(skill => skill.name).join(', ')}<br />
                  <strong>Users:</strong> {project.users.map((user, index) => (
                    <span key={user.id}>
                        <a href={`/profile/${user.id}`}>{`${user.firstName} ${user.lastName}`}</a>
                        {index < project.users.length - 1 && ' , '}
                    </span>))}<br />
                </Card.Text>
                <Button variant="primary" href={`/projects/${project.id}`}>
                  View Project
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default Searchproject;
