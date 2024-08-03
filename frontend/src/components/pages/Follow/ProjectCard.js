import React from "react";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import {FollowButton, FOLLOW_TYPES} from "./FollowButton";
import {followProject} from "../../../helper/apiURL";

function ProjectCard({ project, initialFollowing }) {

    return (
        <Card className="mb-1 p-1">
            <Card.Body className="p-1 d-flex justify-content-between align-items-center">
                <div>
                    <Card.Title>{project.name}</Card.Title>
                    <Link to={`/projects/${project.id}`}>
                        <Card.Subtitle className="mb-2 text-muted">View Project</Card.Subtitle>
                    </Link>
                </div>
                <FollowButton type={FOLLOW_TYPES.PROJECT} followUrl={followProject} id={project.id} initialFollowing={initialFollowing} />
            </Card.Body>
        </Card>
    );
}

export default ProjectCard;
