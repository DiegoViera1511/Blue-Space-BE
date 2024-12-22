import {CRUD} from "../types";
import {UserQuery} from "../features/User/utils";

export interface IUserModel extends CRUD<UserQuery>{}