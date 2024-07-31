import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Navbar from "../../ui/Navbar";
import ProjectCard from "./ProjectCard"; // Import the ProjectCard component

function Projects() {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("http://localhost:9001/api/projects", {
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
        setProjects(data);
      } catch (error) {
        setError(error);
      }
    };

    fetchProjects();
  }, [token]);

  const handleCreateProject = () => {
    navigate("/create-project"); // Redirecting to the CreateProject.js page
  };

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!projects.length) {
    return (
      <div className="spinner-border" role="status">
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <Container>
        <div className="createButtonSection">
          {token && (
            <Button onClick={handleCreateProject} className="projectCreateButton">Create Project</Button>
          )}
        </div>
        <Row>
          {projects.map((project) => (
            <Col key={project.id} xs={12} md={4} className="mb-4">
              <ProjectCard project={project} showDetailsButton={true}/>
            </Col>
          ))}
        </Row>
      </Container>
    </div>

  );
}

export default Projects;
