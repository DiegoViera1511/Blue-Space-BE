import {eq, SQL} from "drizzle-orm";
import {state,} from "./schemas";
import z from 'zod';

export type StateQuery = {
    id?: string;
    project_id?: string;
    name?: string;
};

export const stateSchema = z.object({
    id: z.string(),
    project_id: z.string(),
    name: z.string()
});

export function StateQueryBuilder(query: StateQuery): SQL[] {
    const filters: SQL[] = [];
    if (query.id) filters.push(eq(state.id, query.id));
    if (query.project_id) filters.push(eq(state.project_id, query.project_id));
    if (query.name) filters.push(eq(state.name,query.name));
    return filters;
}