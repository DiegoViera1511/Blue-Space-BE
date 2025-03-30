import {Router} from "express";
import {ICardModel} from "../../interfaces/ICardModel";
import {CardController} from "./controller";
import {IStateModel} from "../../interfaces/IStateModel";
import {IUserModel} from "../../interfaces/IUserModel";

export const cardRouter = (cardModel: ICardModel, stateModel: IStateModel, userModel: IUserModel) => {
    const router = Router();

    const cardController = new CardController(cardModel, stateModel, userModel);
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