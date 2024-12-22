import {Router} from "express";
import {ProjectController} from "./controller";
import {IProjectModel} from "../../Interfaces/IProjectModel";

export const projectRouter = (projectModel: IProjectModel) => {
    const router = Router();

    const projectController = new ProjectController(projectModel);

    router.route('/').post(projectController.create).get(projectController.getAll);
    router
        .route('/:id')
        .get(projectController.getById)
        .put(projectController.update)
        .delete(projectController.delete);
    return router;
};