import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

import { getValue } from '../models/RdisModel.js';

dotenv.config();

const checkAuthHeader = async (token, res) => {
    // Check if header has Auth token or not
    if (!token)
    return res.status(401).json({ message: 'ERROR_UNAUTHORIZED' });

    let decoded = "";
    try {
    // console.log(token);
    decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);
    } catch (error) {
    console.log(decoded);
        return res.status(401).json({ message: 'ERROR_UNAUTHORIZED' });
    }

    // check if user already logged out
    const tokenUser = await getValue(token);
    console.log(token);
    console.log(tokenUser);

    if(!tokenUser)
        return res.status(401).json({ message: 'ERROR_UNAUTHORIZED' });

    return tokenUser;
}

export {checkAuthHeader};