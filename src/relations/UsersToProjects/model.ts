import {CRUD} from "../../types";
import {UsersToProjectsDto, UsersToProjectsQuery, UsersToProjectsQueryBuilder, userToProjectsSelection} from "./utils";
import {IUsersToProjectsModel} from "../../Interfaces/IUsersToProjects";
import {usersToProjects} from "./schemas";
import {db} from "../../db/db_connect";
import {project} from "../../features/Project/schemas";
import {and, eq} from "drizzle-orm";


export class UsersToProjectsModel extends CRUD<UsersToProjectsQuery> implements IUsersToProjectsModel {
    constructor() {
        super(usersToProjects, UsersToProjectsQueryBuilder);
    }

    getAllDto = async (query: UsersToProjectsQuery): Promise<UsersToProjectsDto[]> => {
        const filter = UsersToProjectsQueryBuilder(query);
        return db
            .select(userToProjectsSelection)
            .from(usersToProjects)
            .innerJoin(project, eq(usersToProjects.project_id, project.id))
            .where(and(...filter));
    }
}