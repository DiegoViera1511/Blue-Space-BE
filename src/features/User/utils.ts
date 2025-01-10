import {eq, SQL} from "drizzle-orm";
import {user} from "./schemas";
import jwt from 'jsonwebtoken';
import z from 'zod';
import { config } from 'dotenv';

config();

const SECRET_KEY = process.env.SECRET_KEY || 'secret';

export type UserQuery = {
    username?: string;
    password?:string;
};

export const userSchema = z.object({
    username: z.string(),
    password: z.string(),
});

export function UserQueryBuilder(query: UserQuery): SQL[] {
    const filters: SQL[] = [];
    if (query.username) filters.push(eq(user.username, query.username));
    if (query.password) filters.push(eq(user.password, query.password));
    return filters;
}

export function createToken(name : string) {
    return jwt.sign({name: name}, SECRET_KEY, {expiresIn: '24h'});
}

export function isValidToken(token : string) {
    jwt.verify(token, SECRET_KEY, {complete: true});
}