import {CRUD} from "../../general/crud";
import {NotificationQuery, NotificationQueryBuilder} from "./utils";
import {INotificationModel} from "../../interfaces/INotificationModel";
import {notification} from "./schemas";
import {db} from "../../db/db_connect";
import {and} from "drizzle-orm";


export class NotificationModel extends CRUD<NotificationQuery> implements INotificationModel {
    constructor() {
        super(notification, NotificationQueryBuilder);
    }

    async clearAll(query: NotificationQuery): Promise<void> {
        const filter = NotificationQueryBuilder(query);
        await db.delete(notification).where(and(...filter));
    }
}