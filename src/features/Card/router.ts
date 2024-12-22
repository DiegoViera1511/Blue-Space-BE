import {Router} from "express";
import {ICardModel} from "../../Interfaces/ICardModel";
import {CardController} from "./controller";

export const cardRouter = (cardModel: ICardModel) => {
    const router = Router();

    const cardController = new CardController(cardModel);

    router.route('/').post(cardController.create).get(cardController.getAll);
    router
        .route('/:id')
        .get(cardController.getById)
        .put(cardController.update)
        .delete(cardController.delete);
    return router;
};