import {Router} from "express";
import {IUsersToProjectsModel} from "../../interfaces/IUsersToProjects";
import {UsersToProjectsController} from "./controller";

export const usersToProjectsRouter = (usersToProjectsModel: IUsersToProjectsModel) => {
    const router = Router();

    const userToProjectsController = new UsersToProjectsController(usersToProjectsModel);
    router.route('/dto').get(userToProjectsController.getAllDto);
    router.route('/').post(userToProjectsController.create).get(userToProjectsController.getAll);
    router
        .route('/:username/:project_id')
        .get(userToProjectsController.getById)
        .put(userToProjectsController.update)
        .delete(userToProjectsController.delete);
    return router;
};