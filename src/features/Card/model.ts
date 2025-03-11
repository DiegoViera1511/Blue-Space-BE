import {CRUD} from "../../types";
import {CardQuery, CardQueryBuilder} from "./utils";
import {ICardModel} from "../../Interfaces/ICardModel";
import {card} from "./schemas";
import {db} from "../../db/db_connect";
import {gte} from "drizzle-orm/sql/expressions/conditions";
import {and, eq, sql} from "drizzle-orm";

export class CardModel extends CRUD<CardQuery> implements ICardModel {
    constructor() {
        super(card , CardQueryBuilder);
    }
    
     updateCardsPositionGte = async (start: number , value: number , state_id: string): Promise<void> => {
        await db
            .update(card)
            .set({position: sql`${card.position} + ${value}`})
            .where(and(gte(card.position, start) , eq(card.state_id,state_id)))
    }
    
}