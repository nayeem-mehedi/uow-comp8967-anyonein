import {AppDataSource} from '../config/db.js';
import {Message} from '../models/Message.js';

class MessageRepository extends Repository {
    async createMessage(senderId, receiverId, content) {
        const message = this.create({
            sender: { id: senderId },
            receiver: { id: receiverId },
            content,
        });
        return this.save(message);
    }

    async getMessagesBetweenUsers(userId1, userId2) {
        return this.createQueryBuilder('message')
            .where('(message.senderId = :userId1 AND message.receiverId = :userId2) OR (message.senderId = :userId2 AND message.receiverId = :userId1)', { userId1, userId2 })
            .orderBy('message.createdAt', 'ASC')
            .getMany();
    }
}

module.exports = MessageRepository;
