import { AppDataSource } from '../config/db.js';
import { Notification } from '../models/Notification.js';
import { checkAuthHeader } from '../helper/authHelper.js'

const notificationRepository = AppDataSource.getRepository(Notification);

export const countNotifications = async (req, res) => {
    try {
        // Check and validate Authorization token
        const token = req.header('Authorization')?.split(' ')[1];
        let userDataRedis;

        try {
            userDataRedis = await checkAuthHeader(token, res);
        } catch (error) {
            return res.status(401).json({ message: 'Invalid authorization token' });
        }

        const unreadNotificationCount = await notificationRepository
            .createQueryBuilder('notification')
            .select('COUNT(notification.id)', 'count')
            .where('notification.userId = :userId', { userId: userDataRedis.userId })
            .andWhere('notification.isRead = :isRead', { isRead: false })
            .getRawOne();

        console.error(unreadNotificationCount);
        return res.status(200).json(unreadNotificationCount);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
};

export const listNotifications = async (req, res) => {
    try {
        // Check and validate Authorization token
        const token = req.header('Authorization')?.split(' ')[1];
        let userDataRedis;

        try {
            userDataRedis = await checkAuthHeader(token, res);
        } catch (error) {
            return res.status(401).json({ message: 'Invalid authorization token' });
        }

        const notifications = await notificationRepository
            .createQueryBuilder('notification')
            .leftJoinAndSelect('notification.relatedProject', 'relatedProject')
            .leftJoinAndSelect('notification.relatedUser', 'relatedUser')
            .leftJoinAndSelect('notification.announcement', 'announcement')
            .select([
                'notification',
                'relatedProject.id',
                'relatedProject.name',
                'relatedUser.id',
                'relatedUser.username',
                'announcement.id',
                'announcement.title',
                'announcement.content' 
            ])
            .where('notification.userId = :userId', { userId: userDataRedis.userId })
            .orderBy('notification.createdAt', 'DESC')
            .getMany();

        return res.status(200).json({ notifications });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getNotification = async (req, res) => {
    try {
        // Check and validate Authorization token
        const token = req.header('Authorization')?.split(' ')[1];
        let userDataRedis;

        try {
            userDataRedis = await checkAuthHeader(token, res);
        } catch (error) {
            return res.status(401).json({ message: 'Invalid authorization token' });
        }

        const notificationId = req.params.id;

        const notification = await notificationRepository
            .createQueryBuilder('notification')
            .leftJoinAndSelect('notification.relatedProject', 'relatedProject')
            .leftJoinAndSelect('notification.relatedUser', 'relatedUser')
            .leftJoinAndSelect('notification.announcement', 'announcement')
            .select([
                'notification',
                'announcement',
                'relatedProject.id',
                'relatedProject.name',
                'relatedUser.id',
                'relatedUser.username'
            ])
            .where('notification.id = :notificationId', { notificationId: notificationId })
            .where('notification.userId = :userId', { userId: userDataRedis.userId })
            .getOne();

        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }

        notification.isRead = true;
        await notificationRepository.save(notification);


        return res.status(200).json({ notification });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
