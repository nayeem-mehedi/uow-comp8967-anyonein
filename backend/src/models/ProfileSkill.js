import { EntitySchema } from 'typeorm';

export const ProfileSkill = new EntitySchema({
  name: 'ProfileSkill',
  tableName: 'profile_skills',
  columns: {
    profileId: {
      type: Number,
      primary: true,
    },
    skillId: {
      type: Number,
      primary: true,
    },
  },
  relations: {
    profile: {
      type: 'many-to-one',
      target: 'Profile',
      joinColumn: {
        name: 'profileId',
      },
      onDelete: 'CASCADE',
    },
    skill: {
      type: 'many-to-one',
      target: 'Skill',
      joinColumn: {
        name: 'skillId',
      },
      onDelete: 'CASCADE',
    },
  },
});
