import {Router} from "express";
import {Models} from "./types";
import {userRouter} from "./features/User/router";

export const appRouter = (appModels : Models) => {
    const router = Router();
    router.use('/user' , userRouter(appModels.userModel));
    return router;
};