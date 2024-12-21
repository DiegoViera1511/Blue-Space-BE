import express from 'express';
import { appRouter } from './router';
import dotenv from 'dotenv';
import cors from 'cors';
// TODO import {Models} from "./types";

dotenv.config();

export const createApp = () => {
    const app = express();
    app.use(express.json());
    app.use(cors());
    app.disable('x-powered-by');

    const port = process.env.PORT || 3000;

    app.use('/api', appRouter());

    app.listen(port, () => {
        console.log(`Server is running on port http://localhost:${port}`);
    });
};
