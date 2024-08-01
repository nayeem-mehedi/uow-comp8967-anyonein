import {EntitySchema} from 'typeorm';

export const File = new EntitySchema({
    name: 'File',
    columns: {
        id: {
            primary: true,
            type: 'uuid',
            generated: 'uuid',
        },
        objectId: {
            type: String,
            nullable: false,
        },
        createdAt: {
            type: 'timestamp',
            default: () => 'CURRENT_TIMESTAMP',
        },
    },
    relations: {
        owner: {
            type: 'many-to-one',
            target: 'User',
            joinColumn: true,
            nullable: false,
        },
    },
});
