import {
    APIMessage,
    ErrorMessage,
    StatusCode,
    StatusMessage,
    validate,
    validatePartial
} from "../../utils";
import {Request, Response} from 'express';
import {ICardModel} from "../../interfaces/ICardModel";
import {
    cardPositionUpdateGteSchema,
    cardPositionUpdateRangeSchema,
    CardQuery,
    cardSchema,
    updateCardsPositionsSchema,
    updateCardStateSchema
} from "./utils";
import {card, Card, NewCard} from "./schemas";

export class CardController {
    cardModel: ICardModel;

    constructor(cardModel: ICardModel) {
        this.cardModel = cardModel;
    }

    create = async (req: Request, res: Response) => {
        try {
            const {data, success, error} = validate(req.body, cardSchema);
            if (!success) {
                res.status(StatusCode.BAD_REQUEST).json(APIMessage(error.message));
                return;
            }
            const cardData: NewCard = {...data};
            const newCard = await this.cardModel.create(cardData);
            res.status(StatusCode.CREATED).json(newCard);
        } catch (e) {
            res.status(StatusCode.SERVER_ERROR).json(ErrorMessage(e));
        }
    };

    getAll = async (req: Request, res: Response) => {
        try {
            const {data, success, error} = validatePartial(req.query, cardSchema);
            if (!success) {
                res.status(StatusCode.BAD_REQUEST).json(APIMessage(error.message));
                return;
            }
            const cardQuery: CardQuery = {...data}
            const allCards = await this.cardModel.getAll(cardQuery, card.position, true);
            res.status(StatusCode.OK).json(allCards);
        } catch (e) {
            res.status(StatusCode.SERVER_ERROR).json(ErrorMessage(e));
        }
    };

    getById = async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            const cardQuery: CardQuery = {id: id};
            const cardFound = await this.cardModel.getById(cardQuery);
            if (!cardFound) {
                res.status(StatusCode.NOT_FOUND).json(APIMessage(StatusMessage.NOT_FOUND));
                return;
            }
            res.status(StatusCode.OK).json(cardFound);
        } catch (e) {
            res.status(StatusCode.SERVER_ERROR).json(ErrorMessage(e));
        }
    };

    update = async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            const {data, success, error} = validatePartial(req.body, cardSchema);
            const cardQuery: CardQuery = {id: id};
            if (!success) {
                res.status(StatusCode.BAD_REQUEST).json(APIMessage(error.message));
                return;
            }
            const cardData: Partial<Card> = {...data};
            const cardFound = await this.cardModel.getById(cardQuery);
            if (!cardFound) {
                res.status(StatusCode.NOT_FOUND).json(APIMessage(StatusMessage.NOT_FOUND));
                return;
            }
            const updatedCard = await this.cardModel.update(cardQuery, cardData);
            res.status(StatusCode.OK).json(updatedCard);
        } catch (e) {
            res.status(StatusCode.SERVER_ERROR).json(ErrorMessage(e));
        }
    };

    delete = async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            const cardQuery: CardQuery = {id: id};
            const cardFound = await this.cardModel.getById(cardQuery);
            if (!cardFound) {
                res.status(StatusCode.NOT_FOUND).json(APIMessage(StatusMessage.NOT_FOUND));
                return;
            }
            await this.cardModel.delete(cardQuery);
            res.status(StatusCode.OK).json(APIMessage(StatusMessage.DELETED));
        } catch (e) {
            res.status(StatusCode.SERVER_ERROR).json(ErrorMessage(e));
        }
    };

    updateCardsPositionGte = async (req: Request, res: Response) => {
        try {
            const {data, success, error} = validate(req.body, cardPositionUpdateGteSchema);
            if (!success) {
                res.status(StatusCode.BAD_REQUEST).json(APIMessage(error.message));
                return;
            }
            await this.cardModel.updateCardsPositionGte(data.start, data.value, data.state_id);
            res.status(StatusCode.OK).json(APIMessage(StatusMessage.UPDATED));
        } catch (e) {
            res.status(StatusCode.SERVER_ERROR).json(ErrorMessage(e));
        }
    }

    updateCardsPositionRange = async (req: Request, res: Response) => {
        try {
            const {data, success, error} = validate(req.body, cardPositionUpdateRangeSchema);
            if (!success) {
                res.status(StatusCode.BAD_REQUEST).json(APIMessage(error.message));
                return;
            }
            await this.cardModel.updateCardsPositionRange(data.start, data.end, data.value, data.state_id);
            res.status(StatusCode.OK).json(APIMessage(StatusMessage.UPDATED));
        } catch (e) {
            res.status(StatusCode.SERVER_ERROR).json(ErrorMessage(e));
        }
    }

    updateCardsPositions = async (req: Request, res: Response) => {
        try {
            const {data, success, error} = validate(req.body, updateCardsPositionsSchema);
            if (!success) {
                res.status(StatusCode.BAD_REQUEST).json(APIMessage(error.message));
                return;
            }
            const cardQuery: CardQuery = {id: data.activeCardId};
            if (data.activePosition > data.overPosition) {
                await this.cardModel.updateCardsPositionRange(data.overPosition, data.activePosition - 1, 1, data.state_id);
                await this.cardModel.update(cardQuery, {position: data.overPosition});
            } else if (data.activePosition < data.overPosition) {
                await this.cardModel.updateCardsPositionRange(data.activePosition + 1, data.overPosition, -1, data.state_id);
                await this.cardModel.update(cardQuery, {position: data.overPosition});
            }
            res.status(StatusCode.OK).json(APIMessage(StatusMessage.UPDATED));
        } catch (e) {
            res.status(StatusCode.SERVER_ERROR).json(ErrorMessage(e));
        }
    }
    updateCardState = async (req: Request, res: Response) => {
        try {
            const {data, success, error} = validate(req.body, updateCardStateSchema);
            if (!success) {
                res.status(StatusCode.BAD_REQUEST).json(APIMessage(error.message));
                return;
            }
            const cardQuery: CardQuery = {id: data.activeCardId};
            await this.cardModel.updateCardsPositionGte(data.activePosition + 1, -1, data.activeStateId);
            await this.cardModel.updateCardsPositionGte(data.overPosition, 1, data.overStateId);
            await this.cardModel.update(cardQuery, {
                state_id: data.overStateId,
                position: data.overPosition
            });
            res.status(StatusCode.OK).json(APIMessage(StatusMessage.UPDATED));
        } catch (e) {
            res.status(StatusCode.SERVER_ERROR).json(ErrorMessage(e));
        }
    }

}