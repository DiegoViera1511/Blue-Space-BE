import {pgTable, varchar} from 'drizzle-orm/pg-core';
import {uuid} from "drizzle-orm/pg-core/columns/uuid";
import {user} from "../User/schemas";

export const project = pgTable('project', {
    id: uuid('id').primaryKey().defaultRandom(),
    username: varchar('username').references(() => user.username, { onDelete: 'cascade' }).notNull(),
    name: varchar('name', { length: 255 }).notNull(),
});

export type Project = typeof project.$inferSelect;
export type NewProject = typeof project.$inferInsert;