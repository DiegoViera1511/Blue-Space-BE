import {Router} from "express";
import {Models} from "./types";
import {userRouter} from "./features/User/router";
import {cardRouter} from "./features/Card/router";
import {projectRouter} from "./features/Project/router";

export const appRouter = (appModels : Models) => {
    const router = Router();
    router.use('/user' , userRouter(appModels.userModel));
    router.use('/card' , cardRouter(appModels.cardModel));
    router.use('/project' , projectRouter(appModels.projectModel));
    return router;
};