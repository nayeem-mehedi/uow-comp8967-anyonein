import express from "express";
import bodyParser from "body-parser";
import { AppDataSource } from "./src/config/db.js";
import loginRoutes from "./src/routes/loginRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
import profileRoutes from "./src/routes/profileRoutes.js";
import skillRoutes from "./src/routes/skillRoutes.js";
import profileSkillRoutes from "./src/routes/profileSkillRoutes.js";
import searchRoutes from "./src/routes/searchRoutes.js"
import dotenv from "dotenv";
import cors from "cors";

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

AppDataSource.initialize()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error) => console.log(error));
