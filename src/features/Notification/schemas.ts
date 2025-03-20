import {pgTable, serial, timestamp, varchar} from "drizzle-orm/pg-core";
import {user} from "../User/schemas";
import {pgEnum} from "drizzle-orm/pg-core/columns/enum";
import {NotificationState, NotificationType} from "../../enums";

export const notificationTypes = pgEnum('notificationType', NotificationType)
export const notificationStates = pgEnum('notificationState', NotificationState)

export const notification = pgTable('notification', {
    id: serial('id').primaryKey().notNull(),
    sender_id: varchar('sender_id').references(() => user.username, {onDelete: 'cascade', onUpdate: 'cascade'}),
    receiver_id: varchar('receiver_id').references(() => user.username, {
        onDelete: 'cascade',
        onUpdate: 'cascade'
    }).notNull(),
    date: timestamp('date').defaultNow().notNull(),
    content: varchar('content', {length: 255}).notNull(),
    invitation_project_id: varchar('invitation_project_id'),
    type: notificationTypes('type').notNull(),
    state: notificationStates('state').default(NotificationState[0]).notNull(),
})

export type Notification = typeof notification.$inferSelect;
export type NewNotification = typeof notification.$inferInsert;