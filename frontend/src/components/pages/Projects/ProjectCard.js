// ProjectCard.js

import React from "react";
import { Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const ProjectCard = ({ project }) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/projects/${project.id}`);
  };

  return (
    <Card>
      <Card.Body>
        <Card.Title>{project.name}</Card.Title>
        <Card.Text>
          <strong>Description:</strong> {project.description}<br />
          <strong>Source Code Link:</strong> {project.sourceCodeLink ? <a href={project.sourceCodeLink}>View Source</a> : 'N/A'}<br />
          <strong>Skills:</strong> {project.skills.map(skill => skill.name).join(', ')}<br />
          <strong>Users:</strong> {project.users.map((user, index) => (
            <span key={user.id}>
              <a href={`/profile/${user.id}`}>{`${user.firstName} ${user.lastName}`}</a>
              {index < project.users.length - 1 && ' , '}
            </span>))}<br />
        </Card.Text>
        <Button variant="primary" onClick={handleViewDetails}>
          View Project
        </Button>
      </Card.Body>
    </Card>

  );
};

export default ProjectCard;
