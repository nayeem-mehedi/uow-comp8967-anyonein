import { AppDataSource } from '../config/db.js';
import { checkAuthHeader } from '../helper/authHelper.js'
import { User } from '../models/User.js';
import { Profile } from '../models/Profile.js';
import {Message} from "../models/Message.js";

const messageRepository = AppDataSource.getRepository(Message);

export const sendMessage = async (req, res) => {
    const { receiver, content } = req.body;
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

        const msg = messageRepository.create({
            sender: { id: userDataRedis.userId },
            receiver: { id: receiver },
            content,
        })

        const savedMsg = await messageRepository.save(msg);
        res.status(201).json(savedMsg);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getMessages = async (req, res) => {
    const { receiver } = req.params;
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

        const msgList = await messageRepository.createQueryBuilder('message')
            .leftJoinAndSelect('message.sender', 'sender')
            .leftJoinAndSelect('message.receiver', 'receiver')
            .leftJoinAndSelect('sender.profile', 'senderProfile')
            .leftJoinAndSelect('receiver.profile', 'receiverProfile')
            .where('(message.senderId = :userId1 AND message.receiverId = :userId2)', { userId1: userDataRedis.userId, userId2: receiver })
            .orderBy('message.createdAt', 'DESC')
            .getMany();

        res.status(200).json(msgList);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const messageUsers = async (req, res) => {
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

        const sentMessages = messageRepository.createQueryBuilder('message')
            .select('message.receiverId')
            .where('message.senderId = :userId', { userId: userDataRedis.userId });

        const receivedMessages = messageRepository.createQueryBuilder('message')
            .select('message.senderId')
            .where('message.receiverId = :userId', { userId: userDataRedis.userId });

        const subQuery = `${sentMessages.getQuery()} UNION ${receivedMessages.getQuery()}`;

        const msgUsers = await messageRepository.createQueryBuilder()
            .select('user.id', 'id')
            .addSelect('user.username', 'username')
            .addSelect('profile.profilePicture', 'profilePicture')
            .from(`(${subQuery})`, 'subQuery')
            .innerJoin(User, 'user', 'user.id = subQuery.id')
            .leftJoin(Profile, 'profile', 'profile.userId = user.id')
            .getRawMany();

        res.status(200).json(msgUsers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}