import z from "zod";
import {eq, SQL} from "drizzle-orm";
import {project} from "./schemas";

export type ProjectQuery = {
    id?: string;
    username?: string;
    name?: string;
    color?: string;
};

export type ProjectDto = {
    id: string;
    username: string;
    name: string;
    color: string;
};

export const projectSchema = z.object({
    username: z.string(),
    name: z.string(),
    color: z.string(),
});

export function ProjectQueryBuilder(query: ProjectQuery): SQL[] {
    const filters: SQL[] = [];
    if (query.id) filters.push(eq(project.id, query.id));
    if (query.username) filters.push(eq(project.username, query.username));
    if (query.name) filters.push(eq(project.name, query.name));
    if (query.color) filters.push(eq(project.color, query.color));
    return filters;
}