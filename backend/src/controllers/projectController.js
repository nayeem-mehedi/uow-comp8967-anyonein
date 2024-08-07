import { AppDataSource } from '../config/db.js';
import { Project } from '../models/Project.js';
import { checkAuthHeader } from '../helper/authHelper.js'
import { Skill } from "../models/Skill.js";
import { User } from "../models/User.js";
import { JoinRequest } from "../models/JoinRequest.js";
import { Notification } from "../models/Notification.js";

const projectRepository = AppDataSource.getRepository(Project);
const skillRepository = AppDataSource.getRepository(Skill);
const userRepository = AppDataSource.getRepository(User);
const joinRequestRepository = AppDataSource.getRepository(JoinRequest);
const notificationRepository = AppDataSource.getRepository(Notification);

// 1. PROJECT list
export const listProject = async (req, res) => {
    // Check and validate Authorization token
    let userDataRedis;
    try {
        userDataRedis = await checkAuthHeader(req);
        if (!userDataRedis) {
            return res.status(401).json({ message: 'ERROR_UNAUTHORIZED' });
        }
    } catch (error) {
        console.log(error);
        return res.status(401).json({ message: 'ERROR_UNAUTHORIZED' });
    }

    const projects = await projectRepository.find({ relations: ["topic", "skills", "users", "owner"] });
    return çres.json(projects);
};

// 1. PROJECT list (SELF)
export const listProjectSelf = async (req, res) => {
    // Check and validate Authorization token
    let userDataRedis;
    try {
        userDataRedis = await checkAuthHeader(req);
        if (!userDataRedis) {
            return res.status(401).json({ message: 'ERROR_UNAUTHORIZED' });
        }
    } catch (error) {
        console.log(error);
        return res.status(401).json({ message: 'ERROR_UNAUTHORIZED' });
    }

    const projects = await projectRepository.find({ where: { owner: { id: userDataRedis.userId } }, relations: ["topic", "skills", "users", "owner"] });
    return res.json(projects);
};

// 2. PROJECT details
export const detailsProject = async (req, res) => {
    // Check and validate Authorization token
    let userDataRedis;
    try {
        userDataRedis = await checkAuthHeader(req);
        if (!userDataRedis) {
            return res.status(401).json({ message: 'ERROR_UNAUTHORIZED' });
        }
    } catch (error) {
        console.log(error);
        return res.status(401).json({ message: 'ERROR_UNAUTHORIZED' });
    }

    const project = await projectRepository.findOne({
        where: { id: req.params.id },
        relations: ["topic", "skills", "users", "owner"],
    });
    return res.json(project);
};

// 3. PROJECT create
export const createProject = async (req, res) => {
    // Check and validate Authorization token
    let userDataRedis;
    try {
        userDataRedis = await checkAuthHeader(req);
        if (!userDataRedis) {
            return res.status(401).json({ message: 'ERROR_UNAUTHORIZED' });
        }
    } catch (error) {
        console.log(error);
        return res.status(401).json({ message: 'ERROR_UNAUTHORIZED' });
    }

    const projectData = {
        ...req.body,
        owner: userDataRedis.userId,
    }

    const project = projectRepository.create(projectData);
    const result = await projectRepository.save(project);
    return res.send(result);
};

// PROJECT update
export const updateProject = async (req, res) => {
    // Check and validate Authorization token
    let userDataRedis;
    try {
        userDataRedis = await checkAuthHeader(req);
        if (!userDataRedis) {
            return res.status(401).json({ message: 'ERROR_UNAUTHORIZED' });
        }
    } catch (error) {
        console.log(error);
        return res.status(401).json({ message: 'ERROR_UNAUTHORIZED' });
    }

    // Get the project ID from the request parameters
    const { id } = req.params;

    // Find the project by ID
    let project = await projectRepository.findOne({ where: { id: id }, relations: ["skills", "users", "topic", "owner"] });

    if (!project) {
        return res.status(404).send({ error: 'Project not found' });
    }

    let updatedProject = {};

    // Update fields individually if they exist in the request body
    if (req.body.name) {
        updatedProject.name = req.body.name;
    }

    if (req.body.description) {
        updatedProject.description = req.body.description;
    }

    if (req.body.sourceCodeLink) {
        updatedProject.sourceCodeLink = req.body.sourceCodeLink;
    }

    if (req.body.topic) {
        updatedProject.topic = req.body.topic;
    }

    // Handle skills additions and deletions
    if (req.body.skills) {
        const skillsToCheck = req.body.skills;

        console.log(skillsToCheck);

        if (skillsToCheck.length > 0) {
            updatedProject.skills = []
            for (const skill of skillsToCheck) {
                const skillEntity = await skillRepository.findOne({ where: { id: skill.id } });
                updatedProject.skills.push(skillEntity);
            }
        }
    }

    if (req.body.users) {
        // Remove all existing associations
        updatedProject.users = [];

        // Add new associations
        for (const user of req.body.users) {
            const userEntity = await userRepository.findOne({ where: { id: user.id } });
            if (userEntity) {
                updatedProject.users.push(userEntity);
            }
        }
    }

    // Merge the request body into the existing project entity
    projectRepository.merge(project, updatedProject);
    project.users = updatedProject.users;
    project.skills = updatedProject.skills;

    // Save the updated project
    const result = await projectRepository.save(project);

    return res.send(result);
};

// 4. PROJECT delete TODO: STATUS Update
export const deleteProject = async (req, res) => {
    try {
        // Check and validate Authorization token
        let userDataRedis;
        try {
            userDataRedis = await checkAuthHeader(req);
            if (!userDataRedis) {
                return res.status(401).json({ message: 'ERROR_UNAUTHORIZED' });
            }
        } catch (error) {
            console.log(error);
            return res.status(401).json({ message: 'ERROR_UNAUTHORIZED' });
        }

        const id = req.params.id;

        let project;

        try {
            project = await projectRepository.findOne({ where: { id: id }, relations: ["owner"] });
        } catch (error) {
            return res.status(500).json({ message: 'Error finding project', error: error.message });
        }

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        //Admin of Self Delete
        if ((userDataRedis.role !== 'admin') && (project.owner.username !== userDataRedis.username)) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        try {
            project.isActive = false;
            await projectRepository.save(user);
            return res.json({ message: 'Project deleted successfully' });
        } catch (error) {
            return res.status(500).json({ message: 'Error deleting user', error: error.message });
        }

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const joinRequest = async (req, res) => {
    try {
        // Check and validate Authorization token
        let userDataRedis;
        try {
            userDataRedis = await checkAuthHeader(req);
            if (!userDataRedis) {
                return res.status(401).json({ message: 'ERROR_UNAUTHORIZED' });
            }
        } catch (error) {
            console.log(error);
            return res.status(401).json({ message: 'ERROR_UNAUTHORIZED' });
        }

        const id = req.params.id;

        let project;

        try {
            project = await projectRepository.findOne({ where: { id: id }, relations: ["owner"] });
        } catch (error) {
            return res.status(500).json({ message: 'Error finding project', error: error.message });
        }

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        const { message } = req.body;
        const userEntity = await userRepository.findOne({ where: { id: userDataRedis.userId } });

        try {
            const joinRequest = joinRequestRepository.create({
                    project: project,
                    message: message,
                    user: userEntity
                });

            await joinRequestRepository.save(joinRequest);

            res.json({ message: 'Project join request sent successfully' });
        } catch (error) {
            return res.status(500).json({ message: 'Error sending Project join request ', error: error.message });
        }

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const joinRequestList = async (req, res) => {
    try {
        // Check and validate Authorization token
        let userDataRedis;
        try {
            userDataRedis = await checkAuthHeader(req);
            if (!userDataRedis) {
                return res.status(401).json({ message: 'ERROR_UNAUTHORIZED' });
            }
        } catch (error) {
            console.log(error);
            return res.status(401).json({ message: 'ERROR_UNAUTHORIZED' });
        }

        const id = req.params.id;

        let project;

        try {
            project = await projectRepository.findOne({ where: { id: id }, relations: ["owner"] });
        } catch (error) {
            return res.status(500).json({ message: 'Error finding project', error: error.message });
        }

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        //Admin of Self Delete
        if ((userDataRedis.role !== 'admin') && (project.owner.username !== userDataRedis.username)) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        const joinRequests = await joinRequestRepository.find({ where: { project: {id: id} }, relations: ['user', 'project'] });
        // const project = await projectRepository.findOne(projectId, { relations: ['joinRequests'] });

        res.status(200).json(joinRequests);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const acceptRejectRequest = async (req, res) => {
    try {
        // Check and validate Authorization token
        let userDataRedis;
        try {
            userDataRedis = await checkAuthHeader(req);
            if (!userDataRedis) {
                return res.status(401).json({ message: 'ERROR_UNAUTHORIZED' });
            }
        } catch (error) {
            console.log(error);
            return res.status(401).json({ message: 'ERROR_UNAUTHORIZED' });
        }

        const id = req.params.id;

        const { status } = req.body;

        let joinRequests;

        try {
            joinRequests = await joinRequestRepository.findOne({ where: { id: id }, relations: ['user', 'project'] });
        } catch (error) {
            return res.status(500).json({ message: 'Error finding joinRequest', error: error.message });
        }

        const project = await projectRepository.findOne({ where: { id: joinRequests.project.id }, relations: ["owner", "users"] });

        //Admin of Self
        if ((userDataRedis.role !== 'admin') && (project.owner.username !== userDataRedis.username)) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        if (joinRequests.status === 'pending') {
            try {
                if (status === 'accepted' || status === 'rejected') {
                    joinRequests.status = status;

                    //save join request
                    await joinRequestRepository.save(joinRequests);

                    //fire notification
                    const notification = notificationRepository.create({
                        type: 'PROJECT_UPDATE',
                        content: `Project ${project.name} has ${status} your join request`,
                        user: joinRequests.user,
                        relatedUser: null,
                        relatedProject: project,
                        announcement: null,
                    })
                    await notificationRepository.save(notification);
                }

                //add user to project
                if (status === 'accepted') {
                    const userEntity = await userRepository.findOneBy({ id: joinRequests.user.id });
                    // const theProject = projectRepository.findOne({ where: { id: project.id }, relations: ["users"] });
                    project.users = [
                        ...project.users,
                        userEntity
                    ];
                    await projectRepository.save(project);
                }

                return res.status(200).json({ message: 'Successfully changed project join request status' });
            } catch (error) {
                return res.status(500).json({
                    message: 'Error changing project join request status',
                    error: error.message
                });
            }

        } else {
            return res.status(400).json({ message: 'Wrong status change request' });
        }
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};



