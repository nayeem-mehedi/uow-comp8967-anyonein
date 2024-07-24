import { EntitySchema } from 'typeorm';

export const Notification = new EntitySchema({
  name: 'Notification',
  tableName: 'notifications',
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true,
    },
    type: {
      type: 'enum',
      enum: ['USER_UPDATE', 'PROJECT_UPDATE'],
      nullable: false,
    },
    content: {
      type: String,
      nullable: false,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: 'timestamp',
      default: () => 'CURRENT_TIMESTAMP',
    },
  },
  relations: {
    user: {
      type: 'many-to-one',
      target: 'User',
      joinColumn: true,
      nullable: false,
    },
    relatedUser: {
      type: 'many-to-one',
      target: 'User',
      joinColumn: true,
      nullable: true,
    },
    relatedProject: {
      type: 'many-to-one',
      target: 'Project',
      joinColumn: true,
      nullable: true,
    },
    announcement: {
      type: 'many-to-one',
      target: 'Announcement',
      joinColumn: true,
      nullable: true,
    },
  },
});
