import {UsersToProjectsDto, UsersToProjectsQuery} from "../relations/UsersToProjects/utils";
import {CRUD} from "../types";

export interface IUsersToProjectsModel extends CRUD<UsersToProjectsQuery> {
    getAllDto(query: UsersToProjectsQuery): Promise<UsersToProjectsDto[]>;
}