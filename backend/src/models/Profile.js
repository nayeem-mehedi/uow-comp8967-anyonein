import { EntitySchema } from 'typeorm';

export const Profile = new EntitySchema({
  name: 'Profile',
  tableName: 'profiles',
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true,
    },
    githubProfile: {
      type: String,
      nullable: true,
    },
    otherProfile: {
      type: String,
      nullable: true,
    },
    profilePicture: {
      type: String,
      nullable: true,
    },
  },
  relations: {
    user: {
      type: 'one-to-one',
      target: 'User',
      joinColumn: true,
    },
    skills: {
      type: 'many-to-many',
      target: 'Skill',
      joinTable: {
        name: 'profile_skills',
        joinColumn: {
          name: 'profileId',
          referencedColumnName: 'id'
        },
        inverseJoinColumn: {
          name: 'skillId',
          referencedColumnName: 'id'
        }
      }
    },
  },
});
