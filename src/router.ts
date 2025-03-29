import {Router} from "express";
import {Models} from "./types";
import {userRouter} from "./features/User/router";
import {cardRouter} from "./features/Card/router";
import {projectRouter} from "./features/Project/router";
import {stateRouter} from "./features/State/router";
import {notificationRouter} from "./features/Notification/router";
import {usersToProjectsRouter} from "./relations/usersToProjects/router";
import {Server} from "socket.io";

export const appRouter = (appModels: Models, socketIO: Server) => {
    const router = Router();
    router.use('/user', userRouter(appModels.userModel));
    router.use('/card', cardRouter(appModels.cardModel));
    router.use('/project', projectRouter(appModels.projectModel, appModels.usersToProjectsModel));
    router.use('/state', stateRouter(appModels.stateModel));
    router.use('/notification', notificationRouter(appModels.notificationModel, appModels.userModel, socketIO));
    router.use('/usersToProjects', usersToProjectsRouter(appModels.usersToProjectsModel));
    return router;
};