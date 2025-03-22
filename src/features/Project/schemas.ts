import {pgTable, varchar} from 'drizzle-orm/pg-core';
import {uuid} from "drizzle-orm/pg-core/columns/uuid";
import {user} from "../User/schemas";
import {pgEnum} from "drizzle-orm/pg-core/columns/enum";
import {projectsColors} from "../../enums";

export const colors = pgEnum('colors',projectsColors)

export const project = pgTable('project', {
    id: uuid('id').primaryKey().defaultRandom(),
    username: varchar('username').references(() => user.username, { onDelete: 'cascade', onUpdate: 'cascade' }).notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    color: colors('color').default(projectsColors[0]).notNull()
});

export type Project = typeof project.$inferSelect;
export type NewProject = typeof project.$inferInsert;