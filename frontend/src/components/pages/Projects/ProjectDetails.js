import React, { useState, useEffect } from "react";
import { Container, Button, Row } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import ProjectCard from "./ProjectCard";
import Navbar from "../../ui/Navbar";
import ProjectAnnouncement from "./ProjectAnnouncement";
import JoinRequestList from "../JoinRequest/JoinRequestList"
import JoinRequestButton from "../JoinRequest/JoinRequestButton";

const ProjectDetails = ({showJoin =true}) => {
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
        const response = await fetch(
          `http://localhost:9001/api/projects/${id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Basic ${token}`,
            },
          }
        );

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
      <div className="project-details-container">
        <h1 className="project-title">{project.name}</h1>
        <div className="project-description"> {project.description} </div>
        <div className="project-info">
          <div className="project-section">
            <strong>Source Code Link:</strong>{" "}
            {project.sourceCodeLink ? (
              <a
                href={project.sourceCodeLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                View Source
              </a>
            ) : (
              "N/A"
            )}
          </div>
          <div className="project-section">
            <strong>Skills Needed:</strong>{" "}
            {project.skills.map((skill) => skill.name).join(", ")}
          </div>
          <div className="project-section">
            <strong>Owner:</strong>{" "}
            {project.owner && <a href={`/profile/${project.owner.id}`}>{`${project.owner.firstName} ${project.owner.lastName}`}</a>}
          </div>

          <div className="project-section">
            <strong>Users:</strong>{" "}
            {project.users.map((user, index) => (
              <span key={user.id}>
                <a
                  href={`/profile/${user.id}`}
                >{`${user.firstName} ${user.lastName}`}</a>
                {index < project.users.length - 1 && ", "}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="project-buttons">
        <Button variant="secondary" onClick={handleGoBack}>
          Go Back
        </Button>
        <Button variant="primary" onClick={handleEditProject} className="ms-2">
          Edit Project
        </Button>
        {showJoin && <JoinRequestButton projectId={project.id}/>}
      </div>
      <Row>
        <ProjectAnnouncement projectId={project.id} />
      </Row>
      <Row>
        <JoinRequestList projectId={project.id} />
      </Row>
    </>
  );
};

export default ProjectDetails;
