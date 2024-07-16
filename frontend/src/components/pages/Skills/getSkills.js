import React, { useState, useEffect } from 'react';
//import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from "../../ui/Navbar";


const GetSkills = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  //const [showType, setShowType] = useState('all');
  const { id } = useParams(); // Assuming you need to use this
  const [error, setError] = useState(null);
  // Retrieve the token from localStorage
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchSkills = async () => {
      try {

        console.log(id);

        const response = await fetch('http://localhost:9001/api/skills/', {
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
        setSkills(data);
        setLoading(false);
      } catch (error) {
        setError(error);
      }
    };

    fetchSkills();
  }, [id, token]);

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!skills) {
    return (
      <div class="spinner-border" role="status">
        <span class="sr-only">Loading...</span>
      </div>
    );
  }


 
    return (
      <div className="container mt-4">
        <Navbar />
        <h1 className='test-3xl my-4'>Skills List</h1>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div>
            <ul className="list-group">
            {skills.map(skill => (
               <li key={skill.id} className="list-group-item">{skill.name}</li>
            ))}
            </ul>
          </div>
        )}
      </div>
    );
  }

export default GetSkills;