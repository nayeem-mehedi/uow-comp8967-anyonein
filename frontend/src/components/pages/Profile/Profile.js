import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../ui/Navbar";


function Profile() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [profile, setProfile] = useState(null);
    const [error, setError] = useState(null);
    // Retrieve the token from localStorage
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchProfile = async () => {
            try {

                console.log(id);

                const response = await fetch('http://localhost:9001/api/profiles/' + id, {
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

    // const handleShowSkills = () => {
    //     navigate("/getSkills");
    // }

    const handleAddSkills = () => {
        navigate("/addSkill");
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
                        <p><strong>GitHub Profile:</strong> <a href={profile.githubProfile}>{profile.githubProfile}</a></p>
                        <p><strong>Other Profile:</strong> <a href={profile.otherProfile}>{profile.otherProfile}</a></p>
                        <div className="profile-skills">
                            {/* <button type="button" class="btn btn-info"><NavLink to = "/getSkills">Show Skills</NavLink></button>  */}
                            {/* <button type="button" class="btn btn-info" onClick={handleShowSkills}>Show Skills</button> */}
                            <button onClick={handleEdit} className="btn btn-primary mt-3">Edit Profile</button>
                            <button type="button" class="btn btn-info" onClick={handleAddSkills}>Add Skill</button>
                        </div>
                        <p><strong>Skills:</strong></p>
                    </div>

                    <ul className="list-group">
                        {profile.skills.map(skill => (
                            <div className='skill-div container' key={skill.id}>
                                <div className='col'>
                                    <li className="list-group-item">{skill.name}</li>
                                </div>
                                <div className='col-2'><button type='button' className='btn-close' aria-label="Close"></button></div>
                            </div>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default Profile;
