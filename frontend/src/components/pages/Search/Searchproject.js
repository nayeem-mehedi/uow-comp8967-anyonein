import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col, Card } from 'react-bootstrap';
import Navbar from "../../ui/Navbar";

function Searchproject() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [topics, setTopics] = useState([]);
  const [skills, setSkills] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('');
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
        setResults(data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchProjects();
  }, [token]);

  useEffect(() => {
    const fetchTopicsAndSkills = async () => {
      try {
        const topicsResponse = await fetch('http://localhost:9001/api/topics', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${token}`,
          },
        });

        const skillsResponse = await fetch('http://localhost:9001/api/skills', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${token}`,
          },
        });

        if (!topicsResponse.ok || !skillsResponse.ok) {
          throw new Error('Network response was not ok');
        }

        const topicsData = await topicsResponse.json();
        const skillsData = await skillsResponse.json();

        setTopics(topicsData);
        setSkills(skillsData);
      } catch (error) {
        console.error('Error fetching topics and skills:', error);
      }
    };

    fetchTopicsAndSkills();
  }, [token]);

  const handleSearch = async (event) => {
    event.preventDefault();
    try {
      let queryString = `http://localhost:9001/api/search/project?page=1&limit=10`;

      if (query) {
        queryString += `&query=${query}`;
      }

      if (selectedTopic) {
        queryString += `&topics=${selectedTopic}`;
      }

      if (selectedSkill) {
        queryString += `&skills=${selectedSkill}`;
      }

      const response = await fetch(queryString, {
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
      setResults(data.data);
    
    } catch (error) {
      console.error('Error searching projects:', error);
    }
  };

  const handleInputChange = (event) => {
    setQuery(event.target.value);
  };

  const handleTopicChange = (event) => {
    setSelectedTopic(event.target.value);
    // setSelectedSkill(''); 
  };

  const handleSkillChange = (event) => {
    setSelectedSkill(event.target.value);
    // setSelectedTopic(''); 
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
            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                placeholder="Project Name"
                value={query}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Topic</Form.Label>
              <Form.Control as="select" value={selectedTopic} onChange={handleTopicChange}>
                <option value="">Select Topic</option>
                {topics.map(topic => (
                  <option key={topic.id} value={topic.name}>
                    {topic.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Skills</Form.Label>
              <Form.Control as="select" value={selectedSkill} onChange={handleSkillChange}>
                <option value="">Select Skill</option>
                {skills.map(skill => (
                  <option key={skill.id} value={skill.name}>
                    {skill.name}
                  </option>
                ))}
              </Form.Control>
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
                  <strong>Topic:</strong> {project.topic.name}<br />
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
