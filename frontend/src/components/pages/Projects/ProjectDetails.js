// ProjectDetails.js - Ensure id is retrieved from useParams
import React, { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import ProjectCard from "./ProjectCard";

const ProjectDetails = () => {
  const { id } = useParams(); // Retrieve id from route parameters
  const [project, setProject] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

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

  const handleGoBack = () => {
    navigate(-1); // Go back to the previous page
  };

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
    <Container>
      <h1>Project Details</h1>
      <ProjectCard project={project} />
    </Container>
  );
};

export default ProjectDetails;
