import express from 'express';
import routes from './src/routes/routes';

const app = express();
const PORT = 4000;


routes(app);

app.get('/', (req, res) => 
    res.send(`Node and express server port : ${PORT}`)
);

app.listen(PORT, () =>
    console.log(`server running on ${PORT}`)
);