import {IUserModel} from "../../Interfaces/IUserModel";
import {Router} from "express";
import {UserController} from "./controller";

export const userRouter = (userModel: IUserModel) => {
    const router = Router();

    const userController = new UserController(userModel);

    router.route('/').post(userController.create).get(userController.getAll);
    router
        .route('/:username')
        .get(userController.getById)
        .put(userController.update)
        .delete(userController.delete);
    return router;
};