import {PgTable} from "drizzle-orm/pg-core";
import {db} from "./db/db_connect";
import {and, SQL} from "drizzle-orm";
import {IUserModel} from "./Interfaces/IUserModel";
import {ICardModel} from "./Interfaces/ICardModel";
import {IProjectModel} from "./Interfaces/IProjectModel";
import {IStateModel} from "./Interfaces/IStateModel";

export type Models = {
    userModel : IUserModel
    cardModel : ICardModel
    projectModel : IProjectModel
    stateModel: IStateModel
};

type QueryBuilder<TQuery> = (keys: TQuery) => SQL[]

export class CRUD <TQuery>{
    private table : PgTable
    private QueryBuilder : QueryBuilder<TQuery>
    constructor(table : PgTable , QueryBuilder : QueryBuilder<TQuery>){ 
        this.table = table
        this.QueryBuilder = QueryBuilder
    }
    
    async create(newObject : typeof this.table.$inferInsert): Promise<typeof this.table.$inferSelect> {
        const created = await db.insert(this.table).values(newObject).returning();
        return created[0];
    }

    async delete(keys: TQuery): Promise<void> {
        const filter = this.QueryBuilder(keys);
        await db.delete(this.table).where(and(...filter));
    }

    async getAll(): Promise<typeof this.table.$inferSelect[]> {
        return db.select().from(this.table);
    }

    async getById(keys: TQuery): Promise<typeof this.table.$inferSelect> {
        const filter = this.QueryBuilder(keys);
        const result = await db
            .select()
            .from(this.table)
            .where(and(...filter))
            .limit(1);
        return result[0];
    }

    async update(keys: TQuery, Data: Partial<typeof this.table.$inferSelect>): Promise<typeof this.table.$inferSelect> {
        const filter = this.QueryBuilder(keys);
        const updated = await db
            .update(this.table)
            .set(Data)
            .where(and(...filter))
            .returning();
        return updated[0];
    }
}