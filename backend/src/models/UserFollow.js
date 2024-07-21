import { EntitySchema } from 'typeorm';

export const UserFollow = new EntitySchema({
  name: 'UserFollow',
  tableName: 'user_follows',
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true,
    },
    createdAt: {
      type: 'timestamp',
      default: () => 'CURRENT_TIMESTAMP',
    },
  },
  relations: {
    follower: {
      type: 'many-to-one',
      target: 'User',
      joinColumn: {
        name: 'followerId',
        referencedColumnName: 'id',
      },
      nullable: false,
    },
    following: {
      type: 'many-to-one',
      target: 'User',
      joinColumn: {
        name: 'followingId',
        referencedColumnName: 'id',
      },
      nullable: false,
    },
  },
});
