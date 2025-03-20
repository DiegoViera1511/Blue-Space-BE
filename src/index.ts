import {createApp} from "./app";
import {UserModel} from "./features/User/model";
import {CardModel} from "./features/Card/model";
import {ProjectModel} from "./features/Project/model";
import {StateModel} from "./features/State/model";
import {NotificationModel} from "./features/Notification/model";
import {UsersToProjectsModel} from "./relations/UsersToProjects/model";

const appModels = {
    userModel: new UserModel(),
    cardModel: new CardModel(),
    projectModel: new ProjectModel(),
    stateModel: new StateModel(),
    notificationModel: new NotificationModel(),
    usersToProjectsModel: new UsersToProjectsModel()
}

createApp(appModels);