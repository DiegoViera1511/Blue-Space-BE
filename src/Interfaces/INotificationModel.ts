import {CRUD} from "../types";
import {NotificationQuery} from "../features/Notification/utils";

export interface INotificationModel extends CRUD<NotificationQuery> {
    clearAll(query: NotificationQuery): Promise<void>;
}