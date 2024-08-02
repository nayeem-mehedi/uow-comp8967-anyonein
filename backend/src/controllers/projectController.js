import {AppDataSource} from '../config/db.js';
import {Project} from '../models/Project.js';
import {checkAuthHeader} from '../helper/authHelper.js'

const projectRepository = AppDataSource.getRepository(Project);

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

    const projects = await projectRepository.find({relations: ["topic", "skills", "users"]});
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
        relations: ["topic", "skills", "users"]
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

// TODO: PROJECT Update 
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
    let project = await projectRepository.findOne({where: {id: id}});

    if (!project) {
        return res.status(404).send({error: 'Project not found'});
    }

    // Update fields individually if they exist in the request body
    if (req.body.name) {
        project.name = req.body.name;
    }

    if (req.body.description) {
        project.description = req.body.description;
    }

    if (req.body.sourceCodeLink) {
        project.sourceCodeLink = req.body.sourceCodeLink;
    }

    if (req.body.topic) {
        project.topic = req.body.topic;
    }

    // Handle skills additions and deletions
    if (req.body.skills) {
        const {addSkills = [], removeSkills = []} = req.body.skills;

        if (addSkills.length > 0) {
            for (const skill of addSkills) {
                const skillEntity = await skillRepository.findOne(skill.id);
                if (skillEntity && !project.skills.some(s => s.id === skillEntity.id)) {
                    project.skills.push(skillEntity);
                }
            }
        }

        if (removeSkills.length > 0) {
            project.skills = project.skills.filter(skill => !removeSkills.includes(skill.id));
        }
    }

    // Handle users additions and deletions
    // users : [{id: 1, type: "OWNER"}, {id: 2, type: "CONTRIBUTOR"}]
    // if (req.body.users) {
    //     const { addUsers = [], removeUsers = [] } = req.body.users;

    //     if (addUsers.length > 0) {
    //         for (const user of addUsers) {
    //             const userEntity = await userRepository.findOne(user.id);
    //             if (userEntity && !project.users.some(u => u.id === userEntity.id)) {
    //                 project.users.push(userEntity);
    //             }
    //         }
    //     }

    //     if (removeUsers.length > 0) {
    //         project.users = project.users.filter(user => !removeUsers.includes(user.id));
    //     }
    // }
    if (req.body.users) {
        // Remove all existing associations
        project.users = [];

        // Add new associations
        for (const user of req.body.users) {
            const userEntity = await userRepository.findOne(user.id);
            if (userEntity) {
                project.users.push({
                    user: userEntity,
                    type: user.type,
                });
            }
        }
    }

    // Merge the request body into the existing project entity
    // projectRepository.merge(project, req.body);

    // Save the updated project
    const result = await projectRepository.save(project);

    res.send(result);
};

// 4. PROJECT delete
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
            project = await projectRepository.findOne({where: {id: id}, relations: ['users']});
        } catch (error) {
            return res.status(500).json({message: 'Error finding project', error: error.message});
        }

        if (!project) {
            return res.status(404).json({message: 'Project not found'});
        }

        //Admin of Self Delete
        const usernames = project.users.map(u => u.username);
        if ((userDataRedis.role !== 'admin') && !usernames.includes(userDataRedis.username)) {
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
  