// ProjectDetails.js - Ensure id is retrieved from useParams
import React, { useState, useEffect } from "react";
import { Container, Button, Row } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import ProjectCard from "./ProjectCard";
import Navbar from "../../ui/Navbar";

const ProjectDetails = () => {
  const { id } = useParams(); // Retrieve id from route parameters
  const [project, setProject] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleGoBack = () => {
    navigate(-1); // Go back to the previous page
  };

  const handleEditProject = () => {
    navigate(`/projects/edit/${id}`); // Navigate to the edit project page
  };

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const response = await fetch(`http://localhost:9001/api/projects/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        setProject(data);
      } catch (error) {
        setError(error);
      }
    };

    fetchProjectDetails();
  }, [id, token]);

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!project) {
    return (
      <div className="spinner-border" role="status">
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <Container>
        <Row>
          <h1>Project Details</h1>
          <ProjectCard project={project} showDetailsButton={false} />
          <div className="p-3">
            <Button variant="secondary" onClick={handleGoBack}>Go back</Button>
            <Button variant="primary" onClick={handleEditProject} className="ms-2">Edit Project</Button>
          </div>
        </Row>
      </Container>
    </>
  );
};

export default ProjectDetails;
