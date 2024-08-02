import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import {getValue, putValueWithExpire, removeKey} from '../models/RdisModel.js';

dotenv.config();

const loginUser = async (user) => {

    const ttl = Number(process.env.TOKEN_EXPIRE);
    console.log(ttl);

    const token = jwt.sign({
        username: user.username,
        role: user.role
    }, process.env.JWT_SECRET, {expiresIn: `${ttl}s`});

    console.log(token);

    await putValueWithExpire(token, JSON.stringify({
        userId: user.id,
        username: user.username,
        role: user.role
    }), ttl);

    return token;
}

const checkAuthHeader = async (req) => {
    const token = req.header('Authorization')?.split(' ')[1];

    // Check if header has Auth token or not
    if (!token) {
        console.log('Request doest not have Authorization header token');
        return null;
        // return res.status(401).json({ message: 'ERROR_UNAUTHORIZED' });
    }

    let decoded = "";
    try {
        // console.log(token);
        decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decoded);
    } catch (error) {
        console.log('Error verifying token', decoded);
        return null;
        // return res.status(401).json({message: 'ERROR_UNAUTHORIZED'});
    }

    // check if user already logged out
    const tokenUserData = await getValue(token);
    console.log(token);
    console.log(tokenUserData);

    if (!tokenUserData){
        console.log('Authorization token is not valid anymore');
        return null;
        // return res.status(401).json({message: 'ERROR_UNAUTHORIZED'});
    }

    return tokenUserData;
}


const removeLoginToken = async (req) => {
    const token = req.header('Authorization')?.split(' ')[1];
    // delete the entry
    await removeKey(token);
    console.log('auth token entry deleted - user logged out');
}

export {loginUser, checkAuthHeader, removeLoginToken};