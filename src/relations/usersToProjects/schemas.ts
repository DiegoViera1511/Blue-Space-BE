import {pgTable, primaryKey, varchar} from "drizzle-orm/pg-core";
import {uuid} from "drizzle-orm/pg-core/columns/uuid";
import {user} from "../../features/User/schemas";
import {project} from "../../features/Project/schemas";

export const usersToProjects = pgTable('users_to_projects', {
        project_id: uuid('project_id').references(() => project.id, {onDelete: 'cascade', onUpdate: 'cascade'}).notNull(),
        username: varchar('username').references(() => user.username, {onDelete: 'cascade', onUpdate: 'cascade'}).notNull(),
    },
    (table) => {
        return {
            pk: primaryKey({
                columns: [table.project_id, table.username]
            })
        };
    }
)

export type UsersToProjects = typeof usersToProjects.$inferSelect;
export type NewUsersToProjects = typeof usersToProjects.$inferInsert;