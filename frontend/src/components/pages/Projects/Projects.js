import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Navbar from "../../ui/Navbar";
import ProjectCard from "./ProjectCard"; // Import the ProjectCard component

function Projects() {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

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
    <Container>
      <Row>
        <Navbar />
      </Row>
      <Row>
        {projects.map((project) => (
          <Col key={project.id} xs={12} md={4} className="mb-4">
            <ProjectCard project={project} showDetailsButton={true}/>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default Projects;
