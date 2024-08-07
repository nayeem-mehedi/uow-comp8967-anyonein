import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col, Card, Pagination } from 'react-bootstrap';
import Navbar from "../../ui/Navbar";
import { FOLLOW_TYPES, FollowButton } from "../Follow/FollowButton";
import { followProject } from "../../../helper/apiURL";
import { IconButton } from "@mui/material";
import { BiSearch } from 'react-icons/bi';

function SearchProject() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [topics, setTopics] = useState([]);
  const [skills, setSkills] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProjects, setTotalProjects] = useState(0);
  const [projectsPerPage, setProjectsPerPage] = useState(9);
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
        setTotalProjects(data.length);
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
      let queryString = `http://localhost:9001/api/search/project?page=1&limit=`;

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
      setTotalProjects(data.total);
      setCurrentPage(1);
    } catch (error) {
      console.error('Error searching projects:', error);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleInputChange = (event) => {
    setQuery(event.target.value);
  };

  const handleTopicChange = (event) => {
    setSelectedTopic(event.target.value);
  };

  const handleSkillChange = (event) => {
    setSelectedSkill(event.target.value);
  };

  const handleProjectsPerPageChange = (event) => {
    setProjectsPerPage(Number(event.target.value));
    setCurrentPage(1);
  };

  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = results.slice(indexOfFirstProject, indexOfLastProject);

  if (results === null) {
    return (
      <div className="spinner-border" role="status">
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  return (
    <div className="general-bg">
      <Navbar />
      <Container>
        <Row className="justify-content-md-center">
          <Col lg="12"><h1 className="text-center search-h1">Search Projects</h1></Col>
          <Col lg="12">
            <Form className="search-form" onSubmit={handleSearch}>
              <Row>
                <Col lg="5">
                  <Form.Group className="mb-3">
                    <Form.Control
                      type="text"
                      placeholder="Project Name"
                      value={query}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </Col>
                <Col lg="3">
                  <Form.Group className="mb-3">
                    <Form.Control as="select" value={selectedTopic} onChange={handleTopicChange}>
                      <option value="">Select Topic</option>
                      {topics.map(topic => (
                        <option key={topic.id} value={topic.name}>
                          {topic.name}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                </Col>
                <Col lg="3">
                  <Form.Group className="mb-3">
                    <Form.Control as="select" value={selectedSkill} onChange={handleSkillChange}>
                      <option value="">Select Skill</option>
                      {skills && skills.map(skill => (
                        <option key={skill.id} value={skill.name}>
                          {skill.name}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                </Col>
                <Col lg="1">
                  <IconButton type="submit"><BiSearch /></IconButton>
                </Col>
              </Row>
            </Form>
          </Col>
        </Row>
        <Row>
          <Row className="mb-3" style={{ justifyContent: 'flex-end', alignItems: 'center' }}>
            <Col xs="auto">
              <Form.Label style={{ marginBottom: '0', marginRight: '10px' }}>Projects per page:</Form.Label>
            </Col>
            <Col xs="auto">
              <Form.Control
                as="select"
                value={projectsPerPage}
                onChange={handleProjectsPerPageChange}
                style={{ width: 'auto', maxWidth: '120px' }}
              >
                <option value={3}>3</option>
                <option value={6}>6</option>
                <option value={9}>9</option>
              </Form.Control>
            </Col>
          </Row>
          {currentProjects.map((project) => (
            <Col md={4} key={project.id} className="mb-4">
              <Card>
                <Card.Body>
                  <Card.Title>{project.name}</Card.Title>
                  <Card.Text>
                    <strong>Description:</strong> {project.description}<br />
                    <strong>Source Code Link:</strong> {project.sourceCodeLink ? <a href={project.sourceCodeLink}>View Source</a> : 'N/A'}<br />
                    <strong>Skills:</strong> {project.skills && project.skills.map(skill => skill.name).join(', ')}<br />
                    <strong>Topic:</strong> {project.topic && project.topic.name}<br />
                    <strong>Users:</strong> {project.users && project.users.map((user, index) => (
                      <span key={user.id}>
                        <a href={`/profile/${user.id}`}>{`${user.firstName} ${user.lastName}`}</a>
                        {index < project.users.length - 1 && ' , '}
                      </span>))}<br />
                  </Card.Text>
                  <Button variant="primary" className="main-btn-alt" href={`/projects/${project.id}`}>
                    View Project
                  </Button>
                  <FollowButton type={FOLLOW_TYPES.PROJECT} followUrl={followProject} id={project.id} initialFollowing={false} />
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
        <Row style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Pagination>
              {[...Array(Math.ceil(totalProjects / projectsPerPage))].map((_, index) => (
                <Pagination.Item
                  key={index + 1}
                  active={index + 1 === currentPage}
                  onClick={() => handlePageChange(index + 1)}
                  style={{ margin: '0 4px' }}
                >
                  {index + 1}
                </Pagination.Item>
              ))}
            </Pagination>
          </div>
        </Row>
      </Container>
    </div>
  );
}

export default SearchProject;
