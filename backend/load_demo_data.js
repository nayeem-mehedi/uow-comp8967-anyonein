import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import { User } from './src/models/User.js';
import { Profile } from './src/models/Profile.js';
import { Skill } from './src/models/Skill.js';
import { ProfileSkill } from './src/models/ProfileSkill.js';
import { Topic } from './src/models/Topic.js';
import { Project } from './src/models/Project.js';
import bcrypt from 'bcrypt';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'mariadb',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '3306', 10),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [User, Profile, Skill, ProfileSkill, Topic, Project],
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
      const userSkills = skills.slice(0, Math.floor(Math.random() * skills.length) + 1);
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
      project.users = randomUsers;

      await projectRepo.save(project);
      console.log(`Project ${project.name} has been created.`);
    }

    console.log('Demo data loaded successfully!');
  } catch (error) {
    console.error('Error loading demo data:', error);
  } finally {
    await AppDataSource.destroy();
  }
};

loadDemoData().catch(error => console.log('Error loading demo data:', error));
