import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.disable("x-powered-by");
app.use(express.json());
app.use(cors());

//const userModel = new UserModel();

// Routes
//app.use('/api', appRouter(userModel));

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});