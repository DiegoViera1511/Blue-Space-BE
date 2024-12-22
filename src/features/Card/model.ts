import {CRUD} from "../../types";
import {CardQuery, CardQueryBuilder} from "./utils";
import {ICardModel} from "../../Interfaces/ICardModel";
import {card} from "./schemas";

export class CardModel extends CRUD<CardQuery> implements ICardModel {
    constructor() {
        super(card , CardQueryBuilder);
    }
}