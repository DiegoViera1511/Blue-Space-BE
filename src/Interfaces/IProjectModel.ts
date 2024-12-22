import {CRUD} from "../types";
import {ProjectQuery} from "../features/Project/utils";

export interface IProjectModel extends CRUD<ProjectQuery> {}