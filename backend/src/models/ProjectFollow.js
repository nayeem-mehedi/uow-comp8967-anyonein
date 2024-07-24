import { EntitySchema } from 'typeorm';

export const ProjectFollow = new EntitySchema({
  name: 'ProjectFollow',
  tableName: 'project_follows',
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
      joinColumn: true,
      nullable: false,
    },
    pointedProject: {
      type: 'many-to-one',
      target: 'Project',
      joinColumn: true,
      nullable: false,
    },
  },
});
