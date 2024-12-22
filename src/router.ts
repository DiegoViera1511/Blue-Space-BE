import {Router} from "express";
import {Models} from "./types";
import {userRouter} from "./features/User/router";
import {cardRouter} from "./features/Card/router";

export const appRouter = (appModels : Models) => {
    const router = Router();
    router.use('/user' , userRouter(appModels.userModel));
    router.use('/card' , cardRouter(appModels.cardModel));
    return router;
};