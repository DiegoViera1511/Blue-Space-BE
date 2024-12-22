import {pgTable, varchar} from 'drizzle-orm/pg-core';
import {uuid} from "drizzle-orm/pg-core/columns/uuid";
import {user} from "../User/schemas";

//TODO fix name of username column to username instead of project_id

export const project = pgTable('project', {
    id: uuid('id').primaryKey().defaultRandom(),
    username: varchar('project_id').references(() => user.username, { onDelete: 'cascade' }).notNull(),
    name: varchar('name', { length: 255 }).notNull(),
});

export type Project = typeof project.$inferSelect;
export type NewProject = typeof project.$inferInsert;