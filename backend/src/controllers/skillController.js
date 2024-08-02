import { AppDataSource } from '../config/db.js';
import { Skill } from '../models/Skill.js';
import {checkAuthHeader} from '../helper/authHelper.js'

const skillRepository = AppDataSource.getRepository(Skill);

export const createSkill = async (req, res) => {
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

  //FIXME: Only Admin allow

  const { name } = req.body;

  try {
    const newSkill = skillRepository.create({ name });
    const savedSkill = await skillRepository.save(newSkill);
    res.status(201).json(savedSkill);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getSkills = async (req, res) => {
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
    const skills = await skillRepository.find();
    res.json(skills);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteSkill = async (req, res) => {
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

  // FIXME: Only Admin allow

  const id = req.params.id;

  try {
    const skill = await skillRepository.findOneBy({ id });
    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }

    await skillRepository.remove(skill);
    res.json({ message: 'Skill deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
