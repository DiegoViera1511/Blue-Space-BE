import z from 'zod'
import {eq, SQL} from "drizzle-orm";
import {usersToProjects} from "./schemas";
import {ProjectDto} from "../../features/Project/utils";
import {project} from "../../features/Project/schemas";

export type UsersToProjectsQuery = {
    username?: string;
    project_id?: string;
}

export type UsersToProjectsDto = {
    username: string;
    project: ProjectDto
}

export const userToProjectsSelection = {
    username: usersToProjects.username,
    project: {
        id: usersToProjects.project_id,
        username: project.username,
        name: project.name
    }
}

export const usersToProjectsSchema = z.object({
    username: z.string(),
    project_id: z.string()
})

export function UsersToProjectsQueryBuilder(query: UsersToProjectsQuery): SQL[] {
    const filters: SQL[] = [];
    if (query.username) filters.push(eq(usersToProjects.username, query.username));
    if (query.project_id) filters.push(eq(usersToProjects.project_id, query.project_id));
    return filters;
}