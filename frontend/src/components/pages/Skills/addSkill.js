import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from "../../ui/Navbar";
// import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
// import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Select from 'react-select';
//import { useSnackbar } from 'notistack';

const AddSkill = () => {
  const [skills, setSkills] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [/*loading*/, setLoading] = useState(true);
  const { id } = useParams();
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [validated, setValidated] = useState(false);

  // Retrieve the token from localStorage
  const token = localStorage.getItem('token');

  const [values, setValues] = useState({
    profileId: id,
    skillIds: []
  });

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await axios.get('http://localhost:9001/api/skills', {
          headers: {
            'Authorization': `Basic ${token}`,
          }
        });
        const skillOptions = response.data.map(skill => ({
          value: skill.id,
          label: skill.name
        }));
        setSkills(skillOptions);
        setLoading(false);
      } catch (error) {
        setError('Failed to load skills. Please try again.');
        setLoading(false);
      }
    };

    fetchSkills();
  }, [token]);

  const handleChange = (selectedOptions) => {
    const selectedSkillIds = selectedOptions ? selectedOptions.map(option => option.value) : [];
    setSelectedSkills(selectedOptions);
    setValues(prevValues => ({
      ...prevValues,
      skillIds: selectedSkillIds
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    console.log(values);
    if (form.checkValidity() === false) {
      event.stopPropagation();
    } else {
      try {
        const response = await axios.post('http://localhost:9001/api/profile-skills', values, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${token}`,
          }
        });
        if (response.data) {
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
            {/* <Form.Group as={Col} md="6" controlId="validationCustom01"> */}
              {/* <FloatingLabel controlId="floatingSelect" label=""> */}
                <Select
                  isMulti
                  name="skillIds"
                  options={skills}
                  value={selectedSkills}
                  onChange={handleChange}
                  className="basic-multi-select"
                  classNamePrefix="select"
                  placeholder="Select Skills"
                />
              {/* </FloatingLabel> */}
           {/* </Form.Group> */}
          </Row>
          <div className="d-flex justify-content-center">
            <button type="submit" className="btn btn-info">Add Skill</button>
          </div>
          {error && <p className="text-danger text-center mt-3">{error}</p>}
        </Form>
      </div>
    </div>
  );
};

export default AddSkill;
