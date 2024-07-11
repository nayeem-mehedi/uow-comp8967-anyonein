import { AppDataSource } from '../config/db.js';
import { Project } from '../models/Project.js';
import {checkAuthHeader} from '../helper/authHelper.js'

const projectRepository = AppDataSource.getRepository(Project);

    // 1. PROJECT list
    export const listProject = async (req, res) => {
        const projects = await projectRepository.find({ relations: ["topic", "skills", "users"] });
        res.json(projects);
    };

    // 2. PROJECT details
    export const detailsProject = async (req, res) => {
        const project = await projectRepository.findOne(req.params.id, { relations: ["topic", "skills", "users"] });
        res.json(project);
    };

    // 3. PROJECT create
    export const createProject = async (req, res) => {
        const project = projectRepository.create(req.body);
        const result = await projectRepository.save(project);
        res.send(result);
    };

    // TODO: PROJECT Update 

    // 4. PROJECT delete
    // TODO: soft delete
    export const deleteProject = async (req, res) => {
        const result = await projectRepository.delete(req.params.id);
        res.send(result);
    };