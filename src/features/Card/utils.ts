import z from "zod";
import {eq, SQL} from "drizzle-orm";
import {card} from "./schemas";

export type CardQuery = {
    id?: string;
    position?: number;
    state_id?:string;
    title?:string;
    text?:string;
};

export const cardSchema = z.object({
    position: z.number(),
    state_id: z.string(),
    title: z.string(),
    text: z.string()
});

export const cardPositionUpdateGteSchema = z.object({
    start: z.number(),
    value: z.number(),
    state_id: z.string()
})

export const cardPositionUpdateRangeSchema = z.object({
    start: z.number(),
    end: z.number(),
    value: z.number(),
    state_id: z.string()
})

export function CardQueryBuilder(query: CardQuery): SQL[] {
    const filters: SQL[] = [];
    if (query.id) filters.push(eq(card.id, query.id));
    if (query.position) filters.push(eq(card.position, query.position));
    if (query.state_id) filters.push(eq(card.state_id, query.state_id));
    if (query.title) filters.push(eq(card.title, query.title));
    if (query.text) filters.push(eq(card.text,query.text));
    return filters;
}