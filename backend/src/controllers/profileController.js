import { AppDataSource } from '../config/db.js';
import { Profile } from '../models/Profile.js';
import { User } from '../models/User.js';
import { checkAuthHeader } from '../helper/authHelper.js'

const profileRepository = AppDataSource.getRepository(Profile);
const userRepository = AppDataSource.getRepository(User);

export const createProfile = async (req, res) => {
  // Check and validate Authorization token
  const token = req.header('Authorization')?.split(' ')[1];
  await checkAuthHeader(token, res);

  // TODO: Only self allowed

  const { githubProfile, otherProfile, profilePicture, userId } = req.body;

  try {
    // check for dup entry (create profile at the time of github)
    const newProfile = profileRepository.create({ githubProfile, otherProfile, profilePicture, user: { id: userId } });
    const savedProfile = await profileRepository.save(newProfile);
    res.status(201).json(savedProfile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getSelfProfile = async (req, res) => {
  // Check and validate Authorization token
  const token = req.header('Authorization')?.split(' ')[1];
  const user = await checkAuthHeader(token, res);
  console.log(user);

  const queryBuilder = profileRepository.createQueryBuilder('profile')
    .leftJoinAndSelect('profile.user', 'user')
    .leftJoinAndSelect('profile.skills', 'skill')
    .where("user.username = :username", { username: user.username });

  try {
    const profile = await queryBuilder.getOne();
    console.log(profile);

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    profile.user.password = "";

    return res.json(profile);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};


export const getProfile = async (req, res) => {
  // Check and validate Authorization token
  const token = req.header('Authorization')?.split(' ')[1];
  await checkAuthHeader(token, res);

  const id = req.params.id;

  try {
    const profile = await profileRepository.findOne({ where: { id }, relations: ['user', 'skills'] });
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    profile.user.password = "";

    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {

    // Check and validate Authorization token
    const token = req.header('Authorization')?.split(' ')[1];
    await checkAuthHeader(token, res);

    // FIXME: Only self allowed

    const id = req.params.id;

    if (id === 'self') {
      const userName = await checkAuthHeader(token, res);
      console.log(userName);

      const queryBuilder = profileRepository.createQueryBuilder('profile')
        .leftJoinAndSelect('profile.user', 'user')
        .leftJoinAndSelect('profile.skills', 'skill')
        .where("user.username = :username", { username: userName });

      const profile = await queryBuilder.getOne();

      const { githubProfile, otherProfile, profilePicture } = req.body;

      if (!profile) {
        return res.status(404).json({ message: 'Profile not found' });
      }

      profile.githubProfile = githubProfile;
      profile.otherProfile = otherProfile;
      profile.profilePicture = profilePicture;

      const updatedProfile = await profileRepository.save(profile);
      res.json(updatedProfile);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }





  // try {
  //   const profile = await profileRepository.findOneBy({ id });
  //   if (!profile) {
  //     return res.status(404).json({ message: 'Profile not found' });
  //   }

  //   profile.githubProfile = githubProfile;
  //   profile.otherProfile = otherProfile;
  //   profile.profilePicture = profilePicture;

  //   const updatedProfile = await profileRepository.save(profile);
  //   res.json(updatedProfile);
  // } catch (error) {
  //   res.status(500).json({ error: error.message });
  // }
};
