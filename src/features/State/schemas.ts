import {pgTable, varchar} from 'drizzle-orm/pg-core';
import {uuid} from "drizzle-orm/pg-core/columns/uuid";
import {project} from "../Project/schemas";

export const state = pgTable('state', {
    id: uuid('id').primaryKey().defaultRandom(),
    project_id: uuid('project_id').references(() => project.id, { onDelete: 'cascade' }).notNull(),
    name: varchar('name', { length: 255 }).notNull(),
});

export type State = typeof state.$inferSelect;
export type NewState = typeof state.$inferInsert;