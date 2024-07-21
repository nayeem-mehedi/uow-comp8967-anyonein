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
    user: {
      type: 'many-to-one',
      target: 'User',
      joinColumn: true,
      nullable: false,
    },
    project: {
      type: 'many-to-one',
      target: 'Project',
      joinColumn: true,
      nullable: false,
    },
  },
});
