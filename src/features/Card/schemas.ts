import {pgTable, varchar} from 'drizzle-orm/pg-core';
import {uuid} from "drizzle-orm/pg-core/columns/uuid";
import {state} from "../State/schemas";

export const card = pgTable('card', {
    id: uuid('id').primaryKey().defaultRandom(),
    state_id: uuid('state_id').references(() => state.id, { onDelete: 'cascade' }).notNull(),
    title: varchar('title', { length: 255 }).notNull(),
    text: varchar('text', { length: 255 }).notNull(),
});

export type Card = typeof card.$inferSelect;
export type NewCard = typeof card.$inferInsert;