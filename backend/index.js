import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";

import { AppDataSource } from "./src/config/db.js";
import loginRoutes from "./src/routes/loginRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
import profileRoutes from "./src/routes/profileRoutes.js";
import skillRoutes from "./src/routes/skillRoutes.js";
import profileSkillRoutes from "./src/routes/profileSkillRoutes.js";
import searchRoutes from "./src/routes/searchRoutes.js"
import projectRoutes from "./src/routes/projectRoutes.js"
import topicRoutes from "./src/routes/topicRoutes.js"
import announcementRoutes from "./src/routes/announcementRoutes.js"
import notificationRoutes from "./src/routes/notificationRoutes.js"
import followRoutes from "./src/routes/followRoutes.js"

dotenv.config();

const app = express();
const port = process.env.PORT || 9001;

app.use(bodyParser.json());
app.use(cors("*"));

app.use("/api/auth", loginRoutes);
app.use("/api/users", userRoutes);
app.use("/api/profiles", profileRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/profile-skills", profileSkillRoutes);
app.use("/api/search", searchRoutes)
app.use("/api/projects", projectRoutes)
app.use("/api/topics", topicRoutes)
app.use("/api/announcements", announcementRoutes)
app.use("/api/notifications", notificationRoutes)
app.use("/api/follow", followRoutes)

AppDataSource.initialize()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error) => console.log(error));
