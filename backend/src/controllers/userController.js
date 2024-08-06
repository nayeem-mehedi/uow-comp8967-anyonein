import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import { AppDataSource } from '../config/db.js';
import { User } from '../models/User.js';
import { checkAuthHeader } from '../helper/authHelper.js'

dotenv.config();

const userRepository = AppDataSource.getRepository(User);

export const getUser = async (req, res) => {
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

  // TODO: Admin or own can edit

  const id = req.params.id;
  const { username, firstName, lastName, email, phone, role } = req.body;

  try {
    const user = await userRepository.findOneBy({ id });

    if (userDataRedis.username !== user.username) {
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
  try {
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

    try {
      const users = await userRepository.find();
      const listUser = users.map(u => {
        return {
          id: u.id,
          username: u.username,
          firstName: u.username,
          lastName: u.username,
          email: u.email,
          phone: u.phone,
          role: u.role,
          isActive: u.isActive,
        }
      })

      res.status(200).json(listUser);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
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

    //TODO: only own or admin can delete

    const id = req.params.id;

    let user;

    try {
      user = await userRepository.findOneBy({ id });
    } catch (error) {
      return res.status(500).json({ message: 'Error finding user', error: error.message });
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    //Admin of Self Delete
    if ((userDataRedis.role !== 'admin') && (userDataRedis.username !== user.username)) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    try {
      user.isActive = false;
      await userRepository.save(user);
      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      return res.status(500).json({ message: 'Error deleting user', error: error.message });
    }

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const changePassword = async (req, res) => {
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

  // get passwords from body
  const { oldPassword, newPassword } = req.body;

  try {
    const user = await userRepository.findOneBy({ username: userDataRedis.username });

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
    res.status(500).json({ message: 'SERVER_ERROR' });
  }

};
