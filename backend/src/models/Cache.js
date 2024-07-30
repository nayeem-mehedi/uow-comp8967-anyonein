import { EntitySchema } from 'typeorm';

export const RedisCache = new EntitySchema({
    name: 'RedisCache',
    tableName: 'redis_cache',
    columns: {
        key: {
            type: String,
            primary: true,
        },
        value: {
            type: String,
            nullable: false,
        },
        expiration: {
            type: 'timestamp',
            nullable: true,
        },
        createdAt: {
            type: 'timestamp',
            default: () => 'CURRENT_TIMESTAMP',
        },
        updatedAt: {
            type: 'timestamp',
            default: () => 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
        },
    },
});
