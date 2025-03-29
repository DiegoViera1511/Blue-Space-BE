import {Router} from "express";
import {INotificationModel} from "../../interfaces/INotificationModel";
import {NotificationController} from "./controller";
import {Server} from "socket.io";
import {IUserModel} from "../../interfaces/IUserModel";

export const notificationRouter = (notificationModel: INotificationModel, userModel: IUserModel, socketIO: Server) => {
    const router = Router();

    const notificationController = new NotificationController(notificationModel, userModel, socketIO);
    router.route('/clearAll/:receiver_id').delete(notificationController.clearAll);
    router.route('/').post(notificationController.create).get(notificationController.getAll);
    router
        .route('/:id')
        .get(notificationController.getById)
        .put(notificationController.update)
        .delete(notificationController.delete);
    return router;
};