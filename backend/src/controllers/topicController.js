import {AppDataSource} from '../config/db.js';
import {Topic} from '../models/Topic.js';
import {checkAuthHeader} from '../helper/authHelper.js'

const topicRepository = AppDataSource.getRepository(Topic);

// 1. TOPIC list
export const listTopic = async (req, res) => {
    // Check and validate Authorization token
    let userDataRedis;
    try {
        userDataRedis = await checkAuthHeader(req);
        if (!userDataRedis) {
            return res.status(401).json({message: 'ERROR_UNAUTHORIZED'});
        }
    } catch (error) {
        console.log(error);
        return res.status(401).json({message: 'ERROR_UNAUTHORIZED'});
    }

    const topics = await topicRepository.find();
    res.status(201).json(topics);
};

// 2. TOPIC create
export const createTopic = async (req, res) => {
    // Check and validate Authorization token
    let userDataRedis;
    try {
        userDataRedis = await checkAuthHeader(req);
        if (!userDataRedis) {
            return res.status(401).json({message: 'ERROR_UNAUTHORIZED'});
        }
    } catch (error) {
        console.log(error);
        return res.status(401).json({message: 'ERROR_UNAUTHORIZED'});
    }

    const topic = topicRepository.create(req.body);

    console.log(topic);
    const result = await topicRepository.save(topic);
    console.log(result);
    res.status(200).json(result);
};

// 3. TOPIC delete
export const deleteTopic = async (req, res) => {
    // Check and validate Authorization token
    let userDataRedis;
    try {
        userDataRedis = await checkAuthHeader(req);
        if (!userDataRedis) {
            return res.status(401).json({message: 'ERROR_UNAUTHORIZED'});
        }
    } catch (error) {
        console.log(error);
        return res.status(401).json({message: 'ERROR_UNAUTHORIZED'});
    }

    //FIXME: only admin can delete

    const result = await topicRepository.delete(req.params.id);
    res.status(200).json({message: "successfully deleted"});
};