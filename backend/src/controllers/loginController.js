import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

import {AppDataSource} from '../config/db.js';
import {User} from '../models/User.js';
import {loginUser, checkAuthHeader, removeLoginToken} from "../helper/authHelper.js";

dotenv.config();

//FIXME: rename to authController

const userRepository = AppDataSource.getRepository(User);

export const register = async (req, res) => {
    const {username, password, firstName, lastName, email, phone} = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = userRepository.create({username, password: hashedPassword, firstName, lastName, email, phone});
    try {
        const savedUser = await userRepository.save(newUser);
        res.status(201).json(savedUser);
    } catch (error) {
        console.warn(error.message);
        res.status(500).json({message: 'SERVER_ERROR'});
    }
};

export const login = async (req, res) => {
    const {username, password} = req.body;

    try {
        const user = await userRepository.findOne({where: {username}});
        if (!user) {
            return res.status(401).json({message: 'Invalid credentials'});
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({message: 'Invalid credentials'});
        }

        const token = await loginUser(user);

        res.status(200).json({token});
    } catch (error) {
        console.warn(error.message);
        res.status(500).json({message: 'SERVER_ERROR'});
    }
};

export const logout = async (req, res) => {
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

    await removeLoginToken(req);
    return res.status(200).json({message: 'LOGOUT_SUCCESS'});
};