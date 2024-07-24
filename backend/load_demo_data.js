import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import { User } from './src/models/User.js';
import { Profile } from './src/models/Profile.js';
import { Skill } from './src/models/Skill.js';
import { ProfileSkill } from './src/models/ProfileSkill.js';
import { Topic } from './src/models/Topic.js';
import { Project } from './src/models/Project.js';
import { ProjectFollow } from './src/models/ProjectFollow.js';
import { UserFollow } from './src/models/UserFollow.js';
import { Announcement } from './src/models/Announcement.js';
import { Notification } from './src/models/Notification.js';
import bcrypt from 'bcrypt';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'mariadb',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '3306', 10),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [User, Profile, Skill, ProfileSkill, Topic, Project, ProjectFollow, UserFollow, Announcement, Notification],
  dropSchema: true,
  synchronize: true,
  logging: true,
});

const loadDemoData = async () => {
  try {
    await AppDataSource.initialize();

    // Create skills
    const skillNames = [
      'JavaScript', 'TypeScript', 'Node.js', 'React', 'TypeORM', 'Java', 'Spring Boot',
      'Spring Data', 'Spring Security', 'Spring Webflux', 'Hibernate', 'MyBatis',
      'Python', 'Django', 'Flask', 'C', 'C++', 'C#', 'PHP', 'Laravel', 'Symfony',
      'Ruby', 'Ruby on Rails', 'Swift', 'Kotlin', 'Objective-C', 'HTML', 'CSS',
      'Sass', 'LESS', 'Bootstrap', 'Tailwind CSS', 'Material-UI', 'Chakra UI',
      'SQL', 'MySQL', 'PostgreSQL', 'SQLite', 'MongoDB', 'Redis', 'DynamoDB',
      'GraphQL', 'REST', 'SOAP', 'gRPC', 'AWS', 'AWS Lambda', 'AWS S3', 'AWS EC2',
      'AWS RDS', 'AWS DynamoDB', 'AWS SQS', 'AWS SNS', 'AWS CloudFormation',
      'AWS CDK', 'Terraform', 'Docker', 'Kubernetes', 'Jenkins', 'GitHub Actions',
      'GitLab CI', 'CircleCI', 'Travis CI', 'JIRA', 'Confluence', 'Asana',
      'Trello', 'Slack', 'Microsoft Teams', 'Figma', 'Adobe XD', 'Sketch',
      'InVision', 'Axure RP', 'Draw.io', 'Astah', 'Jest', 'Mocha', 'Chai',
      'JUnit', 'Mockito', 'Spock', 'Cypress', 'Selenium', 'Puppeteer', 'Playwright',
      'JMeter', 'Gatling', 'Locust', 'Postman', 'Insomnia', 'Grafana', 'Prometheus',
      'Splunk', 'ELK Stack', 'Kibana', 'Tableau', 'Power BI', 'MATLAB', 'Octave',
      'R', 'SAS', 'SPSS', 'Scala', 'Rust', 'Go', 'Elixir', 'Haskell'
    ];

    const skillRepo = AppDataSource.getRepository(Skill);
    const skills = skillNames.map(name => skillRepo.create({ name }));
    await skillRepo.save(skills);
    console.log('Skills have been created.');

    // Create users and profiles
    const userRepo = AppDataSource.getRepository(User);
    const profileRepo = AppDataSource.getRepository(Profile);

    const usersData = [
      { username: 'johnmcclane', password: 'john123', firstName: 'John', lastName: 'McClane', email: 'john.mcclane@diehard.com', phone: '1234567890', role: 'user' },
      { username: 'ellenripley', password: 'ellen123', firstName: 'Ellen', lastName: 'Ripley', email: 'ellen.ripley@alien.com', phone: '1234567891', role: 'user' },
      { username: 'neoanderson', password: 'neo123', firstName: 'Neo', lastName: 'Anderson', email: 'neo.anderson@matrix.com', phone: '1234567892', role: 'user' },
      { username: 'sarahconnor', password: 'sarah123', firstName: 'Sarah', lastName: 'Connor', email: 'sarah.connor@terminator.com', phone: '1234567893', role: 'user' },
      { username: 'tonystark', password: 'tony123', firstName: 'Tony', lastName: 'Stark', email: 'tony.stark@ironman.com', phone: '1234567894', role: 'user' },
      { username: 'brucewayne', password: 'bruce123', firstName: 'Bruce', lastName: 'Wayne', email: 'bruce.wayne@batman.com', phone: '1234567895', role: 'user' },
      { username: 'leiaorgana', password: 'leia123', firstName: 'Leia', lastName: 'Organa', email: 'leia.organa@starwars.com', phone: '1234567896', role: 'user' },
      { username: 'indianajones', password: 'indiana123', firstName: 'Indiana', lastName: 'Jones', email: 'indiana.jones@raiders.com', phone: '1234567897', role: 'user' },
      { username: 'peterparker', password: 'peter123', firstName: 'Peter', lastName: 'Parker', email: 'peter.parker@spiderman.com', phone: '1234567898', role: 'user' },
      { username: 'martymcfly', password: 'marty123', firstName: 'Marty', lastName: 'McFly', email: 'marty.mcfly@bttf.com', phone: '1234567899', role: 'user' },
      { username: 'frodobaggins', password: 'frodo123', firstName: 'Frodo', lastName: 'Baggins', email: 'frodo.baggins@lotr.com', phone: '1234567810', role: 'user' },
      { username: 'harrypotter', password: 'harry123', firstName: 'Harry', lastName: 'Potter', email: 'harry.potter@hogwarts.com', phone: '1234567811', role: 'user' },
      { username: 'jamesbond', password: 'james123', firstName: 'James', lastName: 'Bond', email: 'james.bond@007.com', phone: '1234567812', role: 'user' },
      { username: 'lukeskywalker', password: 'luke123', firstName: 'Luke', lastName: 'Skywalker', email: 'luke.skywalker@starwars.com', phone: '1234567813', role: 'user' },
      { username: 'maxrockatansky', password: 'max123', firstName: 'Max', lastName: 'Rockatansky', email: 'max.rockatansky@madmax.com', phone: '1234567814', role: 'user' },
      { username: 'hansolo', password: 'han123', firstName: 'Han', lastName: 'Solo', email: 'han.solo@starwars.com', phone: '1234567815', role: 'user' },
      { username: 'claricestarling', password: 'clarice123', firstName: 'Clarice', lastName: 'Starling', email: 'clarice.starling@silenceofthelambs.com', phone: '1234567816', role: 'user' },
      { username: 'rickdeckard', password: 'rick123', firstName: 'Rick', lastName: 'Deckard', email: 'rick.deckard@blade-runner.com', phone: '1234567817', role: 'user' },
      { username: 'ethanhunt', password: 'ethan123', firstName: 'Ethan', lastName: 'Hunt', email: 'ethan.hunt@mimission.com', phone: '1234567818', role: 'user' },
      { username: 'jasonbourne', password: 'jason123', firstName: 'Jason', lastName: 'Bourne', email: 'jason.bourne@bourne.com', phone: '1234567819', role: 'user' },
    ];

    for (const userData of usersData) {
      try {
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        userData.password = hashedPassword;
        const user = userRepo.create(userData);
        await userRepo.save(user);
        console.log(`User ${user.username} has been created.`);

        const profile = profileRepo.create({
          githubProfile: `https://github.com/${userData.username}`,
          otherProfile: `https://linkedin.com/${userData.username}`,
          profilePicture: `https://ui-avatars.com/api/?name=${userData.firstName}+${userData.lastName}.jpg`,
          user: user,
        });
        await profileRepo.save(profile);
        console.log(`Profile for user ${user.username} has been created.`);
      }
      catch (userError) {
        console.error(`Error creating user ${userData.username}:`, userError);
      }
    }

    // Associate skills with profiles
    const profileSkillRepo = AppDataSource.getRepository(ProfileSkill);
    const profiles = await profileRepo.find();

    for (const profile of profiles) {
      const r1 = Math.floor(Math.random() * skills.length);
      const r2 = Math.floor(Math.random() * skills.length)
      let userSkills = [];
      if(r1>r2){
        userSkills = skills.slice(r2, r1 + 1);
      } else {
        userSkills = skills.slice(r1, r2 + 1);
      }

      for (const skill of userSkills) {
        try {
          const profileSkill = profileSkillRepo.create({
            profile: profile,
            skill: skill,
          });
          await profileSkillRepo.save(profileSkill);
          console.log(`Skill ${skill.name} added to profile ${profile.id}.`);
        } catch (profileSkillError) {
          console.error(`Error associating skill ${skill.name} with profile ${profile.id}:`, profileSkillError);
        }
      }
    }


    const topicNames = [
      'AI/ML', 'Web Development', 'Game Development', 'Mobile Development', 'Data Science',
      'Cybersecurity', 'DevOps', 'Cloud Computing', 'IoT', 'Blockchain', 'AR/VR', 'Big Data',
      'Robotics', 'Embedded Systems', 'Networking', 'Operating Systems', 'Database Management',
      'Software Engineering', 'Functional Programming', 'UI/UX Design'
    ];
    const topicRepo = AppDataSource.getRepository(Topic);
    const topics = topicNames.map(name => topicRepo.create({ name }));
    await topicRepo.save(topics);
    console.log('Topics have been created.');

    // Create projects and associate with topics, skills, and users
    const projectRepo = AppDataSource.getRepository(Project);
    const projectsData = [
      { name: 'AI Project 1', description: 'AI project description', githubLink: 'https://github.com/ai_project_1', gitlabLink: '', topic: topics[0] },
      { name: 'Web Dev Project 1', description: 'Web development project description', githubLink: 'https://github.com/web_dev_project_1', gitlabLink: '', topic: topics[1] },
      { name: 'Game Dev Project 1', description: 'Game development project description', githubLink: 'https://github.com/game_dev_project_1', gitlabLink: '', topic: topics[2] },
      { name: 'Mobile Dev Project 1', description: 'Mobile development project description', githubLink: 'https://github.com/mobile_dev_project_1', gitlabLink: '', topic: topics[3] },
      { name: 'Data Science Project 1', description: 'Data science project description', githubLink: 'https://github.com/data_science_project_1', gitlabLink: '', topic: topics[4] },
      { name: 'Cybersecurity Project 1', description: 'Cybersecurity project description', githubLink: 'https://github.com/cybersecurity_project_1', gitlabLink: '', topic: topics[5] },
      { name: 'DevOps Project 1', description: 'DevOps project description', githubLink: 'https://github.com/devops_project_1', gitlabLink: '', topic: topics[6] },
      { name: 'Cloud Computing Project 1', description: 'Cloud computing project description', githubLink: 'https://github.com/cloud_computing_project_1', gitlabLink: '', topic: topics[7] },
      { name: 'IoT Project 1', description: 'IoT project description', githubLink: 'https://github.com/iot_project_1', gitlabLink: '', topic: topics[8] },
      { name: 'Blockchain Project 1', description: 'Blockchain project description', githubLink: 'https://github.com/blockchain_project_1', gitlabLink: '', topic: topics[9] },
    ];

    const skills_db = await skillRepo.find();
    const users_db = await userRepo.find();

    for (const projectData of projectsData) {
      const project = projectRepo.create(projectData);

      const randomSkills = skills_db.slice(0, Math.floor(Math.random() * 6) + 1);
      project.skills = randomSkills;

      const randomUsers = users_db.slice(0, Math.floor(Math.random() * 3) + 1);//.map(user => profile.user);
      let assignedUsers = [];

      for(let i = 0; i<randomUsers.length; i++) {
        assignedUsers.push({user: randomUsers[i], type: i%2 == 0 ? 'OWNER' : 'CONTRIBUTOR'});
      }

      project.users = assignedUsers;


      await projectRepo.save(project);
      console.log(`Project ${project.name} has been created.`);
    }

    const project_db = await projectRepo.find();

    // Create project follows
    const projectFollowRepo = AppDataSource.getRepository(ProjectFollow);
    for (const user of users_db) {
      const randomProjects = project_db.slice(0, Math.floor(Math.random() * 3) + 1);
      for (const project of randomProjects) {
        const projectFollow = projectFollowRepo.create({
          follower: user,
          pointedProject: project
        });
        await projectFollowRepo.save(projectFollow);
        console.log(`User ${user.username} followed project ${project.name}.`);
      }
    }

    // Create user follows
    const userFollowRepo = AppDataSource.getRepository(UserFollow);
    for (const user of users_db) {
      const randomUsers = users_db.filter(u => u.id !== user.id).slice(0, Math.floor(Math.random() * 3) + 1);
      for (const followedUser of randomUsers) {
        const userFollow = userFollowRepo.create({
          follower: user,
          following: followedUser,
        });
        await userFollowRepo.save(userFollow);
        console.log(`User ${user.username} followed user ${followedUser.username}.`);
      }
    }

    // Create announcements and notification 
    const announcementRepo = AppDataSource.getRepository(Announcement);
    const notificationRepo = AppDataSource.getRepository(Notification);

    // Project
    const projectUpdates = [
      "Completed initial project planning phase.",
      "Development team started coding the core features.",
      "UI/UX design prototypes are finalized.",
      "Completed first round of user testing.",
      "Database schema has been designed.",
      "Integration with third-party APIs has begun.",
      "Performance optimizations are in progress.",
      "Bug fixes from beta testing are being addressed.",
      "Finalizing documentation for the project.",
      "Preparing for the project launch next week."
    ];
    for (const project of project_db) {
      const announcement = announcementRepo.create({
        title: `Project Announcement - ${project.name}`,
        content: `${project.name} - ${projectUpdates[Math.floor(Math.random() * projectUpdates.length)]}`,
        project: project,
        user: null,
      });
      await announcementRepo.save(announcement);
      console.log(`Announcement created for project ${project.name}.`);

      const projectFollowers = await projectFollowRepo.find({ where: { pointedProject: project.id }, relations: ["follower", "pointedProject"]});
      for (const projectFollow of projectFollowers) {
        console.log(projectFollow)

        const notification = notificationRepo.create({
          type: 'PROJECT_UPDATE',
          content: `Project Announcement - ${project.name}`,
          user: projectFollow.follower,
          relatedProject: project,
          announcement: announcement,
        });
        await notificationRepo.save(notification);
        console.log(`Project Notification created for user ${projectFollow.follower.username}.`);
      }
    }


    // User
    const userActions = [
      // Activity
      "User shared a product on social media.",
      "User updated their profile picture.",

      // Project Updates
      "User completed the initial project planning phase.",
      "User started coding the core features.",
      "User finalized the UI/UX design prototypes.",
      "User completed the first round of user testing.",
      "User designed the database schema.",
      "User began integration with third-party APIs.",
      "User is working on performance optimizations.",
      "User is addressing bug fixes from beta testing.",
      "User is finalizing the project documentation.",

      // Help Requests
      "User requested help with password reset.",
      "User needs assistance with account setup.",
      "User reported a bug in the system.",
      "User asked for a feature tutorial.",
      "User inquired about subscription plans.",
      "User needs help with payment issues.",
      "User asked for product recommendations.",
      "User reported a slow loading issue.",
      "User requested help with profile update.",
      "User needs assistance with data import.",

      // Code Updates
      "User refactored the authentication module.",
      "User added a new API endpoint for user data.",
      "User fixed a bug in the payment gateway integration.",
      "User optimized database queries for faster response.",
      "User implemented a new caching mechanism.",
      "User updated dependencies to the latest versions.",
      "User improved error handling in the application.",
      "User added unit tests for the new features.",
      "User deployed the latest version to production.",
      "User completed a code review and it was approved.",

      // Achievements
      "User completed a project milestone ahead of schedule.",
      "User's codebase reached 90% test coverage.",
      "User received a badge for community contribution.",
      "User's project team received positive feedback from the client.",
      "User's app reached 1 million downloads.",
      "User's code successfully passed a security audit.",
      "User completed a challenging task."
    ];
    const randomUsers = users_db.slice(0, Math.floor(Math.random() * users_db.length) + 1);
    for (const user of randomUsers) {
      const announcement = announcementRepo.create({
        title: `User Announcement - ${user.username}`,
        content: `${user.username} - ${userActions[Math.floor(Math.random() * userActions.length)]}`,
        project: null,
        user: user,
      });
      await announcementRepo.save(announcement);
      console.log(`Announcement created for user ${user.username}.`);

      const userFollowers = await userFollowRepo.find({ where: { following: user.id }, relations: ["follower", "following"]});
      for (const userFollow of userFollowers) {
        const notification = notificationRepo.create({
          type: 'USER_UPDATE',
          content: `User Announcement - ${user.username}`,
          user: userFollow.follower,
          relatedUser: user,
          announcement: announcement,
        });
        await notificationRepo.save(notification);
        console.log(`User Notification created for user ${userFollow.follower.username}.`);
      }
    }

    console.log('Demo data loaded successfully!');
  } catch (error) {
    console.error('Error loading demo data:', error);
  } finally {
    await AppDataSource.destroy();
  }
};

loadDemoData().catch(error => console.log('Error loading demo data:', error));
