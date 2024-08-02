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
import fileRoutes from "./src/routes/FileRoutes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 9001;

// Example middleware to log requests
app.use((req, res, next) => {
    console.log(`Received request: ${req.method} ${req.url}`);
    next();
});

// check if user token expired or not
app.use((req, res, next) => {
    console.log(`Received token: ${req.headers.authorization}`);
    next();
});

app.use(bodyParser.json());
app.use(cors("*"));

app.use("/api/auth", loginRoutes);
app.use("/api/users", userRoutes);
app.use("/api/profiles", profileRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/profile-skills", profileSkillRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/topics", topicRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/follow", followRoutes);
app.use("/api/files", fileRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    if (res.headersSent) {
        // If headers are already sent, delegate to the default Express error handler
        return next(err);
    }
    console.error(err.stack); // Log the error stack trace for debugging
    res.status(500).json({ msg: 'Server error' });
});

AppDataSource.initialize()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error) => console.log(error));
