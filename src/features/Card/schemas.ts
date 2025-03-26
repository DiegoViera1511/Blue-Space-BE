import {integer, pgTable, varchar} from 'drizzle-orm/pg-core';
import {uuid} from "drizzle-orm/pg-core/columns/uuid";
import {state} from "../State/schemas";
import {user} from "../User/schemas";

export const card = pgTable('card', {
    id: uuid('id').primaryKey().defaultRandom(),
    position: integer('position').notNull(),
    state_id: uuid('state_id').references(() => state.id, { onDelete: 'cascade', onUpdate: 'cascade' }).notNull(),
    title: varchar('title', { length: 255 }).notNull(),
    text: varchar('text', { length: 255 }).notNull(),
    user_card: varchar('user_card').references(() => user.username, {onDelete: 'set null', onUpdate: 'cascade'}),
});

export type Card = typeof card.$inferSelect;
export type NewCard = typeof card.$inferInsert;