import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from "../../ui/Navbar";
import Button from 'react-bootstrap/Button';
// import { useSnackbar } from 'notistack';

const DeleteSkill = () => {
  const [error, setError] = useState(null);
  const [/*loading*/, setLoading] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams();
 

  // Retrieve the token from localStorage
  const token = localStorage.getItem('token');
  
  console.log(id);
  const handleDelete = async () => {
    try {
      const response = await axios.delete(`http://localhost:9001/api/profile-skills/${id}`, { 
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${token}`,
        }
      });
      setLoading(false);
      
      if (response.status === 200) { // assuming 200 No Content for successful deletion
        // enqueueSnackbar('Book Deleted successfully', { variant: 'success' });
        navigate('/profile/self'); // or the appropriate route after deletion
      }
    } catch (error) {
      setError('Deletion failed. Please try again.');
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container mt-4">
        <h1 className="mb-4">Delete Skill</h1>
        <p>Are you sure you want to delete this skill?</p>
        {error && <p className="text-danger">{error}</p>}
        <Button variant="danger" onClick={handleDelete}>Delete</Button>
      </div>
    </div>
  );
};

export default DeleteSkill;
