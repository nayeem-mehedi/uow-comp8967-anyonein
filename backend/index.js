import express from 'express';
import bodyParser from 'body-parser';
import { AppDataSource } from './src/config/db.js';
import loginRoutes from './src/routes/loginRoutes.js';
import userRoutes from './src/routes/userRoutes.js';

import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 9001;

app.use(bodyParser.json());
app.use('/api/auth', loginRoutes)
app.use('/api/users', userRoutes);


AppDataSource.initialize()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error) => console.log(error));
