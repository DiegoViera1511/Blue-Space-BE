import {ErrorMessage, validate, validateUpdate} from "../../utils";
import { Request, Response } from 'express';
import {ICardModel} from "../../Interfaces/ICardModel";
import {CardQuery, cardSchema} from "./utils";
import {Card, NewCard} from "./schemas";

export class CardController {
    cardModel: ICardModel;
    constructor(cardModel: ICardModel) {
        this.cardModel = cardModel;
    }
    create = async (req: Request, res: Response) => {
        try {
            const result = validate(req.body, cardSchema);
            if (!result.success) {
                res.status(400).json({ message: JSON.parse(result.error.message) });
                return;
            }
            const cardData: NewCard = {
                ...result.data
            };
            const newCard = await this.cardModel.create(cardData);
            res.status(201).json(newCard);
        } catch (e) {
            res.status(500).json(ErrorMessage(e));
        }
    };

    getAll = async (_req: Request, res: Response) => {
        try {
            const allCards = await this.cardModel.getAll();
            res.status(200).json(allCards);
        } catch (e) {
            res.status(500).json(ErrorMessage(e));
        }
    };

    getById = async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            const cardQuery : CardQuery = { id: id };

            const cardFound = await this.cardModel.getById(cardQuery);
            if (!cardFound) {
                res.status(404).json({ message: 'Card not found' });
                return;
            }
            res.status(200).json(cardFound);
        } catch (e) {
            res.status(500).json(ErrorMessage(e));
        }
    };
    update = async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            const result = validateUpdate(req.body, cardSchema);
            const cardQuery: CardQuery = { id: id };

            if (!result.success) {
                res.status(400).json({ message: JSON.parse(result.error.message) });
                return;
            }
            const cardData: Partial<Card> = { ...result.data };
            const cardFound = await this.cardModel.getById(cardQuery);
            if (!cardFound) {
                res.status(404).json({ message: 'Card not found' });
                return;
            }
            const updatedCard = await this.cardModel.update(cardQuery, cardData);
            res.status(200).json(updatedCard);
        } catch (e) {
            res.status(500).json(ErrorMessage(e));
        }
    };

    delete = async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            const cardQuery: CardQuery = { id: id };
            const cardFound = await this.cardModel.getById(cardQuery);
            if (!cardFound) {
                res.status(404).json({ message: 'Card not found' });
                return;
            }
            await this.cardModel.delete(cardQuery);
            res.status(200).json({ message: 'Card deleted successfully' });
        } catch (e) {
            res.status(500).json(ErrorMessage(e));
        }
    };
}