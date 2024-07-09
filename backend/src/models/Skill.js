import { EntitySchema } from 'typeorm';

export const Skill = new EntitySchema({
  name: 'Skill',
  tableName: 'skills',
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true,
    },
    name: {
      type: String,
      unique: true,
      nullable: false,
    },
  },
});
