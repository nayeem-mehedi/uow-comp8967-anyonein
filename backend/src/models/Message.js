import { EntitySchema } from 'typeorm';

export const Message = new EntitySchema({
    name: 'Message',
    tableName: 'messages',
    columns: {
        id: {
            type: Number,
            primary: true,
            generated: true,
        },
        content: {
            type: String,
            nullable: false,
        },
        createdAt: {
            type: 'timestamp',
            default: () => 'CURRENT_TIMESTAMP',
        },
        read: {
            type: Boolean,
            default: false,
        },
    },
    relations: {
        sender: {
            type: 'many-to-one',
            target: 'User',
            inverseSide: 'sentMessages',
            joinColumn: {
                name: 'senderId',
            },
        },
        receiver: {
            type: 'many-to-one',
            target: 'User',
            inverseSide: 'receivedMessages',
            joinColumn: {
                name: 'receiverId',
            },
        },
    },
});
