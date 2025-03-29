import {UsersToProjectsDto, UsersToProjectsQuery} from "../relations/usersToProjects/utils";
import {CRUD} from "../general/crud";

export interface IUsersToProjectsModel extends CRUD<UsersToProjectsQuery> {
    getAllDto(query: UsersToProjectsQuery): Promise<UsersToProjectsDto[]>;
}