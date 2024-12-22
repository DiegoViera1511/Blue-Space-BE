import {CRUD} from "../../types";
import {UserQuery, UserQueryBuilder} from "./utils";
import {user} from "./schemas";
import {IUserModel} from "../../Interfaces/IUserModel";

export class UserModel extends CRUD<UserQuery> implements IUserModel {
    constructor() {
        super(user , UserQueryBuilder);
    }
}