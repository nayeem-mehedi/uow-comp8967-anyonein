import { AppDataSource } from '../config/db.js';
import { User } from '../models/User.js';
import { checkAuthHeader } from '../helper/authHelper.js';

export const searchUsers = async (req, res) => {
  // Check and validate Authorization token
  const token = req.header('Authorization')?.split(' ')[1];
  await checkAuthHeader(token, res);

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
    res.status(500).json({ error: error.message });
  }
};
