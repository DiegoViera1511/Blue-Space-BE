import bcrypt from 'bcrypt';
import {APIResponse, ErrorMessage, StatusCode, StatusMessage, validate, validatePartial} from "../../utils";
import {createToken, isValidToken, UserQuery, userSchema} from "./utils";
import {Request, Response} from 'express';
import {NewUser, user, User} from "./schemas";
import {IUserModel} from "../../interfaces/IUserModel";

export class UserController {
    userModel: IUserModel;

    constructor(userModel: IUserModel) {
        this.userModel = userModel;
    }

    create = async (req: Request, res: Response) => {
        try {
            const {data, success, error} = validate(req.body, userSchema);
            if (!success) {
                res.status(StatusCode.BAD_REQUEST).json(
                    APIResponse(StatusMessage.BAD_REQUEST, error?.message)
                );
                return;
            }
            const userData: NewUser = {...data};
            userData.password = await bcrypt.hash(userData.password, 10);
            const newUser = await this.userModel.create(userData);
            res.status(StatusCode.CREATED).json(
                APIResponse(StatusMessage.CREATED, null, newUser)
            );
        } catch (e) {
            res.status(StatusCode.SERVER_ERROR).json(
                APIResponse(StatusMessage.SERVER_ERROR, ErrorMessage(e))
            );
        }
    };

    getAll = async (req: Request, res: Response) => {
        try {
            const {data, success, error} = validatePartial(req.query, userSchema);
            if (!success) {
                res.status(StatusCode.BAD_REQUEST).json(
                    APIResponse(StatusMessage.BAD_REQUEST, error?.message)
                );
                return;
            }
            const userQuery: UserQuery = {...data}
            const allUsers = await this.userModel.getAll(userQuery, user.username, true);
            res.status(StatusCode.OK).json(
                APIResponse(StatusMessage.OK, null, allUsers)
            );
        } catch (e) {
            res.status(StatusCode.SERVER_ERROR).json(
                APIResponse(StatusMessage.SERVER_ERROR, ErrorMessage(e))
            );
        }
    };

    getById = async (req: Request, res: Response) => {
        try {
            const username = req.params.username;
            const userQuery: UserQuery = {username: username};
            const userFound = await this.userModel.getById(userQuery);
            if (!userFound) {
                res.status(StatusCode.NOT_FOUND).json(
                    APIResponse(StatusMessage.NOT_FOUND, `User with username ${username} not found`)
                );
                return;
            }
            res.status(StatusCode.OK).json(
                APIResponse(StatusMessage.OK, null, userFound)
            );
        } catch (e) {
            res.status(StatusCode.SERVER_ERROR).json(
                APIResponse(StatusMessage.SERVER_ERROR, ErrorMessage(e))
            );
        }
    };
    update = async (req: Request, res: Response) => {
        try {
            const username = req.params.username;
            const {data, success, error} = validatePartial(req.body, userSchema);
            const userQuery: UserQuery = {username: username};
            if (!success) {
                res.status(StatusCode.BAD_REQUEST).json(
                    APIResponse(StatusMessage.BAD_REQUEST, error?.message)
                );
                return;
            }
            const userData: Partial<User> = {...data};
            const userFound = await this.userModel.getById(userQuery);
            if (!userFound) {
                res.status(StatusCode.NOT_FOUND).json(
                    APIResponse(StatusMessage.NOT_FOUND, `User with username ${username} not found`)
                );
                return;
            }
            const updatedUser = await this.userModel.update(userQuery, userData);
            res.status(StatusCode.OK).json(
                APIResponse(StatusMessage.UPDATED, null, updatedUser)
            );
        } catch (e) {
            res.status(StatusCode.SERVER_ERROR).json(
                APIResponse(StatusMessage.SERVER_ERROR, ErrorMessage(e))
            );
        }
    };

    delete = async (req: Request, res: Response) => {
        try {
            const username = req.params.username;
            const userQuery: UserQuery = {username: username};
            const userFound = await this.userModel.getById(userQuery);
            if (!userFound) {
                res.status(StatusCode.NOT_FOUND).json(
                    APIResponse(StatusMessage.NOT_FOUND, `User with username ${username} not found`)
                );
                return;
            }
            await this.userModel.delete(userQuery);
            res.status(StatusCode.OK).json(
                APIResponse(StatusMessage.DELETED)
            );
        } catch (e) {
            res.status(StatusCode.SERVER_ERROR).json(
                APIResponse(StatusMessage.SERVER_ERROR, ErrorMessage(e))
            );
        }
    };

    getUserByToken = async (req: Request, res: Response) => {
        try {
            const token = req.headers.authorization?.split(' ')[1];
            if (!token) {
                res.status(StatusCode.NO_CONTENT).json(
                    APIResponse(StatusMessage.NO_CONTENT)
                );
                return;
            }
            const user = await this.userModel.getUserByToken(token);
            if (!user) {
                res.status(StatusCode.NOT_FOUND).json(
                    APIResponse(StatusMessage.NO_CONTENT)
                );
                return;
            }
            try {
                isValidToken(token);
            } catch (e) {
                res.status(StatusCode.UNAUTHORIZED).json(
                    APIResponse(StatusMessage.UNAUTHORIZED, `Invalid Token ${token}`)
                );
                return;
            }
            res.status(StatusCode.OK).json(
                APIResponse(StatusMessage.OK, null, user)
            );
        } catch (e) {
            res.status(StatusCode.SERVER_ERROR).json(
                APIResponse(StatusMessage.SERVER_ERROR, ErrorMessage(e))
            );
        }
    };

    userLogIn = async (req: Request, res: Response) => {
        try {
            const {data, success, error} = validate(req.body, userSchema);
            if (!success) {
                res.status(StatusCode.BAD_REQUEST).json(
                    APIResponse(StatusMessage.BAD_REQUEST, error?.message)
                );
                return;
            }
            const userQuery: UserQuery = {username: data.username}
            const userData = await this.userModel.getById(userQuery);
            if (!userData) {
                res.status(StatusCode.NOT_FOUND).json(
                    APIResponse(StatusMessage.NOT_FOUND, `User with username ${data?.username} not found`)
                );
                return;
            }
            const isCorrect: boolean = await bcrypt.compare(data.password, userData.password as string);
            if (!isCorrect) {
                res.status(StatusCode.UNAUTHORIZED).json(
                    APIResponse(StatusMessage.UNAUTHORIZED, 'Incorrect password')
                );
                return;
            }
            const token = createToken(data.username);
            await this.userModel.update(userQuery, {token: token});
            res.status(StatusCode.OK).json(
                APIResponse(StatusMessage.OK, null, token)
            );
        } catch (e) {
            res.status(StatusCode.SERVER_ERROR).json(
                APIResponse(StatusMessage.SERVER_ERROR, ErrorMessage(e))
            );
        }
    };
}