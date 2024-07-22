import { AppDataSource } from '../config/db.js';
import { User } from '../models/User.js';
import { UserFollow } from '../models/UserFollow.js';
import { Project } from '../models/Project.js';
import { ProjectFollow } from '../models/ProjectFollow.js';
import { checkAuthHeader } from '../helper/authHelper.js'

const userRepository = AppDataSource.getRepository(User);
const userFollowRepository = AppDataSource.getRepository(UserFollow);
const projectFollowRepository = AppDataSource.getRepository(ProjectFollow);
const projectRepository = AppDataSource.getRepository(Project);

export const followUser = async (req, res) => {
    try {
        // Check and validate Authorization token
        const token = req.header('Authorization')?.split(' ')[1];
        let userDataRedis;

        try {
            userDataRedis = await checkAuthHeader(token, res);
        } catch (error) {
            return res.status(401).json({ message: 'Invalid authorization token' });
        }

        const followUserId = req.params.id;
        // console.log(followUserId)
        const userToFollow = await userRepository.findOneBy({ id: followUserId });
        // console.log(userToFollow)
        if (!userToFollow) {
            return res.status(404).json({ message: 'User not found' });
        }

        console.log(userToFollow)

        const existingFollow = await userFollowRepository.findOne(
            {
                where:
                {
                    follower: { id: userDataRedis.userId },
                    following: { id: followUserId }
                },
                relations: ['follower', 'following']
            });

        console.log(existingFollow)
        if (existingFollow) {
            await userFollowRepository.remove(existingFollow);
            return res.status(200).json({ message: 'Unfollowed the user' });
        } else {
            const userFollow = userFollowRepository.create({ follower: { id: userDataRedis.userId }, following: userToFollow });
            await userFollowRepository.save(userFollow);
            return res.status(200).json({ message: 'Started following the user' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}


export const followProject = async (req, res) => {
    try {
        // Check and validate Authorization token
        const token = req.header('Authorization')?.split(' ')[1];
        let userDataRedis;

        try {
            userDataRedis = await checkAuthHeader(token, res);
        } catch (error) {
            return res.status(401).json({ message: 'Invalid authorization token' });
        }

        const followProjectId = req.params.id;
        const projectToFollow = await projectRepository.findOneBy({ id: followProjectId });

        if (!projectToFollow) {
            return res.status(404).json({ message: 'Project not found' });
        }

        const existingFollow = await projectFollowRepository.findOne(
            {
                where:
                {
                    user: { id: userDataRedis.userId },
                    project: { id: followProjectId }
                },
                relation: ['user', 'project']
            });

        if (existingFollow) {
            await projectFollowRepository.remove(existingFollow);
            return res.status(200).json({ message: 'Unfollowed the project' });
        } else {
            const projectFollow = projectFollowRepository.create({ user: { id: userDataRedis.userId }, project: projectToFollow });
            await projectFollowRepository.save(projectFollow);
            return res.status(200).json({ message: 'Started following the project' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//FIXME: check how deep the JSON goes
export const followList = async (req, res) => {
    try {
        // Check and validate Authorization token
        const token = req.header('Authorization')?.split(' ')[1];
        let userDataRedis;

        try {
            userDataRedis = await checkAuthHeader(token, res);
        } catch (error) {
            return res.status(401).json({ message: 'Invalid authorization token' });
        }

        const followedUsers = await userFollowRepository.find({ where: { follower: { id: userDataRedis.userId } }, relations: ['following'] });
        const followedProjects = await projectFollowRepository.find({ where: { user: { id: userDataRedis.userId } }, relations: ['project'] });

        return res.status(200).json({
            users: followedUsers.map(follow => follow.following),
            projects: followedProjects.map(follow => follow.project),
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


