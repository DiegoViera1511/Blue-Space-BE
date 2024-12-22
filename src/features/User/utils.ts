import {eq, SQL} from "drizzle-orm";
import {user} from "./schemas";
import z from 'zod';
export type UserQuery = {
    username?: string;
    password?:string;
};

export const userSchema = z.object({
    username: z.string(),
    password: z.string()
});

export function UserQueryBuilder(query: UserQuery): SQL[] {
    const filters: SQL[] = [];
    if (query.username) filters.push(eq(user.username, query.username));
    if (query.password) filters.push(eq(user.password, query.password));
    return filters;
}