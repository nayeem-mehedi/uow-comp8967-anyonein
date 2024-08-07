import { EntitySchema } from 'typeorm';

export const JoinRequest = new EntitySchema({
    name: 'JoinRequest',
    tableName: 'join_requests',
    columns: {
        id: {
            type: Number,
            primary: true,
            generated: true,
        },
        message: {
            type: String,
            nullable: false,
        },
        status: {
            type: String,
            default: 'pending', // pending, accepted, rejected
        },
    },
    relations: {
        user: {
            type: 'many-to-one',
            target: 'User',
            joinColumn: true,
        },
        project: {
            type: 'many-to-one',
            target: 'Project',
            joinColumn: true,
        },
    },
});
