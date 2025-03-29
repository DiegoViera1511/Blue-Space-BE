import bcrypt from 'bcrypt';
import {APIMessage, ErrorMessage, StatusCode, StatusMessage, validate, validatePartial} from "../../utils";
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
                res.status(StatusCode.BAD_REQUEST).json(APIMessage(error.message));
                return;
            }
            const userData: NewUser = {...data};
            userData.password = await bcrypt.hash(userData.password, 10);
            const newUser = await this.userModel.create(userData);
            res.status(StatusCode.CREATED).json(newUser);
        } catch (e) {
            res.status(StatusCode.SERVER_ERROR).json(ErrorMessage(e));
        }
    };

    getAll = async (req: Request, res: Response) => {
        try {
            const {data, success, error} = validatePartial(req.query, userSchema);
            if (!success) {
                res.status(StatusCode.BAD_REQUEST).json(APIMessage(error.message));
                return;
            }
            const userQuery: UserQuery = {...data}
            const allUsers = await this.userModel.getAll(userQuery, user.username, true);
            res.status(StatusCode.OK).json(allUsers);
        } catch (e) {
            res.status(StatusCode.SERVER_ERROR).json(ErrorMessage(e));
        }
    };

    getById = async (req: Request, res: Response) => {
        try {
            const username = req.params.username;
            const userQuery: UserQuery = {username: username};
            const userFound = await this.userModel.getById(userQuery);
            if (!userFound) {
                res.status(StatusCode.NOT_FOUND).json(APIMessage(StatusMessage.NOT_FOUND));
                return;
            }
            res.status(StatusCode.OK).json(userFound);
        } catch (e) {
            res.status(StatusCode.SERVER_ERROR).json(ErrorMessage(e));
        }
    };
    update = async (req: Request, res: Response) => {
        try {
            const username = req.params.username;
            const {data, success, error} = validatePartial(req.body, userSchema);
            const userQuery: UserQuery = {username: username};
            if (!success) {
                res.status(StatusCode.BAD_REQUEST).json(APIMessage(error.message));
                return;
            }
            const userData: Partial<User> = {...data};
            const userFound = await this.userModel.getById(userQuery);
            if (!userFound) {
                res.status(StatusCode.NOT_FOUND).json(APIMessage(StatusMessage.NOT_FOUND));
                return;
            }
            const updatedUser = await this.userModel.update(userQuery, userData);
            res.status(StatusCode.OK).json(updatedUser);
        } catch (e) {
            res.status(StatusCode.SERVER_ERROR).json(ErrorMessage(e));
        }
    };

    delete = async (req: Request, res: Response) => {
        try {
            const username = req.params.username;
            const userQuery: UserQuery = {username: username};
            const userFound = await this.userModel.getById(userQuery);
            if (!userFound) {
                res.status(StatusCode.NOT_FOUND).json(APIMessage(StatusMessage.NOT_FOUND));
                return;
            }
            await this.userModel.delete(userQuery);
            res.status(StatusCode.OK).json(APIMessage(StatusMessage.DELETED));
        } catch (e) {
            res.status(StatusCode.SERVER_ERROR).json(ErrorMessage(e));
        }
    };

    getUserByToken = async (req: Request, res: Response) => {
        try {
            const token = req.headers.authorization?.split(' ')[1];
            if (!token) {
                res.status(StatusCode.NO_CONTENT).json(APIMessage(StatusMessage.NO_CONTENT));
                return;
            }
            const user = await this.userModel.getUserByToken(token);
            if (!user) {
                res.status(StatusCode.NOT_FOUND).json(APIMessage(StatusMessage.NOT_FOUND));
                return;
            }
            try {
                isValidToken(token);
            } catch (e) {
                res.status(StatusCode.UNAUTHORIZED).json(APIMessage(StatusMessage.UNAUTHORIZED));
                return;
            }
            res.status(StatusCode.OK).json(user);
        } catch (e) {
            res.status(StatusCode.SERVER_ERROR).json(ErrorMessage(e));
        }
    };

    userLogIn = async (req: Request, res: Response) => {
        try {
            const {data, success, error} = validate(req.body, userSchema);
            if (!success) {
                res.status(StatusCode.BAD_REQUEST).json(APIMessage(error.message));
                return;
            }
            const userQuery: UserQuery = {username: data.username}
            const userData = await this.userModel.getById(userQuery);
            if (!userData) {
                res.status(StatusCode.NOT_FOUND).json(APIMessage(StatusMessage.NOT_FOUND));
                return;
            }
            const isCorrect: boolean = await bcrypt.compare(data.password, userData.password as string);
            if (!isCorrect) {
                res.status(StatusCode.UNAUTHORIZED).json(APIMessage(StatusMessage.UNAUTHORIZED));
                return;
            }
            const token = createToken(data.username);
            await this.userModel.update(userQuery, {token: token});
            res.status(StatusCode.OK).json(token);
        } catch (e) {
            res.status(StatusCode.SERVER_ERROR).json(ErrorMessage(e));
        }
    };
}