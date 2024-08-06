import React, { useState, useEffect, useCallback } from "react";
import Navbar from "../../ui/Navbar";
import { Container, Form, Button, Row, Col, Dropdown, Badge } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import Select from "react-select";

const EditProject = () => {
  const { id } = useParams();
  // Retrieve the token from localStorage
  const token = localStorage.getItem('token');

  const navigate = useNavigate();

  const [projectData, setProjectData] = useState({
    name: '',
    description: '',
    sourceCodeLink: '',
    topicId: '',
    skills: [],
    users: []
  });

  const [selectedTopic, setSelectedTopic] = useState('');
  const [selectedSkillOptions, setSelectedSkillOptions] = useState([]);
  const [selectedUserList, setSelectedUserList] = useState([]);

  const [skillInput, setSkillInput] = useState('');
  const [userInput, setUserInput] = useState('');
  const [skillSuggestions, setSkillSuggestions] = useState([]);
  const [userSuggestions, setUserSuggestions] = useState([]);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [topics, setTopics] = useState([]);
  const [showTopicDropdown, setShowTopicDropdown] = useState(false);
  const [showSkillDropdown, setShowSkillDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  useEffect(() => {
    fetchProjectDetails();
    fetchTopics();
    fetchSkills();
    fetchUsers();
  }, [id, token]);

  const fetchProjectDetails = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:9001/api/projects/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${token}`,
        },
      });
      const data = await response.json();
      setProjectData(data);

      // setSkills
      const selectedSkillOptions = data.skills.map(skill => ({
        value: skill.id,
        label: skill.name
      }));
      setSelectedSkillOptions(selectedSkillOptions);

      // setTopic
      if(projectData.topic)
        setSelectedTopic(projectData.topic.id);

      //TODO: set Users
      if(projectData.users)
        setSelectedUserList(projectData.users);
    } catch (error) {
      console.error('Error fetching project details:', error);
    }
  }, [id, token]);

  const fetchSkills = async () => {
    try {
      const response = await fetch('http://localhost:9001/api/skills', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${token}`,
        },
      });
      const data = await response.json();
      // prepare skills for the multi select
      const skillOptions = data.map(skill => ({
        value: skill.id,
        label: skill.name
      }));
      setSkillSuggestions(skillOptions);

    } catch (error) {
      console.error('Error fetching skills:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:9001/api/users', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${token}`,
        },
      });
      const data = await response.json();
      setUserSuggestions(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchTopics = async () => {
    try {
      const response = await fetch('http://localhost:9001/api/topics', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${token}`,
        },
      });
      const data = await response.json();
      setTopics(data);
    } catch (error) {
      console.error('Error fetching topics:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProjectData({
      ...projectData,
      [name]: value
    });
  };

  const handleTopicChange = (event) => {
    setSelectedTopic(event.target.value);
    setProjectData({ ...projectData, topicId: event.target.value });
  };

  const handleSkillsChange = (selectedOptions) => {
    const selectedSkills = selectedOptions ? selectedOptions.map(option => {
      return {id: option.value}
    }) : [];
    setSelectedSkillOptions(selectedOptions);
    setProjectData({
      ...projectData,
      skills: selectedSkills
    })
  };

  const handleSkillChange = (e) => {
    setSkillInput(e.target.value);
    if (e.target.value.length > 2) {
      fetchSkills(e.target.value);
    }
  };

  const handleUserChange = (e) => {
    setUserInput(e.target.value);
  };

  const addSkill = () => {
    if (selectedSkill) {
      setProjectData({
        ...projectData,
        skills: [...projectData.skills, selectedSkill]
      });
      setSkillInput('');
      setSelectedSkill(null);
      setShowSkillDropdown(false); // Hide dropdown after selection
    }
  };

  const addUser = () => {
    setSelectedUserList([
      ...selectedUserList,
      selectedUser
    ]);

    setProjectData({
      ...projectData,
      users: [
          ...projectData.users,
        {id: selectedUser.id}
      ]
    })

    setUserInput('');
    setSelectedUser(null);
    setShowUserDropdown(false);
  };

  const removeUser = (id) => {
    console.log(id);
    const newUserList = selectedUserList.filter(user => user.id !== id);

    setSelectedUserList([
      ...newUserList
    ]);

    setProjectData({
      ...projectData,
      users: newUserList.map(user => {
        return {id: user.id}
      })
    })

  };

  const handleSkillSelect = (skill) => {
    setSelectedSkill(skill);
    setSkillInput(skill.name);
    setSkillSuggestions([]);
  };

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setUserInput(user.username);
  };

  const handleTopicSelect = (topic) => {
    setProjectData({ ...projectData, topicId: topic.id });
    setShowTopicDropdown(false); // Hide dropdown after selection
  };

  const handleTopicFocus = () => {
    setShowTopicDropdown(true);
  };

  const handleTopicBlur = () => {
    setTimeout(() => setShowTopicDropdown(false), 200); // Delay to allow dropdown item click
  };

  const handleSkillFocus = () => {
    setShowSkillDropdown(true);
  };

  const handleSkillBlur = () => {
    setTimeout(() => setShowSkillDropdown(false), 200); // Delay to allow dropdown item click
  };

  const handleUserFocus = () => {
    setShowUserDropdown(true);
  };

  const handleUserBlur = () => {
    setTimeout(() => setShowUserDropdown(false), 200); // Delay to allow dropdown item click
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    //TODO: CHECK ALL data

    const { topicId, ...rest } = projectData;
    const payload = {
      ...rest,
      topic: { id: parseInt(topicId) }
    };

    try {
      const response = await fetch(`http://localhost:9001/api/projects/${id}`, {
        method: 'PUT',
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
      navigate(`/projects/${id}`);
    } catch (error) {
      console.error('There has been a problem with your fetch operation:', error);
    }
  };

  const selectedUsersPrint = <>
    {selectedUserList.map((user, index) => (
        <li key={`selected-user-${index}-${user.username}`}>
          <span><strong>{user.username}</strong> - {user.email}</span>
          <button type="button" className="btn btn-close" onClick={() => removeUser(user.id)}></button>
        </li>
    ))}
  </>;


  return (
    <>
      <Navbar />
      <Container>
        <Row className="justify-content-md-center mt-5">
          <Col md={8}>
            <h2>Edit Project</h2>
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

                <Form.Control as="select" value={selectedTopic} onChange={handleTopicChange}>
                  <option value="">Select Topic</option>
                  {topics.map(topic => (
                      <option key={topic.id} value={topic.id}>
                        {topic.name}
                      </option>
                  ))}
                </Form.Control>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Skills</Form.Label>
                <Row>
                  <Col md={12}>
                    <Select
                        formatGroupLabel="formProjectSkills"
                        name="formProjectSkills"
                        className="basic-multi-select"
                        classNamePrefix="select"
                        placeholder="Select Skills"
                        isMulti
                        isSearchable={true}
                        options={skillSuggestions}
                        onChange={handleSkillsChange}
                        value={selectedSkillOptions}
                        hasValue={true}
                        required={true}
                    />
                  </Col>
                </Row>
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
                      onBlur={handleUserBlur}
                      // onClick={handleUserFocus}
                    />
                    {showUserDropdown && userSuggestions.length > 0 && (
                      <Dropdown.Menu show>
                        {userSuggestions.map((user) => (
                          <Dropdown.Item
                            key={user.id}
                            onClick={() => handleUserSelect(user)}
                          >
                            {user.username} ({user.email})
                          </Dropdown.Item>
                        ))}
                      </Dropdown.Menu>
                    )}
                  </Col>
                  <Col md={2} style={{ textAlign: 'right' }}>
                    <Button variant="secondary" onClick={addUser}>
                      Add User
                    </Button>
                  </Col>
                </Row>
                <ul className="mt-2">
                  {selectedUsersPrint}
                </ul>
              </Form.Group>

              <Button variant="primary" type="submit">
                Save Changes
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default EditProject;
