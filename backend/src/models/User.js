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
  },
});
