import {INotificationModel} from "../../interfaces/INotificationModel";
import {Request, Response} from 'express';
import {APIMessage, ErrorMessage, SocketEvent, StatusCode, StatusMessage, validate, validatePartial} from "../../utils";
import {NotificationQuery, notificationSchema} from "./utils";
import {NewNotification, Notification, notification} from "./schemas";
import {Server} from "socket.io";
import {IUserModel} from "../../interfaces/IUserModel";

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
            const {data, success, error} = validate(req.body, notificationSchema);
            if (!success) {
                res.status(StatusCode.BAD_REQUEST).json(APIMessage(error.message));
                return;
            }
            const notificationData: NewNotification = {...data};
            const newNotification = await this.notificationModel.create(notificationData);
            const user = await this.userModel.getById({username: data.receiver_id});
            if (user?.webSocketToken) {
                const socket = this.socketIO.sockets.sockets.get(user.webSocketToken as string);
                if (socket) {
                    this.socketIO.to(user.webSocketToken as string).emit(SocketEvent.NOTIFICATION);
                }
            }
            res.status(StatusCode.CREATED).json(newNotification);
        } catch (e) {
            res.status(StatusCode.SERVER_ERROR).json(ErrorMessage(e));
        }
    }

    getAll = async (req: Request, res: Response) => {
        try {
            const {data, success, error} = validatePartial(req.query, notificationSchema);
            if (!success) {
                res.status(StatusCode.BAD_REQUEST).json(APIMessage(error.message));
                return;
            }
            const notificationQuery: NotificationQuery = {...data}
            const allNotifications = await this.notificationModel.getAll(notificationQuery, notification.date, false);
            res.status(StatusCode.OK).json(allNotifications);
        } catch (e) {
            res.status(StatusCode.SERVER_ERROR).json(ErrorMessage(e));
        }
    }

    getById = async (req: Request, res: Response) => {
        try {
            const id = parseInt(req.params.id);
            const notificationQuery: NotificationQuery = {id: id};
            const notificationFound = await this.notificationModel.getById(notificationQuery);
            if (!notificationFound) {
                res.status(StatusCode.NOT_FOUND).json(APIMessage(StatusMessage.NOT_FOUND));
                return;
            }
            res.status(StatusCode.OK).json(notificationFound);
        } catch (e) {
            res.status(StatusCode.SERVER_ERROR).json(ErrorMessage(e));
        }
    }

    update = async (req: Request, res: Response) => {
        try {
            const id = parseInt(req.params.id);
            const {data, success, error} = validatePartial(req.body, notificationSchema);
            const notificationQuery: NotificationQuery = {id: id};
            if (!success) {
                res.status(StatusCode.BAD_REQUEST).json(APIMessage(error.message));
                return;
            }
            const notificationData: Partial<Notification> = {...data};
            const notificationFound = await this.notificationModel.getById(notificationQuery);
            if (!notificationFound) {
                res.status(StatusCode.NOT_FOUND).json(APIMessage(StatusMessage.NOT_FOUND));
                return;
            }
            const updatedNotification = await this.notificationModel.update(notificationQuery, notificationData);
            res.status(StatusCode.OK).json(updatedNotification);
        } catch (e) {
            res.status(StatusCode.SERVER_ERROR).json(ErrorMessage(e));
        }
    }

    delete = async (req: Request, res: Response) => {
        try {
            const id = parseInt(req.params.id);
            const notificationQuery: NotificationQuery = {id: id};
            const notificationFound = await this.notificationModel.getById(notificationQuery);
            if (!notificationFound) {
                res.status(StatusCode.NOT_FOUND).json(APIMessage(StatusMessage.NOT_FOUND));
                return;
            }
            await this.notificationModel.delete(notificationQuery);
            res.status(StatusCode.OK).json(APIMessage(StatusMessage.DELETED));
        } catch (e) {
            res.status(StatusCode.SERVER_ERROR).json(ErrorMessage(e));
        }
    }

    clearAll = async (req: Request, res: Response) => {
        try {
            const receiverId = req.params.receiver_id;
            const notificationQuery: NotificationQuery = {receiver_id: receiverId};
            await this.notificationModel.clearAll(notificationQuery);
            res.status(StatusCode.OK).json(APIMessage(StatusMessage.DELETED));
        } catch (e) {
            res.status(StatusCode.SERVER_ERROR).json(ErrorMessage(e));
        }
    }

}