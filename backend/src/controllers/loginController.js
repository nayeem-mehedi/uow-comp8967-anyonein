import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

import { AppDataSource } from '../config/db.js';
import { User } from '../models/User.js';
import { getValue, putValueWithExpire } from '../models/RdisModel.js';

dotenv.config();

const userRepository = AppDataSource.getRepository(User);

export const registerUser = async (req, res) => {
  const { username, password, firstName, lastName, email, phone } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  
  const newUser = userRepository.create({ username, password: hashedPassword, firstName, lastName, email, phone });
  try {
    const savedUser = await userRepository.save(newUser);
    res.status(201).json(savedUser);
  } catch (error) {
    console.warn(error.message);
    res.status(500).json({ message: 'SERVER_ERROR'});
  }
};

export const loginUser = async (req, res) => {
  const { username, password } = req.body;
  
  try {
    const user = await userRepository.findOne({ where: { username } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const ttl = Number(process.env.TOKEN_EXPIRE);
    console.log(ttl);

    const token = jwt.sign({ username: user.username, role: user.role }, process.env.JWT_SECRET, { expiresIn: `${ttl}s` });
    await putValueWithExpire(token, JSON.stringify({username: user.username, role: user.role}), ttl);
    res.json({ token });
  } catch (error) {
    console.warn(error.message);
    res.status(500).json({ message: 'SERVER_ERROR'});
  }
};

export const logout = async (req, res) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token)
    return res.status(401).json({ message: 'ERROR_UNAUTHORIZED' });

  const tokenExists = await getValue(token);
  console.log(token);
  console.log(tokenExists);

  if(!tokenExists)
    return res.status(401).json({ message: 'ERROR_UNAUTHORIZED' });

  putValueWithExpire(token, 1, -1)
  return res.status(200).json({ message: 'LOGOUT_SUCCESS' });
};