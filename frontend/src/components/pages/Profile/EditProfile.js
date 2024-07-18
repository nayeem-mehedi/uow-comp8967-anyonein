
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../ui/Navbar";

function EditProfile() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [profile, setProfile] = useState({
        user: {
            username: "",
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
        },
        githubProfile: "",
        otherProfile: "",
        profilePicture: "",
        skills: []
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
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
                setLoading(false);
            } catch (error) {
                setError(error);
                setLoading(false);
            }
        };

        fetchProfile();
    }, [id, token]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name in profile.user) {
            setProfile({
                ...profile,
                user: {
                    ...profile.user,
                    [name]: value
                }
            });
        } else {
            setProfile({
                ...profile,
                [name]: value
            });
        }
    };

    const handleSkillChange = (index, value) => {
        const newSkills = profile.skills.map((skill, i) => {
            if (i === index) {
                return { ...skill, name: value };
            }
            return skill;
        });
        setProfile({ ...profile, skills: newSkills });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:9001/api/profiles/' + id, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Basic ${token}`,
                },
                body: JSON.stringify(profile),
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            navigate(`/profile/${id}`);
        } catch (error) {
            setError(error);
        }
    };

    if (loading) {
        return (
            <div className="spinner-border" role="status">
                <span className="sr-only">Loading...</span>
            </div>
        );
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div>
            <Navbar />
            <div className="container mt-4">
                <h1 className="mb-4">Edit Profile</h1>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label><strong>Username</strong></label>
                        <input
                            type="text"
                            name="username"
                            value={profile.user.username}
                            onChange={handleChange}
                            className="form-control"
                        />
                    </div>
                    <div className="form-group">
                        <label><strong>First Name</strong></label>
                        <input
                            type="text"
                            name="firstName"
                            value={profile.user.firstName}
                            onChange={handleChange}
                            className="form-control"
                        />
                    </div>
                    <div className="form-group">
                        <label><strong>Last Name</strong></label>
                        <input
                            type="text"
                            name="lastName"
                            value={profile.user.lastName}
                            onChange={handleChange}
                            className="form-control"
                        />
                    </div>
                    <div className="form-group">
                        <label><strong>Email</strong></label>
                        <input
                            type="email"
                            name="email"
                            value={profile.user.email}
                            onChange={handleChange}
                            className="form-control"
                        />
                    </div>
                    <div className="form-group">
                        <label><strong>Phone Number</strong></label>
                        <input
                            type="text"
                            name="phone"
                            value={profile.user.phone}
                            onChange={handleChange}
                            className="form-control"
                        />
                    </div>
                    <div className="form-group">
                        <label><strong>GitHub Profile</strong></label>
                        <input
                            type="text"
                            name="githubProfile"
                            value={profile.githubProfile}
                            onChange={handleChange}
                            className="form-control"
                        />
                    </div>
                    <div className="form-group">
                        <label><strong>Other Profile Links</strong></label>
                        <input
                            type="text"
                            name="otherProfile"
                            value={profile.otherProfile}
                            onChange={handleChange}
                            className="form-control"
                        />
                        </div>
                    <div className="form-group">
                        <label><strong>Add/Edit Profile Picture</strong></label>
                        <input
                            type="url"
                            name="profilePicture"
                            value={profile.profilePicture}
                            onChange={handleChange}
                            className="form-control"
                        />
                    </div>
                    {/* <div className="form-group">
                        <label><strong>My Skills</strong></label>
                        {profile.skills.map((skill, index) => (
                            <input
                                key={skill.id}
                                type="text"
                                value={skill.name}
                                onChange={(e) => handleSkillChange(index, e.target.value)}
                                className="form-control mb-2"
                            />
                        ))}
                    </div> */}
                    <button type="submit" className="btn btn-primary">Save Changes</button>
                </form>
            </div>
        </div>
    );
}

export default EditProfile;
