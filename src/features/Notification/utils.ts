import z from "zod";
import {eq, SQL} from "drizzle-orm";
import {notification} from "./schemas";

export type NotificationQuery = {
    id?: number;
    sender_id?: string | null;
    receiver_id?: string;
    date?: Date;
    content?: string;
    invitation_project_id?: string | null;
    type?: string;
    state?: string;
};

export const notificationSchema = z.object({
    sender_id: z.string().nullable(),
    receiver_id: z.string(),
    content: z.string(),
    invitation_project_id: z.string().nullable(),
    type: z.string(),
    state: z.string()
})

export function NotificationQueryBuilder(query: NotificationQuery): SQL[] {
    const filters: SQL[] = [];
    if (query.id) filters.push(eq(notification.id, query.id));
    if (query.sender_id) filters.push(eq(notification.sender_id, query.sender_id));
    if (query.receiver_id) filters.push(eq(notification.receiver_id, query.receiver_id));
    if (query.date) filters.push(eq(notification.date, query.date));
    if (query.content) filters.push(eq(notification.content, query.content));
    if (query.invitation_project_id) filters.push(eq(notification.invitation_project_id, query.invitation_project_id));
    if (query.type) filters.push(eq(notification.type, query.type));
    if (query.state) filters.push(eq(notification.state, query.state));
    return filters;
}