import {Router} from "express";
import {ICardModel} from "../../interfaces/ICardModel";
import {CardController} from "./controller";

export const cardRouter = (cardModel: ICardModel) => {
    const router = Router();

    const cardController = new CardController(cardModel);
    router.route('/positionGte').put(cardController.updateCardsPositionGte);
    router.route('/positionRange').put(cardController.updateCardsPositionRange);
    router.route('/updateState').put(cardController.updateCardState);
    router.route('/sortPositions').put(cardController.updateCardsPositions);
    router.route('/').post(cardController.create).get(cardController.getAll);
    router
        .route('/:id')
        .get(cardController.getById)
        .put(cardController.update)
        .delete(cardController.delete);

    return router;
};