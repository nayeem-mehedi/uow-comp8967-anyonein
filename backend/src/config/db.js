import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import { User } from '../models/User.js';
import { Profile } from '../models/Profile.js';
import { Skill } from '../models/Skill.js';
import { ProfileSkill } from '../models/ProfileSkill.js';
import { Topic } from "../models/Topic.js";
import { Project } from "../models/Project.js";

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'mariadb',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '3306', 10),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [User, Profile, Skill, ProfileSkill, Topic, Project],
  // logging: true,
});
