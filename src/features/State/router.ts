import {Router} from "express";
import {StateController} from "./controller";
import {IStateModel} from "../../Interfaces/IStateModel";

export const stateRouter = (stateModel: IStateModel) => {
    const router = Router();

    const stateController = new StateController(stateModel);

    router.route('/').post(stateController.create).get(stateController.getAll);
    router
        .route('/:id')
        .get(stateController.getById)
        .put(stateController.update)
        .delete(stateController.delete);
    return router;
};