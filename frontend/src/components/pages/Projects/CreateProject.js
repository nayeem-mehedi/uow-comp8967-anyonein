import React, { useState, useEffect } from "react";
import Navbar from "../../ui/Navbar";
import { Container, Form, Button, Row, Col, Dropdown } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const CreateProject = () => {
  const [projectData, setProjectData] = useState({
    name: '',
    description: '',
    sourceCodeLink: '',
    topicId: '',
    skills: [],
    users: []
  });

  const [skillInput, setSkillInput] = useState('');
  const [userInput, setUserInput] = useState('');
  const [skillSuggestions, setSkillSuggestions] = useState([]);
  const [userSuggestions, setUserSuggestions] = useState([]);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showSkillDropdown, setShowSkillDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSkills();
    fetchUsers();
  }, []);

  const fetchSkills = async (query) => {
    try {
      const response = await fetch('http://localhost:9001/api/skills', {
        headers: {
          'Authorization': `Basic ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setSkillSuggestions(data);
    } catch (error) {
      console.error('Error fetching skills:', error);
    }
  };

  const fetchUsers = async (query) => {
    try {
      const response = await fetch('http://localhost:9001/api/users', {
        headers: {
          'Authorization': `Basic ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setUserSuggestions(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProjectData({
      ...projectData,
      [name]: value
    });
  };

  const handleSkillChange = (e) => {
    setSkillInput(e.target.value);
    if (e.target.value.length > 2) {
      fetchSkills(e.target.value);
      setShowSkillDropdown(true);
    } else {
      setShowSkillDropdown(false);
    }
  };

  const handleUserChange = (e) => {
    setUserInput(e.target.value);
    if (e.target.value.length > 2) {
      fetchUsers(e.target.value);
      setShowUserDropdown(true);
    } else {
      setShowUserDropdown(false);
    }
  };

  const addSkill = () => {
    if (selectedSkill) {
      setProjectData({
        ...projectData,
        skills: [...projectData.skills, selectedSkill]
      });
      setSkillInput('');
      setSelectedSkill(null);
      setShowSkillDropdown(false);
    }
  };

  const addUser = () => {
    if (selectedUser) {
      setProjectData({
        ...projectData,
        users: [...projectData.users, selectedUser]
      });
      setUserInput('');
      setSelectedUser(null);
      setShowUserDropdown(false);
    }
  };

  const handleSkillSelect = (skill) => {
    setSelectedSkill(skill);
    setSkillInput(skill.name);
    setSkillSuggestions([]);
    setShowSkillDropdown(false);
  };

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setUserInput(user.name);
    setUserSuggestions([]);
    setShowUserDropdown(false);
  };

  const handleSkillFocus = () => {
    setTimeout(() => setShowSkillDropdown(true), 100);
  };

  const handleUserFocus = () => {
    setTimeout(() => setShowUserDropdown(true), 100);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { topicId, ...rest } = projectData;
    const payload = {
      ...rest,
      topic: { id: parseInt(topicId) }
    };

    try {
      const response = await fetch('http://localhost:9001/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log(data);
      // Navigate to the projects list page upon successful creation
      navigate('/projects');
    } catch (error) {
      console.error('There has been a problem with your fetch operation:', error);
      // Handle error (e.g., show error message)
    }
  };

  return (
    <div>
    <Navbar />
    <Container>
      <Row className="justify-content-md-center mt-5">
        <Col md={8}>
          <h2>Create Project</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formProjectName" className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={projectData.name}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="formProjectDescription" className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                value={projectData.description}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="formProjectSourceCodeLink" className="mb-3">
              <Form.Label>Source Code Link</Form.Label>
              <Form.Control
                type="url"
                name="sourceCodeLink"
                value={projectData.sourceCodeLink}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="formProjectTopicId" className="mb-3">
              <Form.Label>Topic</Form.Label>
              <Form.Control
                type="text"
                name="topicId"
                value={projectData.topicId}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="formProjectSkills" className="mb-3">
              <Form.Label>Skills</Form.Label>
              <Row>
                <Col md={10}>
                  <Form.Control
                    type="text"
                    value={skillInput}
                    onChange={handleSkillChange}
                    onFocus={handleSkillFocus}
                    onBlur={() => setShowSkillDropdown(false)}
                  />
                  {showSkillDropdown && skillSuggestions.length > 0 && (
                    <Dropdown.Menu show>
                      {skillSuggestions.map((skill) => (
                        <Dropdown.Item
                          key={skill.id}
                          onMouseDown={() => handleSkillSelect(skill)}
                        >
                          {skill.name}
                        </Dropdown.Item>
                      ))}
                    </Dropdown.Menu>
                  )}
                </Col>
                <Col md={2}>
                  <Button variant="primary" className="main-btn" onClick={addSkill}>
                    Add Skill
                  </Button>
                </Col>
              </Row>
              <ul className="mt-2">
                {projectData.skills.map((skill, index) => (
                  <li key={index}>{skill.name}</li>
                ))}
              </ul>
            </Form.Group>

            <Form.Group controlId="formProjectUsers" className="mb-3">
              <Form.Label>Users</Form.Label>
              <Row>
                <Col md={10}>
                  <Form.Control
                    type="text"
                    value={userInput}
                    onChange={handleUserChange}
                    onFocus={handleUserFocus}
                    onBlur={() => setShowUserDropdown(false)}
                  />
                  {showUserDropdown && userSuggestions.length > 0 && (
                    <Dropdown.Menu show>
                      {userSuggestions.map((user) => (
                        <Dropdown.Item
                          key={user.id}
                          onMouseDown={() => handleUserSelect(user)}
                        >
                          {user.name} ({user.email})
                        </Dropdown.Item>
                      ))}
                    </Dropdown.Menu>
                  )}
                </Col>
                <Col md={2}>
                  <Button variant="primary" className="main-btn" onClick={addUser}>
                    Add User
                  </Button>
                </Col>
              </Row>
              <ul className="mt-2">
                {projectData.users.map((user, index) => (
                  <li key={index}>ID: {user.id}, Name: {user.name}</li>
                ))}
              </ul>
            </Form.Group>

            <Button variant="success" className="main-btn-alt" type="submit">
              Create Project
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
    </div>

  );
};

export default CreateProject;
