import {INotificationModel} from "../../Interfaces/INotificationModel";
import {Request, Response} from 'express';
import {ErrorMessage, validate, validatePartial} from "../../utils";
import {NotificationQuery, notificationSchema} from "./utils";
import {NewNotification, Notification, notification} from "./schemas";
import {Server} from "socket.io";
import {IUserModel} from "../../Interfaces/IUserModel";

export class NotificationController {
    notificationModel: INotificationModel
    userModel: IUserModel
    socketIO: Server

    constructor(notificationModel: INotificationModel, userModel: IUserModel, socketIO: Server) {
        this.notificationModel = notificationModel;
        this.userModel = userModel;
        this.socketIO = socketIO;
    }

    create = async (req: Request, res: Response) => {
        try {
            const result = validate(req.body, notificationSchema);
            if (!result.success) {
                res.status(400).json({message: JSON.parse(result.error.message)});
                return;
            }
            const notificationData: NewNotification = {
                ...result.data
            };
            const newNotification = await this.notificationModel.create(notificationData);

            const user = await this.userModel.getById({username: result.data.receiver_id});

            if (user && user.webSocketToken) {
                this.socketIO.to(user.webSocketToken as string).emit('notification');
            }

            res.status(201).json(newNotification);
        } catch (e) {
            res.status(500).json(ErrorMessage(e));
        }
    }

    getAll = async (req: Request, res: Response) => {
        try {
            const result = validatePartial(req.query, notificationSchema);
            if (!result.success) {
                res.status(400).json({message: JSON.parse(result.error.message)});
                return;
            }
            const notificationQuery: NotificationQuery = {
                ...result.data
            }
            const allNotifications = await this.notificationModel.getAll(notificationQuery, notification.date, false);
            res.status(200).json(allNotifications);

        } catch (e) {
            res.status(500).json(ErrorMessage(e));
        }
    }

    getById = async (req: Request, res: Response) => {
        try {
            const id = parseInt(req.params.id);
            const notificationQuery: NotificationQuery = {id: id};
            const notificationFound = await this.notificationModel.getById(notificationQuery);
            if (!notificationFound) {
                res.status(404).json({message: 'Notification not found'});
                return;
            }
            res.status(200).json(notificationFound);
        } catch (e) {
            res.status(500).json(ErrorMessage(e));
        }
    }

    update = async (req: Request, res: Response) => {
        try {
            const id = parseInt(req.params.id);
            const result = validatePartial(req.body, notificationSchema);
            const notificationQuery: NotificationQuery = {id: id};
            if (!result.success) {
                res.status(400).json({message: JSON.parse(result.error.message)});
                return;
            }
            const notificationData: Partial<Notification> = {...result.data};
            const notificationFound = await this.notificationModel.getById(notificationQuery);
            if (!notificationFound) {
                res.status(404).json({message: 'Notification not found'});
                return;
            }
            const updatedNotification = await this.notificationModel.update(notificationQuery, notificationData);
            res.status(200).json(updatedNotification);
        } catch (e) {
            res.status(500).json(ErrorMessage(e));
        }
    }

    delete = async (req: Request, res: Response) => {
        try {
            const id = parseInt(req.params.id);
            const notificationQuery: NotificationQuery = {id: id};
            const notificationFound = await this.notificationModel.getById(notificationQuery);
            if (!notificationFound) {
                res.status(404).json({message: 'Notification not found'});
                return;
            }
            await this.notificationModel.delete(notificationQuery);
            res.status(200).json({message: 'Notification deleted successfully'});
        } catch (e) {
            res.status(500).json(ErrorMessage(e));
        }
    }

    clearAll = async (req: Request, res: Response) => {
        try {
            const receiverId = req.params.receiver_id;
            const notificationQuery: NotificationQuery = {receiver_id: receiverId};
            await this.notificationModel.clearAll(notificationQuery);
            res.status(200).json({message: 'All notifications deleted successfully'});
        } catch (e) {
            res.status(500).json(ErrorMessage(e));
        }
    }

}