import { EntitySchema } from 'typeorm';

export const Announcement = new EntitySchema({
  name: 'Announcement',
  tableName: 'announcements',
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true,
    },
    title: {
      type: String,
      nullable: false,
    },
    content: {
      type: String,
      nullable: false,
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
  relations: {
    user: {
      type: 'many-to-one',
      target: 'User',
      joinColumn: true,
      nullable: true,
    },
    project: {
      type: 'many-to-one',
      target: 'Project',
      joinColumn: true,
      nullable: true,
    },
  },
});
