import z from "zod";
import {eq, SQL} from "drizzle-orm";
import {project} from "./schemas";

export type ProjectQuery = {
    id?: string;
    username?:string;
    name?:string;
};

export const projectSchema = z.object({
    id: z.string(),
    username: z.string(),
    name: z.string()
});

export function ProjectQueryBuilder(query: ProjectQuery): SQL[] {
    const filters: SQL[] = [];
    if (query.id) filters.push(eq(project.id, query.id));
    if (query.username) filters.push(eq(project.username, query.username));
    if (query.name) filters.push(eq(project.name, query.name));
    return filters;
}