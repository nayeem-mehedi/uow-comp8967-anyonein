import { AppDataSource } from '../config/db.js';
import { Announcement } from '../models/Announcement.js';
import { Notification } from '../models/Notification.js';
import { UserFollow } from '../models/UserFollow.js';
import { ProjectFollow } from '../models/ProjectFollow.js';
import { checkAuthHeader } from '../helper/authHelper.js'

const announcementRepository = AppDataSource.getRepository(Announcement);
const notificationRepository = AppDataSource.getRepository(Notification);
const userFollowRepository = AppDataSource.getRepository(UserFollow);
const projectFollowRepository = AppDataSource.getRepository(ProjectFollow);

export const createAnnouncementUser = async (req, res) => {
    try {
        // Check and validate Authorization token
        const token = req.header('Authorization')?.split(' ')[1];
        let userDataRedis;

        try {
            userDataRedis = await checkAuthHeader(token, res);
        } catch (error) {
            return res.status(401).json({ message: 'Invalid authorization token' });
        }

        const { title, content } = req.body;

        const user = await userRepository.findOne(userDataRedis.userId)

        const announcement = await announcementRepository.save({
            title,
            content,
            user: user,
            project: null,
        });

        const followers = await userFollowRepository.find({ where: { following: userDataRedis.userId } });

        const notifications = followers.map(follower => ({
            type: 'USER_UPDATE',
            content: `User ${user.username} has a new announcement`,
            user: follower.follower,
            relatedUser: user,
            relatedProject: null,
        }));

        await notificationRepository.save(notifications);

        res.status(201).json({ data: announcement, message: 'Announcement created and Notifications sent' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


export const createAnnouncementProject = async (req, res) => {
    try {
        // Check and validate Authorization token
        const token = req.header('Authorization')?.split(' ')[1];
        let userDataRedis;

        try {
            userDataRedis = await checkAuthHeader(token, res);
        } catch (error) {
            return res.status(401).json({ message: 'Invalid authorization token' });
        }

        const { projectId, title, content } = req.body;

        let project;

        try {
            project = await projectRepository.findOne({ where: { id: projectId }, relations: ['users'] });
        } catch (error) {
            return res.status(500).json({ message: 'Error finding project', error: error.message });
        }

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        //Admin of Self Delete
        const usernames = project.users.map(u => u.username);
        if ((userDataRedis.role !== 'admin') && !usernames.includes(userDataRedis.username)) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        const announcement = await announcementRepository.save({
            title,
            content,
            user: null,
            project: project,
        });

        const followers = await projectFollowRepository.find({ where: { project: projectId } });

        const notifications = followers.map(follower => ({
            type: 'PROJECT_UPDATE',
            content: `Project ${project.name} has a new announcement`,
            user: follower.follower,
            relatedUser: null,
            relatedProject: project,
        }));

        await notificationRepository.save(notifications);

        res.status(201).json({ data: announcement, message: 'Announcement created and Notifications sent' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};