import {Router} from "express";
import {ProjectController} from "./controller";
import {IProjectModel} from "../../Interfaces/IProjectModel";
import {IUsersToProjectsModel} from "../../Interfaces/IUsersToProjects";

export const projectRouter = (projectModel: IProjectModel, usersToProjectsModel: IUsersToProjectsModel) => {
    const router = Router();

    const projectController = new ProjectController(projectModel, usersToProjectsModel);

    router.route('/').post(projectController.create).get(projectController.getAll);
    router
        .route('/:id')
        .get(projectController.getById)
        .put(projectController.update)
        .delete(projectController.delete);
    return router;
};