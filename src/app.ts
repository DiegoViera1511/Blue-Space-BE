import express from 'express';
import http from 'http';
import {Server as SocketServer,} from "socket.io";
import {appRouter} from './router';
import dotenv from 'dotenv';
import cors from 'cors';
import {Models} from "./types";

dotenv.config();

export const createApp = (appModels: Models) => {
    const app = express();
    app.use(express.json());
    app.use(cors());
    app.disable('x-powered-by');
    const server = http.createServer(app);
    const io = new SocketServer(server, {
        cors: {
            origin: "http://localhost:5173"
        }
    })
    app.use('/api', appRouter(appModels, io));
    io.on('connection', (socket) => {
        console.log('client connected to: ' + socket.id);
        socket.on('register', (username) => {
            appModels.userModel.update({username: username}, {webSocketToken: socket.id})
        })
    })
    const port = process.env.PORT || 3000;
    server.listen(port, () => {
        console.log(`Server is running on port http://localhost:${port}`);
    });
};
