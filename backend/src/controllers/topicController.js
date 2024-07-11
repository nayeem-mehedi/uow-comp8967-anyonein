import { AppDataSource } from '../config/db.js';
import { Topic } from '../models/Topic.js';
import {checkAuthHeader} from '../helper/authHelper.js'

const topicRepository = AppDataSource.getRepository(Topic);

    // 1. TOPIC list
    export const listTopic = async (req, res) => {
        const topics = await topicRepository.find();
        res.json(topics);
    };

    // 2. TOPIC create
    export const createTopic = async (req, res) => {
        const topic = topicRepository.create(req.body);
        const result = await topicRepository.save(topic);
        res.send(result);
    };

    // 3. TOPIC delete
    export const deleteTopic = async (req, res) => {
        const result = await topicRepository.delete(req.params.id);
        res.send(result);
    };