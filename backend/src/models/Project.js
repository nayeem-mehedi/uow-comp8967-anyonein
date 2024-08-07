import { EntitySchema } from 'typeorm';

export const Project = new EntitySchema({
  name: 'Project',
  tableName: 'projects',
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true,
    },
    name: {
      type: String,
      nullable: false,
    },
    description: {
      type: 'text',
      nullable: false,

    },
    sourceCodeLink: {
      type: String,
      nullable: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  relations: {
    owner: {
        type: 'many-to-one',
        target: 'User',
        joinColumn: true,
    },
    topic: {
      type: 'many-to-one',
      target: 'Topic',
      joinColumn: true,
    },
    skills: {
      type: 'many-to-many',
      target: 'Skill',
      joinTable: {
        name: 'project_skills',
        joinColumn: {
          name: 'projectId',
          referencedColumnName: 'id',
        },
        inverseJoinColumn: {
          name: 'skillId',
          referencedColumnName: 'id',
        },
      },
    },
    users: {
      type: 'many-to-many',
      target: 'User',
      joinTable: {
        name: 'project_users',
        joinColumn: {
          name: 'projectId',
          referencedColumnName: 'id',
        },
        inverseJoinColumn: {
          name: 'userId',
          referencedColumnName: 'id',
        },
      },
    },
    followedBy: {
      type: 'one-to-many',
      target: 'ProjectFollow',
      inverseSide: 'pointedProject',
    },
    announcements: {
      type: 'one-to-many',
      target: 'Announcement',
      inverseSide: 'project',
    },
    joinRequests: {
      type: 'one-to-many',
      target: 'JoinRequest',
      inverseSide: 'project',
    },
  },
});
