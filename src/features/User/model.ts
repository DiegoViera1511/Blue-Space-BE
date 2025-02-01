import {CRUD} from "../../types";
import {UserQuery, UserQueryBuilder} from "./utils";
import {user, User} from "./schemas";
import {IUserModel} from "../../Interfaces/IUserModel";
import { db } from "../../db/db_connect";
import { eq } from "drizzle-orm" // Replace "some-module" with the actual module name

export class UserModel extends CRUD<UserQuery> implements IUserModel {
    constructor() {
        super(user, UserQueryBuilder);
    }

    async getUserByToken(token: string): Promise<User | undefined> {
        const result = await db.select().from(user).where(eq(user.token, token)).limit(1);
        if(!result.length) return undefined;
        return result[0];
    }
}