import {
    APIResponse,
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
import {IStateModel} from "../../interfaces/IStateModel";
import {IUserModel} from "../../interfaces/IUserModel";

export class CardController {
    cardModel: ICardModel;
    stateModel: IStateModel;
    userModel: IUserModel;

    constructor(cardModel: ICardModel, stateModel: IStateModel, userModel: IUserModel) {
        this.cardModel = cardModel;
        this.stateModel = stateModel;
        this.userModel = userModel;
    }

    create = async (req: Request, res: Response) => {
        try {
            const {data, success, error} = validate(req.body, cardSchema);
            if (!success) {
                res.status(StatusCode.BAD_REQUEST).json(
                    APIResponse(StatusMessage.BAD_REQUEST, error?.message)
                );
                return;
            }
            const stateFound = await this.stateModel.getById({id: data.state_id});
            if (!stateFound) {
                res.status(StatusCode.NOT_FOUND).json(
                    APIResponse(StatusMessage.NOT_FOUND, `State with id ${data.state_id} not found`)
                );
                return
            }
            if (data.user_card) {
                const userFound = await this.userModel.getById({username: data.user_card})
                if (!userFound) {
                    res.status(StatusCode.NOT_FOUND).json(
                        APIResponse(StatusMessage.NOT_FOUND, `User with id ${data.state_id} not found`)
                    );
                    return
                }
            }
            const cardData: NewCard = {...data};
            const newCard = await this.cardModel.create(cardData);
            res.status(StatusCode.CREATED).json(
                APIResponse(StatusMessage.CREATED, null, newCard)
            );
        } catch (e) {
            res.status(StatusCode.SERVER_ERROR).json(
                APIResponse(StatusMessage.SERVER_ERROR, ErrorMessage(e))
            );
        }
    };

    getAll = async (req: Request, res: Response) => {
        try {
            const {data, success, error} = validatePartial(req.query, cardSchema);
            if (!success) {
                res.status(StatusCode.BAD_REQUEST).json(
                    APIResponse(StatusMessage.BAD_REQUEST, error.message)
                );
                return;
            }
            if (data?.state_id) {
                const stateFound = await this.stateModel.getById({id: data.state_id});
                if (!stateFound) {
                    res.status(StatusCode.NOT_FOUND).json(
                        APIResponse(StatusMessage.NOT_FOUND, `State with id ${data.state_id} not found`)
                    );
                    return
                }
            }
            if (data?.user_card) {
                const userFound = await this.userModel.getById({username: data.user_card})
                if (!userFound) {
                    res.status(StatusCode.NOT_FOUND).json(
                        APIResponse(StatusMessage.NOT_FOUND, `User with id ${data.state_id} not found`)
                    );
                    return
                }
            }
            const cardQuery: CardQuery = {...data}
            const allCards = await this.cardModel.getAll(cardQuery, card.position, true);
            res.status(StatusCode.OK).json(
                APIResponse(StatusMessage.OK, null, allCards)
            );
        } catch (e) {
            res.status(StatusCode.SERVER_ERROR).json(
                APIResponse(StatusMessage.SERVER_ERROR, ErrorMessage(e))
            );
        }
    };

    getById = async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            const cardQuery: CardQuery = {id: id};
            const cardFound = await this.cardModel.getById(cardQuery);
            if (!cardFound) {
                res.status(StatusCode.NOT_FOUND).json(
                    APIResponse(StatusMessage.NOT_FOUND, `Card with id ${id} not found`)
                );
                return;
            }
            res.status(StatusCode.OK).json(
                APIResponse(StatusMessage.OK, null, cardFound)
            );
        } catch (e) {
            res.status(StatusCode.SERVER_ERROR).json(
                APIResponse(StatusMessage.SERVER_ERROR, ErrorMessage(e))
            );
        }
    };

    update = async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            const {data, success, error} = validatePartial(req.body, cardSchema);
            const cardQuery: CardQuery = {id: id};
            if (!success) {
                res.status(StatusCode.BAD_REQUEST).json(
                    APIResponse(StatusMessage.BAD_REQUEST, error.message)
                );
                return;
            }
            const cardFound = await this.cardModel.getById(cardQuery);
            if (!cardFound) {
                res.status(StatusCode.NOT_FOUND).json(
                    APIResponse(StatusMessage.NOT_FOUND, `Card with id ${id} not found`)
                );
                return;
            }
            if (data?.state_id) {
                const stateFound = await this.stateModel.getById({id: data.state_id});
                if (!stateFound) {
                    res.status(StatusCode.NOT_FOUND).json(
                        APIResponse(StatusMessage.NOT_FOUND, `State with id ${data.state_id} not found`)
                    );
                    return
                }
            }
            if (data?.user_card) {
                const userFound = await this.userModel.getById({username: data.user_card})
                if (!userFound) {
                    res.status(StatusCode.NOT_FOUND).json(
                        APIResponse(StatusMessage.NOT_FOUND, `User with id ${data.state_id} not found`)
                    );
                    return
                }
            }
            const cardData: Partial<Card> = {...data};
            const updatedCard = await this.cardModel.update(cardQuery, cardData);
            res.status(StatusCode.OK).json(
                APIResponse(StatusMessage.UPDATED, null, updatedCard)
            );
        } catch (e) {
            res.status(StatusCode.SERVER_ERROR).json(
                APIResponse(StatusMessage.SERVER_ERROR, ErrorMessage(e))
            );
        }
    };

    delete = async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            const cardQuery: CardQuery = {id: id};
            const cardFound = await this.cardModel.getById(cardQuery);
            if (!cardFound) {
                res.status(StatusCode.NOT_FOUND).json(
                    APIResponse(StatusMessage.NOT_FOUND, `Card with id ${id} not found`)
                );
                return;
            }
            await this.cardModel.delete(cardQuery);
            res.status(StatusCode.OK).json(
                APIResponse(StatusMessage.DELETED)
            );
        } catch (e) {
            res.status(StatusCode.SERVER_ERROR).json(
                APIResponse(StatusMessage.SERVER_ERROR, ErrorMessage(e))
            );
        }
    };

    updateCardsPositionGte = async (req: Request, res: Response) => {
        try {
            const {data, success, error} = validate(req.body, cardPositionUpdateGteSchema);
            if (!success) {
                res.status(StatusCode.BAD_REQUEST).json(
                    APIResponse(StatusMessage.BAD_REQUEST, error.message)
                );
                return;
            }
            await this.cardModel.updateCardsPositionGte(data.start, data.value, data.state_id);
            res.status(StatusCode.OK).json(
                APIResponse(StatusMessage.UPDATED)
            );
        } catch (e) {
            res.status(StatusCode.SERVER_ERROR).json(
                APIResponse(StatusMessage.SERVER_ERROR, ErrorMessage(e))
            );
        }
    }

    updateCardsPositionRange = async (req: Request, res: Response) => {
        try {
            const {data, success, error} = validate(req.body, cardPositionUpdateRangeSchema);
            if (!success) {
                res.status(StatusCode.BAD_REQUEST).json(
                    APIResponse(StatusMessage.BAD_REQUEST, error.message)
                );
                return;
            }
            await this.cardModel.updateCardsPositionRange(data.start, data.end, data.value, data.state_id);
            res.status(StatusCode.OK).json(
                APIResponse(StatusMessage.UPDATED)
            );
        } catch (e) {
            res.status(StatusCode.SERVER_ERROR).json(
                APIResponse(StatusMessage.SERVER_ERROR, ErrorMessage(e))
            );
        }
    }

    updateCardsPositions = async (req: Request, res: Response) => {
        try {
            const {data, success, error} = validate(req.body, updateCardsPositionsSchema);
            if (!success) {
                res.status(StatusCode.BAD_REQUEST).json(
                    APIResponse(StatusMessage.BAD_REQUEST, error.message)
                );
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
            res.status(StatusCode.OK).json(APIResponse(StatusMessage.UPDATED));
        } catch (e) {
            res.status(StatusCode.SERVER_ERROR).json(
                APIResponse(StatusMessage.SERVER_ERROR, ErrorMessage(e))
            );
        }
    }

    updateCardState = async (req: Request, res: Response) => {
        try {
            const {data, success, error} = validate(req.body, updateCardStateSchema);
            if (!success) {
                res.status(StatusCode.BAD_REQUEST).json(
                    APIResponse(StatusMessage.BAD_REQUEST, error.message)
                );
                return;
            }
            const cardQuery: CardQuery = {id: data.activeCardId};
            await this.cardModel.updateCardsPositionGte(data.activePosition + 1, -1, data.activeStateId);
            await this.cardModel.updateCardsPositionGte(data.overPosition, 1, data.overStateId);
            await this.cardModel.update(cardQuery, {
                state_id: data.overStateId,
                position: data.overPosition
            });
            res.status(StatusCode.OK).json(
                APIResponse(StatusMessage.UPDATED)
            );
        } catch (e) {
            res.status(StatusCode.SERVER_ERROR).json(
                APIResponse(StatusMessage.SERVER_ERROR, ErrorMessage(e))
            );
        }
    }

}