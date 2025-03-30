import {SQL} from "drizzle-orm";
import {IUserModel} from "./interfaces/IUserModel";
import {ICardModel} from "./interfaces/ICardModel";
import {IProjectModel} from "./interfaces/IProjectModel";
import {IStateModel} from "./interfaces/IStateModel";
import {INotificationModel} from "./interfaces/INotificationModel";
import {IUsersToProjectsModel} from "./interfaces/IUsersToProjects";

export type Models = {
    userModel: IUserModel,
    cardModel: ICardModel,
    projectModel: IProjectModel,
    stateModel: IStateModel,
    notificationModel: INotificationModel,
    usersToProjectsModel: IUsersToProjectsModel
};

export type QueryBuilder<TQuery> = (keys: TQuery) => SQL[]

export type APIResponseType = {
    data?: any | null;
    message: string;
    errors?: string | null;
}
