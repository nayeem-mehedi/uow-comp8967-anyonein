import { EntitySchema } from 'typeorm';

export const User = new EntitySchema({
  name: 'User',
  tableName: 'users',
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true,
    },
    username: {
      type: String,
      unique: true,
      nullable: false,
    },
    password: {
      type: String,
      nullable: false,
    },
    firstName: {
      type: String,
      nullable: false,
    },
    lastName: {
      type: String,
      nullable: false,
    },
    email: {
      type: String,
      unique: true,
      nullable: false,
    },
    phone: {
      type: String,
      nullable: true,
    },
    role: {
      type: String,
      default: 'user', //user, admin
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  relations: {
    profile: {
      type: 'one-to-one',
      target: 'Profile',
      inverseSide: 'user',
    },
  }, followedProjects: {
    type: 'one-to-many',
    target: 'ProjectFollow',
    inverseSide: 'userFollow',
  },
  followedUsers: {
    type: 'one-to-many',
    target: 'UserFollow',
    inverseSide: 'follower',
  },
  followingUsers: {
    type: 'one-to-many',
    target: 'UserFollow',
    inverseSide: 'following',
  },
  announcements: {
    type: 'one-to-many',
    target: 'Announcement',
    inverseSide: 'user',
  },
  notifications: {
    type: 'one-to-many',
    target: 'Notification',
    inverseSide: 'user',
  },
});
