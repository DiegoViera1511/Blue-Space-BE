import {pgTable, varchar} from 'drizzle-orm/pg-core';

export const user = pgTable('user', {
    username: varchar('username', { length: 255 }).primaryKey().notNull(),
    password: varchar('password', { length: 255 }).notNull(),
});

export type User = typeof user.$inferSelect;
export type NewUser = typeof user.$inferInsert;