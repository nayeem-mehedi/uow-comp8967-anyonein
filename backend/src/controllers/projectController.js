import {AppDataSource} from '../config/db.js';
import {Project} from '../models/Project.js';
import {checkAuthHeader} from '../helper/authHelper.js'
import {Skill} from "../models/Skill.js";
import {User} from "../models/User.js";

const projectRepository = AppDataSource.getRepository(Project);
const skillRepository = AppDataSource.getRepository(Skill);
const userRepository = AppDataSource.getRepository(User);

// 1. PROJECT list
export const listProject = async (req, res) => {
    // Check and validate Authorization token
    let userDataRedis;
    try {
        userDataRedis = await checkAuthHeader(req);
        if (!userDataRedis) {
            return res.status(401).json({message: 'ERROR_UNAUTHORIZED'});
        }
    } catch (error) {
        console.log(error);
        return res.status(401).json({message: 'ERROR_UNAUTHORIZED'});
    }

    const projects = await projectRepository.find({relations: ["topic", "skills", "users", "owner"]});
    res.json(projects);
};

// 1. PROJECT list (SELF)
export const listProjectSelf = async (req, res) => {
    // Check and validate Authorization token
    let userDataRedis;
    try {
        userDataRedis = await checkAuthHeader(req);
        if (!userDataRedis) {
            return res.status(401).json({message: 'ERROR_UNAUTHORIZED'});
        }
    } catch (error) {
        console.log(error);
        return res.status(401).json({message: 'ERROR_UNAUTHORIZED'});
    }

    const projects = await projectRepository.find({where: {}, relations: ["topic", "skills", "users", "owner"]});
    res.json(projects);
};

// 2. PROJECT details
export const detailsProject = async (req, res) => {
    // Check and validate Authorization token
    let userDataRedis;
    try {
        userDataRedis = await checkAuthHeader(req);
        if (!userDataRedis) {
            return res.status(401).json({message: 'ERROR_UNAUTHORIZED'});
        }
    } catch (error) {
        console.log(error);
        return res.status(401).json({message: 'ERROR_UNAUTHORIZED'});
    }

    const project = await projectRepository.findOne({
        where: {id: req.params.id},
        relations: ["topic", "skills", "users", "owner"],
    });
    res.json(project);
};

// 3. PROJECT create
export const createProject = async (req, res) => {
    // Check and validate Authorization token
    let userDataRedis;
    try {
        userDataRedis = await checkAuthHeader(req);
        if (!userDataRedis) {
            return res.status(401).json({message: 'ERROR_UNAUTHORIZED'});
        }
    } catch (error) {
        console.log(error);
        return res.status(401).json({message: 'ERROR_UNAUTHORIZED'});
    }

    const project = projectRepository.create(req.body);
    const result = await projectRepository.save(project);
    res.send(result);
};

// PROJECT update
export const updateProject = async (req, res) => {
    // Check and validate Authorization token
    let userDataRedis;
    try {
        userDataRedis = await checkAuthHeader(req);
        if (!userDataRedis) {
            return res.status(401).json({message: 'ERROR_UNAUTHORIZED'});
        }
    } catch (error) {
        console.log(error);
        return res.status(401).json({message: 'ERROR_UNAUTHORIZED'});
    }

    // Get the project ID from the request parameters
    const {id} = req.params;

    // Find the project by ID
    let project = await projectRepository.findOne({where: {id: id}, relations: ["skills", "users", "topic", "owner"]});

    if (!project) {
        return res.status(404).send({error: 'Project not found'});
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
                const skillEntity = await skillRepository.findOne({where: {id: skill.id}});
                updatedProject.skills.push(skillEntity);
            }
        }
    }

    if (req.body.users) {
        // Remove all existing associations
        updatedProject.users = [];

        // Add new associations
        for (const user of req.body.users) {
            const userEntity = await userRepository.findOne({where: {id: user.id}});
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

    res.send(result);
};

// 4. PROJECT delete TODO: STATUS Update
export const deleteProject = async (req, res) => {
    try {
        // Check and validate Authorization token
        let userDataRedis;
        try {
            userDataRedis = await checkAuthHeader(req);
            if (!userDataRedis) {
                return res.status(401).json({message: 'ERROR_UNAUTHORIZED'});
            }
        } catch (error) {
            console.log(error);
            return res.status(401).json({message: 'ERROR_UNAUTHORIZED'});
        }

        const id = req.params.id;

        let project;

        try {
            project = await projectRepository.findOne({where: {id: id}, relations: ["owner"]});
        } catch (error) {
            return res.status(500).json({message: 'Error finding project', error: error.message});
        }

        if (!project) {
            return res.status(404).json({message: 'Project not found'});
        }

        //Admin of Self Delete
        if ((userDataRedis.role !== 'admin') && (project.owner.username !== userDataRedis.username)) {
            return res.status(401).json({message: 'User not authorized'});
        }

        try {
            project.isActive = false;
            // await projectRepository.save(user);
            res.json({message: 'Project deleted successfully'});
        } catch (error) {
            return res.status(500).json({message: 'Error deleting user', error: error.message});
        }

    } catch (error) {
        res.status(500).json({error: error.message});
    }
};
  