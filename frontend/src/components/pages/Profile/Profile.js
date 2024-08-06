import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../ui/Navbar";
import axios from 'axios';
import { useSnackbar } from 'notistack';
import Accordion from 'react-bootstrap/Accordion';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

function Profile() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [profile, setProfile] = useState(null);
    const [error, setError] = useState(null);
    const { enqueueSnackbar } = useSnackbar();
    // Retrieve the token from localStorage
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch(`http://localhost:9001/api/profiles/${id}`, {
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
                setProfile(data);
            } catch (error) {
                setError(error);
            }
        };

        fetchProfile();
    }, [id, token]);

    const handleEdit = () => {
        navigate(`/edit-profile/${id}`);
    };

    const handleAddSkills = () => {
        navigate("/addSkill");
    };

    const handleDeleteSkills = async (skillId) => {
        try {
            const response = await axios.delete(`http://localhost:9001/api/profile-skills/${skillId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Basic ${token}`,
                }
            });

            if (response.status === 200) {
                // Remove the deleted skill from the profile state
                setProfile(prevProfile => ({
                    ...prevProfile,
                    skills: prevProfile.skills.filter(skill => skill.id !== skillId)
                }));
                enqueueSnackbar('Deleted successfully', { variant: 'success' });
            }
        } catch (error) {
            enqueueSnackbar('Failed to delete', { variant: 'error' });
        }
    };

    const handleChangePassword = () => {
        navigate("/change-password");
    };

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    if (!profile) {
        return (
            <div className="spinner-border" role="status">
                <span className="sr-only">Loading...</span>
            </div>
        );
    }

    return (
        <div>
            <Navbar />
            <div className="container mt-4">
                <h1 className="mb-4">Profile</h1>
                <div className="row">
                    <div className="col-md-4">
                        <img src={profile.profilePicture} alt="Profile" className="img-fluid rounded mb-3" />
                    </div>
                    <div className="col-md-8">
                        <p><strong>Username:</strong> {profile.user.username}</p>
                        <p><strong>First Name:</strong> {profile.user.firstName}</p>
                        <p><strong>Last Name:</strong> {profile.user.lastName}</p>
                        <p><strong>Email:</strong> {profile.user.email}</p>
                        <p><strong>Phone:</strong> {profile.user.phone}</p>
                        <p><strong>GitHub Profile:</strong> <a href={profile.githubProfile} target="_blank" rel="noopener noreferrer">{profile.githubProfile}</a></p>
                        <p><strong>Other Profile:</strong> <a href={profile.otherProfile} target="_blank" rel="noopener noreferrer">{profile.otherProfile}</a></p>
                        <div className="d-flex align-items-center mt-3">
                            <button onClick={handleEdit} className="btn btn-primary main-btn-alt">Edit Profile</button>
                            <button
                                onClick={handleChangePassword}
                                className="btn btn-secondary"
                                style={{ marginLeft: '16px' }} // Inline style for spacing
                            >
                                Change Password
                            </button>
                        </div>
                        <Accordion className="mt-4">
                            <Accordion.Item eventKey="0">
                                <Accordion.Header>Skills</Accordion.Header>
                                <Accordion.Body>
                                    <div className="d-flex align-items-center mb-3">
                                        <button type="button" className="btn btn-primary main-btn-alt" onClick={handleAddSkills}>Add Skill</button>
                                    </div>
                                    <ul className="list-group">
                                        {profile.skills.map(skill => (
                                            <li className="list-group-item d-flex justify-content-between align-items-center" key={skill.id}>
                                                {skill.name}
                                                <button type='button' className='btn btn-danger btn-sm' onClick={() => handleDeleteSkills(skill.id)}>Delete</button>
                                            </li>
                                        ))}
                                    </ul>
                                </Accordion.Body>
                            </Accordion.Item>
                        </Accordion>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;
