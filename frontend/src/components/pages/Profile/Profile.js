// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import Navbar from "../../ui/Navbar";


// function Profile() {
//     const { id } = useParams();
//     const navigate = useNavigate();

//     const [profile, setProfile] = useState(null);
//     const [error, setError] = useState(null);
//     // Retrieve the token from localStorage
//     const token = localStorage.getItem('token');

//     useEffect(() => {
//         const fetchProfile = async () => {
//             try {

//                 console.log(id);

//                 const response = await fetch('http://localhost:9001/api/profiles/' + id, {
//                     method: 'GET',
//                     headers: {
//                         'Content-Type': 'application/json',
//                         'Authorization': `Basic ${token}`,
//                     },
//                 });
//                 if (!response.ok) {
//                     throw new Error('Network response was not ok');
//                 }
//                 const data = await response.json();
//                 setProfile(data);
//             } catch (error) {
//                 setError(error);
//             }
//         };

//         fetchProfile();
//     }, [id, token]);

//     const handleEdit = () => {
//         navigate(`/edit-profile/${id}`);
//     };

//     if (error) {
//         return <div>Error: {error.message}</div>;
//     }

//     if (!profile) {
//         return (
//             <div className="spinner-border" role="status">
//                 <span className="sr-only">Loading...</span>
//             </div>
//         );
//     }

//     // const handleShowSkills = () => {
//     //     navigate("/getSkills");
//     // }

//     const handleAddSkills = () => {
//         navigate("/addSkill");
//     }

//     const handleDeleteSkills = (skillId) =>{
//         navigate(`/deleteSkill/${skillId}`);
//     }

//     return (
//         <div>
//             <Navbar />
//             <div className="container mt-4">
//                 <h1 className="mb-4">Profile</h1>
//                 <div className="row">
//                     <div className="col-md-4">
//                         <img src={profile.profilePicture} alt="Profile" className="img-fluid rounded mb-3" />
//                     </div>
//                     <div className="col-md-8">
//                         <p><strong>Username:</strong> {profile.user.username}</p>
//                         <p><strong>First Name:</strong> {profile.user.firstName}</p>
//                         <p><strong>Last Name:</strong> {profile.user.lastName}</p>
//                         <p><strong>Email:</strong> {profile.user.email}</p>
//                         <p><strong>Phone:</strong> {profile.user.phone}</p>
//                         <p><strong>GitHub Profile:</strong> <a href={profile.githubProfile}>{profile.githubProfile}</a></p>
//                         <p><strong>Other Profile:</strong> <a href={profile.otherProfile}>{profile.otherProfile}</a></p>
//                         <div className="profile-skills">
//                             {/* <button type="button" class="btn btn-info"><NavLink to = "/getSkills">Show Skills</NavLink></button>  */}
//                             {/* <button type="button" class="btn btn-info" onClick={handleShowSkills}>Show Skills</button> */}
//                             <button onClick={handleEdit} className="btn btn-primary mt-3">Edit Profile</button>
//                             <button type="button" className="btn btn-info" onClick={handleAddSkills}>Add Skill</button>
//                         </div>
//                         <p><strong>Skills:</strong></p>
//                     </div>

//                     <ul className="list-group">
//                         {profile.skills.map(skill => (
//                             <div className='skill-div container' key={skill.id}>
//                                 <div className='col'>
//                                     <li className="list-group-item">{skill.name}</li>
//                                 </div>
//                                 <div className='col-2'><button type='button' className='btn-close' aria-label="Close" onClick={()=>handleDeleteSkills(skill.id)}></button></div>
                               
//                             </div>
//                         ))}
//                     </ul>
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default Profile;


import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../ui/Navbar";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

function Profile() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [profile, setProfile] = useState(null);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [announcementTitle, setAnnouncementTitle] = useState('');
    const [announcementContent, setAnnouncementContent] = useState('');
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

    const handleDeleteSkills = (skillId) => {
        if (window.confirm("Are you sure you want to delete this skill?")) {
            navigate(`/deleteSkill/${skillId}`);
        }
    };

    const handleShow = () => setShowModal(true);
    const handleClose = () => setShowModal(false);

    const handleAnnouncementSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:9001/api/announcements/user`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Basic ${token}`,
                },
                body: JSON.stringify({
                    title: announcementTitle,
                    content: announcementContent,
                }),
            });
            if (!response.ok) {
                throw new Error('Failed to create announcement');
            }
            setAnnouncementTitle('');
            setAnnouncementContent('');
            handleClose();
        } catch (error) {
            setError(error);
        }
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
                        <p><strong>GitHub Profile:</strong> <a href={profile.githubProfile}>{profile.githubProfile}</a></p>
                        <p><strong>Other Profile:</strong> <a href={profile.otherProfile}>{profile.otherProfile}</a></p>
                        <div className="profile-actions">
                            <button onClick={handleEdit} className="btn btn-primary mt-3">Edit Profile</button>
                            <button onClick={handleShow} className="btn btn-secondary mt-3 ms-2">Create Announcement</button>
                            <button type="button" className="btn btn-info mt-3" onClick={handleAddSkills}>Add Skill</button>
                        </div>
                        <p><strong>Skills:</strong></p>
                    </div>
                    <ul className="list-group">
                        {profile.skills.map(skill => (
                            <div className="skill-div container" key={skill.id}>
                                <div className="col">
                                    <li className="list-group-item">{skill.name}</li>
                                </div>
                                <div className="col-2">
                                    <button type="button" className="btn-close" aria-label="Close" onClick={() => handleDeleteSkills(skill.id)}></button>
                                </div>
                            </div>
                        ))}
                    </ul>
                </div>
            </div>

            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Create Announcement</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleAnnouncementSubmit}>
                        <Form.Group controlId="announcementTitle">
                            <Form.Label>Title</Form.Label>
                            <Form.Control 
                                type="text" 
                                placeholder="Enter title" 
                                value={announcementTitle}
                                onChange={(e) => setAnnouncementTitle(e.target.value)} 
                            />
                        </Form.Group>
                        <Form.Group controlId="announcementContent" className="mt-3">
                            <Form.Label>Message</Form.Label>
                            <Form.Control 
                                as="textarea" 
                                rows={3} 
                                placeholder="Enter message" 
                                value={announcementContent}
                                onChange={(e) => setAnnouncementContent(e.target.value)} 
                            />
                        </Form.Group>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleClose}>
                                Close
                            </Button>
                            <Button variant="primary" type="submit">
                                Save Announcement
                            </Button>
                        </Modal.Footer>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default Profile;
