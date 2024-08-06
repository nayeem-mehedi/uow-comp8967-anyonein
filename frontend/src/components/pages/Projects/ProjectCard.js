// ProjectCard.js

import React from "react";
import { Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const ProjectCard = ({ project, showDetailsButton }) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/projects/${project.id}`);
  };

  return (
    <Card>
      <Card.Body>
        <Card.Title>{project.name}</Card.Title>
        <Card.Text>
          <strong>Description: </strong>{!showDetailsButton ? project.description : (project.description.length > 200 ? `${project.description.substring(0, 200)}...` : project.description)}<br />
          <strong>Source Code Link:</strong> {project.sourceCodeLink ? <a href={project.sourceCodeLink}>View Source</a> : 'N/A'}<br />
          <strong>Skills:</strong> {project.skills.map(skill => skill.name).join(', ')}<br />
          <strong>Users:</strong> {project.users.map((user, index) => (
            <span key={user.id}>
              <a href={`/profile/${user.id}`}>{`${user.firstName} ${user.lastName}`}</a>
              {index < project.users.length - 1 && ' , '}
            </span>))}<br />
        </Card.Text>
        <div className="d-flex justify-content-start">
          <div className="p-3">
            {showDetailsButton ? (
              <Button variant="primary" className="main-btn-alt" onClick={handleViewDetails}>
              View Project
            </Button>
            ) : <></>}
            
          </div>

        </div>
      </Card.Body>
    </Card>

  );
};

export default ProjectCard;
