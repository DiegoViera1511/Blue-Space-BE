import {CRUD} from "../../types";
import {ProjectQuery, ProjectQueryBuilder} from "./utils";
import {IProjectModel} from "../../Interfaces/IProjectModel";
import {project} from "./schemas";

export class ProjectModel extends CRUD<ProjectQuery> implements IProjectModel {
    constructor() {
        super(project , ProjectQueryBuilder);
    }
}