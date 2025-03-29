import {CRUD} from "../../general/crud";
import {ProjectQuery, ProjectQueryBuilder} from "./utils";
import {IProjectModel} from "../../interfaces/IProjectModel";
import {project} from "./schemas";

export class ProjectModel extends CRUD<ProjectQuery> implements IProjectModel {
    constructor() {
        super(project, ProjectQueryBuilder);
    }
}