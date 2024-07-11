import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../../ui/Navbar";

function AdminProfile() {
    const { id } = useParams();

    const [profile, setProfile] = useState(null);
    const [error, setError] = useState(null);
    // Retrieve the token from localStorage
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchProfile = async () => {
            try {

                console.log(id);

                const response = await fetch('http://localhost:9001/api/profiles/'+id, {
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
                        <p><strong>GitHub Profile:</strong> <a href={profile.githubProfile}>{profile.githubProfile}</a></p>
                        <p><strong>Other Profile:</strong> <a href={profile.otherProfile}>{profile.otherProfile}</a></p>
                        <div className="profile-skills">
                            <p><strong>Skills:</strong></p>
                            <button type="button" class="btn btn-primary">Add Skills</button>
                        </div>
                        
                        <ul className="list-group">
                            {profile.skills.map(skill => (
                                <li key={skill.id} className="list-group-item">{skill.name}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminProfile;
