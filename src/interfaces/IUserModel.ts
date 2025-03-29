import {CRUD} from "../general/crud";
import {UserQuery} from "../features/User/utils";
import { User } from "../features/User/schemas";

export interface IUserModel extends CRUD<UserQuery> {

    getUserByToken (token: string) : Promise<User | undefined>;

}