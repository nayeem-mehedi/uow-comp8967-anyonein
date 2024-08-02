import {DataSource} from 'typeorm';
import dotenv from 'dotenv';
import {User} from '../models/User.js';
import {Profile} from '../models/Profile.js';
import {Skill} from '../models/Skill.js';
import {ProfileSkill} from '../models/ProfileSkill.js';
import {Topic} from "../models/Topic.js";
import {Project} from "../models/Project.js";
import {ProjectFollow} from '../models/ProjectFollow.js';
import {UserFollow} from '../models/UserFollow.js';
import {Announcement} from '../models/Announcement.js';
import {Notification} from '../models/Notification.js';
import {RedisCache} from "../models/Cache.js";
import {File} from "../models/File.js";
import * as fs from "node:fs";

dotenv.config();

export const AppDataSource = new DataSource({
    type: 'mysql',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '3306', 10),
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    entities: [
        RedisCache,
        User,
        Profile,
        Skill,
        ProfileSkill,
        Topic,
        Project,
        ProjectFollow,
        UserFollow,
        Announcement,
        Notification,
        File
    ],
    logging: true,
});
