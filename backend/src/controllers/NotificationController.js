import { AppDataSource } from '../config/db.js';
// import { Announcement } from '../models/Announcement.js';
import { Notification } from '../models/Notification.js';
// import { UserFollow } from '../models/UserFollow.js';
// import { ProjectFollow } from '../models/ProjectFollow.js';
import { checkAuthHeader } from '../helper/authHelper.js'

// const announcementRepository = AppDataSource.getRepository(Announcement);
const notificationRepository = AppDataSource.getRepository(Notification);
// const userFollowRepository = AppDataSource.getRepository(UserFollow);
// const projectFollowRepository = AppDataSource.getRepository(ProjectFollow);


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

        const notifications = await notificationRepository.find(
            {
                where:
                {
                    user:
                        { id: userDataRedis.userId }
                },
                order: { createdAt: 'DESC' }
            }
        );

        return res.status(200).json({ notifications });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// FIXME: get notification should have announcement link
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
        const notification = await notificationRepository.findOne(
            {
                where:
                {
                    id: notificationId,
                    user: { id: userDataRedis.userId }
                },
                relations: ['announcement']
            });

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
