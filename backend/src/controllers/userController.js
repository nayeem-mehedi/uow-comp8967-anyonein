import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
// import jwt from 'jsonwebtoken';
import { AppDataSource } from '../config/db.js';
import { User } from '../models/User.js';
// import {getValue} from '../models/RdisModel.js';
import {checkAuthHeader} from '../helper/authHelper.js'

dotenv.config();

const userRepository = AppDataSource.getRepository(User);

export const getUser = async (req, res) => {
  // Check and validate Authorization token
  const token = req.header('Authorization')?.split(' ')[1];
  await checkAuthHeader(token, res);

  const id = req.params.id;

  try {
    const user = await userRepository.findOneBy({ id });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const editUser = async (req, res) => {
  // Check and validate Authorization token
  const token = req.header('Authorization')?.split(' ')[1];
  const usernameRedis = await checkAuthHeader(token, res);

  // TODO: Admin can edit

  const id = req.params.id;
  const { username, firstName, lastName, email, phone, role } = req.body;

  try {
    const user = await userRepository.findOneBy({ id });

    if(usernameRedis != user.username) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.username = username;
    user.firstName = firstName;
    user.lastName = lastName;
    user.email = email;
    user.phone = phone;
    user.role = role;

    const updatedUser = await userRepository.save(user);
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const listUsers = async (req, res) => {
  // Check and validate Authorization token
  const token = req.header('Authorization')?.split(' ')[1];
  await checkAuthHeader(token, res);

  try {
    const users = await userRepository.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  // Check and validate Authorization token
  const token = req.header('Authorization')?.split(' ')[1];
  const usernameRedis =  await checkAuthHeader(token, res);

  // TODO: Admin can also delete

  const id = req.params.id;

  try {
    const user = await userRepository.findOneBy({ id });

    if(usernameRedis != user.username) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isActive = false;
    await userRepository.save(user);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const changePassword = async (req, res) => {
  // Check and validate Authorization token
  const token = req.header('Authorization')?.split(' ')[1];
  const tokenUser = await checkAuthHeader(token, res);

  // get passwords from body
  const { oldPassword, newPassword } = req.body;

  try {
    const user = await userRepository.findOneBy({ username: tokenUser });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // check passwords
    const isValidPassword = await bcrypt.compare(oldPassword, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ message: 'Old password is incorrect' });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await userRepository.save(user);

    //TODO: remove login token

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.warn(error.message);
    res.status(500).json({ message: 'SERVER_ERROR'});
  }
  
};
