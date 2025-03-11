import {CardQuery} from "../features/Card/utils";
import {CRUD} from "../types";
export interface ICardModel extends CRUD<CardQuery> {
    updateCardsPositionGte(start: number, value: number, state_id: string): Promise<void>;
}