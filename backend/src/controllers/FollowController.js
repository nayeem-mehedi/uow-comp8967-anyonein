import { AppDataSource } from '../config/db.js';
import { User } from '../models/User.js';
import { UserFollow } from '../models/UserFollow.js';
import { Project } from '../models/Project.js';
import { ProjectFollow } from '../models/ProjectFollow.js';
import { checkAuthHeader } from '../helper/authHelper.js'

const userRepository = AppDataSource.getRepository(User);
const userFollowRepository = AppDataSource.getRepository(UserFollow);
const projectFollowRepository = AppDataSource.getRepository(ProjectFollow);
const projectRepository = AppDataSource.getRepository(Project);

export const followUser = async (req, res) => {
    try {
        // Check and validate Authorization token
        let userDataRedis;
        try {
            userDataRedis = await checkAuthHeader(req);
            if(!userDataRedis) {
                return res.status(401).json({ message: 'ERROR_UNAUTHORIZED' });
            }
        } catch (error) {
            console.log(error);
            return res.status(401).json({message: 'ERROR_UNAUTHORIZED'});
        }

        const followUserId = req.params.id;
        // console.log(followUserId)
        const userToFollow = await userRepository.findOneBy({ id: followUserId });
        // console.log(userToFollow)
        if (!userToFollow) {
            return res.status(404).json({ message: 'User not found' });
        }

        console.log(userToFollow)

        const existingFollow = await userFollowRepository.findOne(
            {
                where:
                {
                    follower: { id: userDataRedis.userId },
                    following: { id: followUserId }
                },
                relations: ['follower', 'following']
            });

        console.log(existingFollow)
        if (existingFollow) {
            await userFollowRepository.remove(existingFollow);
            return res.status(200).json({ message: 'Unfollowed the user' });
        } else {
            const userFollow = userFollowRepository.create({ follower: { id: userDataRedis.userId }, following: userToFollow });
            await userFollowRepository.save(userFollow);
            return res.status(200).json({ message: 'Started following the user' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}


export const followProject = async (req, res) => {
    try {
        // Check and validate Authorization token
        let userDataRedis;
        try {
            userDataRedis = await checkAuthHeader(req);
            if(!userDataRedis) {
                return res.status(401).json({ message: 'ERROR_UNAUTHORIZED' });
            }
        } catch (error) {
            console.log(error);
            return res.status(401).json({message: 'ERROR_UNAUTHORIZED'});
        }

        const followProjectId = req.params.id;
        const projectToFollow = await projectRepository.findOneBy({ id: followProjectId });

        if (!projectToFollow) {
            return res.status(404).json({ message: 'Project not found' });
        }

        const existingFollow = await projectFollowRepository.findOne(
            {
                where:
                {
                    follower: { id: userDataRedis.userId },
                    pointedProject: { id: followProjectId }
                },
                relations: ['follower', 'pointedProject']
            });

        if (existingFollow) {
            await projectFollowRepository.remove(existingFollow);
            return res.status(200).json({ message: 'Unfollowed the project' });
        } else {
            const projectFollow = projectFollowRepository.create({ follower: { id: userDataRedis.userId }, pointedProject: projectToFollow });
            await projectFollowRepository.save(projectFollow);
            return res.status(200).json({ message: 'Started following the project' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const followList = async (req, res) => {
    try {
        // Check and validate Authorization token
        let userDataRedis;
        try {
            userDataRedis = await checkAuthHeader(req);
            if(!userDataRedis) {
                return res.status(401).json({ message: 'ERROR_UNAUTHORIZED' });
            }
        } catch (error) {
            console.log(error);
            return res.status(401).json({message: 'ERROR_UNAUTHORIZED'});
        }

        const userFollow_following = await userFollowRepository
            .createQueryBuilder('userFollow')
            .leftJoinAndSelect('userFollow.following', 'following')
            .select([
                'userFollow.id',
                'following.id',
                'following.firstName',
                'following.lastName',
                'following.username'
            ])
            .where('userFollow.followerId = :userId', { userId: userDataRedis.userId })
            .getMany();

        const projectFollow_following = await projectFollowRepository
            .createQueryBuilder('projectFollow')
            .leftJoinAndSelect('projectFollow.pointedProject', 'pointedProject')
            .select([
                'projectFollow.id',
                'pointedProject.id',
                'pointedProject.name'
            ])
            .where('projectFollow.followerId = :userId', { userId: userDataRedis.userId })
            .getMany();

        const userFollow_follower = await userFollowRepository
            .createQueryBuilder('userFollow')
            .leftJoinAndSelect('userFollow.follower', 'follower')
            .select([
                'userFollow.id',
                'follower.id',
                'follower.firstName',
                'follower.lastName',
                'follower.username'
            ])
            .where('userFollow.followingId = :userId', { userId: userDataRedis.userId })
            .getMany();

        const followingUserIds = new Set(userFollow_following.map(f => f.following.id));
        const followedByUsers = userFollow_follower.map(f => ({
            ...f.follower,
            following: followingUserIds.has(f.follower.id),
        }));

        return res.status(200).json({
            followingUsers: userFollow_following.map(f => f.following),
            followingProjects: projectFollow_following.map(f => f.pointedProject),
            followedByUsers: followedByUsers,
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


