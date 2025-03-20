import bcrypt from 'bcrypt';
import {ErrorMessage, validate, validatePartial} from "../../utils";
import {createToken, isValidToken, UserQuery, userSchema} from "./utils";
import {Request, Response} from 'express';
import {NewUser, user, User} from "./schemas";
import {IUserModel} from "../../Interfaces/IUserModel";

export class UserController {
    userModel: IUserModel;

    constructor(userModel: IUserModel) {
        this.userModel = userModel;
    }

    create = async (req: Request, res: Response) => {
        try {
            const result = validate(req.body, userSchema);
            if (!result.success) {
                res.status(400).json({message: JSON.parse(result.error.message)});
                return;
            }
            const userData: NewUser = {
                ...result.data
            };
            userData.password = await bcrypt.hash(userData.password, 10);
            const newUser = await this.userModel.create(userData);
            res.status(201).json(newUser);
        } catch (e) {
            res.status(500).json(ErrorMessage(e));
        }
    };

    getAll = async (req: Request, res: Response) => {
        try {
            const result = validatePartial(req.query, userSchema);
            if (!result.success) {
                res.status(400).json({message: JSON.parse(result.error.message)});
                return;
            }
            const userQuery: UserQuery = {
                username: result.data.username,
                password: result.data.password
            }
            const allUsers = await this.userModel.getAll(userQuery, user.username, true);
            res.status(200).json(allUsers);
        } catch (e) {
            res.status(500).json(ErrorMessage(e));
        }
    };

    getById = async (req: Request, res: Response) => {
        try {
            const username = req.params.username;
            const userQuery: UserQuery = {username: username};

            const userFound = await this.userModel.getById(userQuery);
            if (!userFound) {
                res.status(404).json({message: 'User not found'});
                return;
            }
            res.status(200).json(userFound);
        } catch (e) {
            res.status(500).json(ErrorMessage(e));
        }
    };
    update = async (req: Request, res: Response) => {
        try {
            const username = req.params.username;
            const result = validatePartial(req.body, userSchema);
            const userQuery: UserQuery = {username: username};

            if (!result.success) {
                res.status(400).json({message: JSON.parse(result.error.message)});
                return;
            }
            const userData: Partial<User> = {...result.data};
            const userFound = await this.userModel.getById(userQuery);
            if (!userFound) {
                res.status(404).json({message: 'User not found'});
                return;
            }
            const updatedUser = await this.userModel.update(userQuery, userData);
            res.status(200).json(updatedUser);
        } catch (e) {
            res.status(500).json(ErrorMessage(e));
        }
    };

    delete = async (req: Request, res: Response) => {
        try {
            const username = req.params.username;
            const userQuery: UserQuery = {username: username};
            const userFound = await this.userModel.getById(userQuery);
            if (!userFound) {
                res.status(404).json({message: 'User not found'});
                return;
            }
            await this.userModel.delete(userQuery);
            res.status(200).json({message: 'User deleted successfully'});
        } catch (e) {
            res.status(500).json(ErrorMessage(e));
        }
    };

    getUserByToken = async (req: Request, res: Response) => {
        try {
            const token = req.headers.authorization?.split(' ')[1];
            if (!token) {
                res.status(404).json({message: 'Token not found'});
                return;
            }
            const user = await this.userModel.getUserByToken(token);
            if (!user) {
                res.status(404).json({message: 'User not found'});
                return;
            }
            isValidToken(token);
            res.status(200).json(user);
        } catch (e) {
            res.status(400).json({message: (e instanceof Error) ? e.message : 'An unknown error occurred'});
        }
    }

    userLogIn = async (req: Request, res: Response) => {
        const result = validate(req.body, userSchema);
        if (!result.success) {
            res.status(400).json({message: JSON.parse(result.error.message)});
            return;
        }
        const userQuery: UserQuery = {username: result.data.username}
        const userData = await this.userModel.getById(userQuery);
        if (!userData) {
            res.status(404).json({message: 'User not found'});
            return;
        }
        const isCorrect: boolean = await bcrypt.compare(result.data.password, userData.password as string);
        if (!isCorrect) {
            res.status(404).json({message: 'Password is incorrect'});
            return;
        }
        const token = createToken(result.data.username);
        await this.userModel.update(userQuery, {token: token});
        res.status(200).json(token);
    }
}