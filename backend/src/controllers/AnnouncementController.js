import {checkAuthHeader} from '../helper/authHelper.js'
import {AppDataSource} from '../config/db.js';
import {Announcement} from '../models/Announcement.js';
import {Notification} from '../models/Notification.js';
import {UserFollow} from '../models/UserFollow.js';
import {ProjectFollow} from '../models/ProjectFollow.js';
import {User} from "../models/User.js";
import {Project} from "../models/Project.js";

const announcementRepository = AppDataSource.getRepository(Announcement);
const notificationRepository = AppDataSource.getRepository(Notification);
const userFollowRepository = AppDataSource.getRepository(UserFollow);
const projectFollowRepository = AppDataSource.getRepository(ProjectFollow);
const userRepository = AppDataSource.getRepository(User);
const projectRepository = AppDataSource.getRepository(Project);

// List Announcements by User
export const listAnnouncementsByUser = async (req, res) => {
    try {
        // Check and validate Authorization token
        let userDataRedis;
        try {
            userDataRedis = await checkAuthHeader(req);
            if(!userDataRedis) {
                return res.status(401).json({ message: 'ERROR_UNAUTHORIZED' });
            }
        } catch (error) {
            console.log(error);
            return res.status(401).json({message: 'ERROR_UNAUTHORIZED'});
        }

        const {id} = req.params;

        const realID = id === 'self' ? userDataRedis.userId: id;

        const user = await userRepository.findOneBy({id: realID} );
        if (!user) {
            return res.status(404).json({message: 'User not found'});
        }

        const announcements = await announcementRepository
            .createQueryBuilder('announcement')
            .leftJoinAndSelect('announcement.user', 'user')
            .select([
                'announcement',
                'user.id',
                'user.username'
            ])
            .where('announcement.userId = :id', {id: realID})
            .orderBy('announcement.createdAt', 'DESC')
            .getMany();

        res.status(200).json({data: announcements});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

// List Announcements by Project
export const listAnnouncementsByProject = async (req, res) => {
    try {
        // Check and validate Authorization token
        let userDataRedis;
        try {
            userDataRedis = await checkAuthHeader(req);
            if(!userDataRedis) {
                return res.status(401).json({ message: 'ERROR_UNAUTHORIZED' });
            }
        } catch (error) {
            console.log(error);
            return res.status(401).json({message: 'ERROR_UNAUTHORIZED'});
        }

        const {id} = req.params;

        const project = await projectRepository.findOneBy({id});
        if (!project) {
            return res.status(404).json({message: 'Project not found'});
        }

        const announcements = await announcementRepository
            .createQueryBuilder('announcement')
            .leftJoinAndSelect('announcement.project', 'project')
            .select([
                'announcement',
                'project.id',
                'project.name'
            ])
            .where('announcement.projectId = :id', {id})
            .orderBy('announcement.createdAt', 'DESC')
            .getMany();

        res.status(200).json({data: announcements});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

export const createAnnouncementUser = async (req, res) => {
    try {
        // Check and validate Authorization token
        let userDataRedis;
        try {
            userDataRedis = await checkAuthHeader(req);
            if(!userDataRedis) {
                return res.status(401).json({ message: 'ERROR_UNAUTHORIZED' });
            }
        } catch (error) {
            console.log(error);
            return res.status(401).json({message: 'ERROR_UNAUTHORIZED'});
        }

        const {title, content} = req.body;

        const user = await userRepository.findOneBy({id: userDataRedis.userId})

        const announcement = await announcementRepository.save({
            title,
            content,
            user: user,
            project: null,
        });

        const userFollowers = await userFollowRepository.find({
            where: {following: {id: userDataRedis.userId}},
            relations: ['follower', 'following']
        });

        const notifications = userFollowers.map(userFollow => ({
            type: 'USER_UPDATE',
            content: `User ${user.username} has a new announcement`,
            user: userFollow.follower,
            relatedUser: user,
            relatedProject: null,
            announcement: announcement,
        }));

        await notificationRepository.save(notifications);

        res.status(201).json({data: announcement, message: 'Announcement created and Notifications sent'});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};


export const createAnnouncementProject = async (req, res) => {
    try {
        // Check and validate Authorization token
        let userDataRedis;
        try {
            userDataRedis = await checkAuthHeader(req);
            if(!userDataRedis) {
                return res.status(401).json({ message: 'ERROR_UNAUTHORIZED' });
            }
        } catch (error) {
            console.log(error);
            return res.status(401).json({message: 'ERROR_UNAUTHORIZED'});
        }

        const {projectId, title, content} = req.body;

        let project;

        try {
            project = await projectRepository.findOne({where: {id: projectId}, relations: ['owner', 'users']});
        } catch (error) {
            return res.status(500).json({message: 'Error finding project', error: error.message});
        }

        if (!project) {
            return res.status(404).json({message: 'Project not found'});
        }

        const usernames = project.users.map(u => u.username);

        if ((userDataRedis.role !== 'admin') && project.owner.id !== userDataRedis.userId && !usernames.includes(userDataRedis.username)) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        const announcement = await announcementRepository.save({
            title,
            content,
            user: null,
            project: project,
        });

        const projectFollowers = await projectFollowRepository.find({
            where: {pointedProject: project.id},
            relations: ["follower", "pointedProject"]
        });
        const notifications = projectFollowers.map(projectFollow => ({
            type: 'PROJECT_UPDATE',
            content: `Project ${project.name} has a new announcement`,
            user: projectFollow.follower,
            relatedUser: null,
            relatedProject: project,
            announcement: announcement,
        }));

        await notificationRepository.save(notifications);

        res.status(201).json({data: announcement, message: 'Announcement created and Notifications sent'});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};