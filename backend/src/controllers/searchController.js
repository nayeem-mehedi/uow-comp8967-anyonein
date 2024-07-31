import { AppDataSource } from '../config/db.js';
import { User } from '../models/User.js';
import { Project } from '../models/Project.js';
import { checkAuthHeader } from '../helper/authHelper.js';

export const searchUsers = async (req, res) => {
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

  const { query, page = 1, limit = 10 } = req.query;

  try {
    const userRepository = AppDataSource.getRepository(User);
    const words = query ? query.split(' ').map(word => word.trim()) : [];

    const queryBuilder = userRepository.createQueryBuilder('user')
      .leftJoinAndSelect('user.profile', 'profile')
      .leftJoinAndSelect('profile.skills', 'skill');

    words.forEach((word, index) => {
      queryBuilder.orWhere("user.username LIKE :word" + index, { ["word" + index]: `%${word}%` })
        .orWhere("user.firstName LIKE :word" + index, { ["word" + index]: `%${word}%` })
        .orWhere("user.lastName LIKE :word" + index, { ["word" + index]: `%${word}%` })
        .orWhere("user.email LIKE :word" + index, { ["word" + index]: `%${word}%` })
        .orWhere("skill.name LIKE :word" + index, { ["word" + index]: `%${word}%` });
    });

    // get total count
    const totalUsers = await queryBuilder.getCount();

    queryBuilder.skip((page - 1) * limit)
      .take(limit);

    const users = await queryBuilder.getMany();

    res.status(200).json({
      total: totalUsers,
      page: parseInt(page),
      limit: parseInt(limit),
      data: users
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
};

export const searchProjects = async (req, res) => {
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

  const { query, page = 1, limit = 10, skills, topics, contributor, owner } = req.query;

  try {
    const projectRepository = AppDataSource.getRepository(Project);
    const words = query ? query.split(' ').map(word => word.trim()) : [];
    const skillsArray = skills ? skills.split(',').map(skill => skill.trim()) : [];
    const topicsArray = topics ? topics.split(',').map(topic => topic.trim()) : [];

    const queryBuilder = projectRepository
      .createQueryBuilder('project')
      .leftJoinAndSelect('project.skills', 'skill')
      .leftJoinAndSelect('project.topic', 'topic')
      .leftJoinAndSelect('project.users', 'user');

    words.forEach((word, index) => {
      queryBuilder.orWhere("project.name LIKE :word" + index, { ["word" + index]: `%${word}%` })
        .orWhere("project.description LIKE :word" + index, { ["word" + index]: `%${word}%` });
    });

    if (skillsArray.length > 0) {
      skillsArray.forEach((skill, index) => {
        queryBuilder.orWhere("skill.name LIKE :skill" + index, { ["skill" + index]: `%${skill}%` });
      });
    }

    if (topicsArray.length > 0) {
      topicsArray.forEach((topic, index) => {
        queryBuilder.orWhere("topic.name LIKE :topic" + index, { ["topic" + index]: `%${topic}%` });
      });
    }

    if (contributor) {
      queryBuilder.andWhere("user.username = :contributor", { contributor });
    }

    if (owner) {
      queryBuilder.andWhere("user.username = :owner", { owner });
    }

    // get total count
    const totalProjects = await queryBuilder.getCount();

    queryBuilder.skip((page - 1) * limit)
      .take(limit);

    const projects = await queryBuilder.getMany();

    res.status(200).json({
      total: totalProjects,
      page: parseInt(page),
      limit: parseInt(limit),
      data: projects
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
};

