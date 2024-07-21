import { AppDataSource } from '../config/db.js';
import { ProfileSkill } from '../models/ProfileSkill.js';
import { Profile } from '../models/Profile.js';
import { Skill } from '../models/Skill.js';
import { checkAuthHeader } from '../helper/authHelper.js'

const profileSkillRepository = AppDataSource.getRepository(ProfileSkill);
const profileRepository = AppDataSource.getRepository(Profile);
const skillRepository = AppDataSource.getRepository(Skill);

export const addSkillToProfile = async (req, res) => {
  // Check and validate Authorization token
  const token = req.header('Authorization')?.split(' ')[1];
  const { userId, username, role } = await checkAuthHeader(token, res);

  // TODO: Only self allowed

  const { skills } = req.body;
  console.log(skills);

  try {
    const queryBuilder = profileRepository.createQueryBuilder('profile')
        .leftJoinAndSelect('profile.user', 'user')
        .leftJoinAndSelect('profile.skills', 'skill')
        .where("user.username = :username", { username: username });

    const profile = await queryBuilder.getOne();

    if (!profile) {
      return res.status(404).json({ message: 'Profile or Skill not found' });
    }

    let skillList = [];

    for (const skillId of skills) {
      const skill = await skillRepository.findOne({where: {id: skillId} });
      console.log(skill);
      if (skill){
        const profileSkill = profileSkillRepository.create({ profile, skillId: skill.id });
        const savedProfileSkill = await profileSkillRepository.save(profileSkill);
        skillList.push(skill);
      }
    }

    res.status(201).json({ message: 'Skills added successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const removeSkillFromProfile = async (req, res) => {
  // Check and validate Authorization token
  const token = req.header('Authorization')?.split(' ')[1];
  const userDataRedis = await checkAuthHeader(token, res);

  // TODO: Only self allowed

  const profile_id = req.params.profile_id;
  const skill_id = req.params.skill_id;

  try {

    const queryBuilder = profileRepository.createQueryBuilder('profile')
      .leftJoinAndSelect('profile.user', 'user')
      .leftJoinAndSelect('profile.skills', 'skill')
      .where("user.username = :username", { username: userDataRedis.username });

    const profile = await queryBuilder.getOne();

    const profileSkill = await profileSkillRepository.findOneBy({ profileId: profile.id, skillId: skill_id });
    if (!profileSkill) {
      return res.status(404).json({ message: 'Profile Skill not found' });
    }

    await profileSkillRepository.remove(profileSkill);
    res.json({ message: 'Profile Skill removed successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
