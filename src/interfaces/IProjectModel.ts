import {CRUD} from "../general/crud";
import {ProjectQuery} from "../features/Project/utils";

export interface IProjectModel extends CRUD<ProjectQuery> {}