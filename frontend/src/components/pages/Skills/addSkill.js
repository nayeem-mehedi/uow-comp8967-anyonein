import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from "../../ui/Navbar";
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';


const AddSkill = () => {
  const [skills, setSkills] = useState([]);
  const [selectedSkill, setSelectedSkill] = useState('');
  const [/*loading*/, setLoading] = useState(true);
  const { id } = useParams(); // Assuming you need to use this
  const [/*error*/, setError] = useState(null);
  const navigate = useNavigate();
  const [validated, setValidated] = useState(false);

  // Retrieve the token from localStorage
  const token = localStorage.getItem('token');

  const [values, setValues] = useState({
    profileId: id,
    skillId: ''
  });

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await axios.get('http://localhost:9001/api/skills', {
          headers: {
            'Authorization': `Basic ${token}`,
          }
        });
        setSkills(response.data);
        setLoading(false);
      } catch (error) {
        setError('Failed to load skills. Please try again.');
        setLoading(false);
      }
    };

    fetchSkills();
  }, [token]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setSelectedSkill(value);
    setValues(prevValues => ({
      ...prevValues,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
    } else {
      try {
        console.log(values);
        const response = await axios.post('http://localhost:9001/api/profile-skills', values, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${token}`,
          }
        });
        if (response.data) {
          //navigate('/getSkills');
          navigate('/profile/self');
        }
      } catch (error) {
        setError('Submission failed. Please try again.');
      }
    }
    setValidated(true);
  };

  return (
    <div>
      <Navbar />
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Form noValidate validated={validated} onSubmit={handleSubmit} className="w-50">
          <Row className="mb-3 justify-content-center">
            <Form.Group as={Col} md="6" controlId="validationCustom01">
              <FloatingLabel controlId="floatingSelect" label="Select Skill">
                <Form.Select
                  aria-label="Select a skill"
                  name="skillId"
                  value={selectedSkill}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>Select a skill</option>
                  {skills.map(skill => (
                    <option key={skill.id} value={skill.id}>
                      {skill.name}
                    </option>
                  ))}
                </Form.Select>
              </FloatingLabel>
            </Form.Group>
          </Row>
          <div className="d-flex justify-content-center">
            <button type="submit" className="btn btn-primary">Add Skill</button>
          </div>
         
        </Form>
      </div>
    </div>
  );
};

export default AddSkill;
