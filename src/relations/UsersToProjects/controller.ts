import {IUsersToProjectsModel} from "../../Interfaces/IUsersToProjects";
import {Request, Response} from "express";
import {ErrorMessage, validate, validatePartial} from "../../utils";
import {UsersToProjectsQuery, usersToProjectsSchema} from "./utils";
import {NewUsersToProjects, UsersToProjects, usersToProjects} from "./schemas";

export class UsersToProjectsController {
    usersToProjectsModel: IUsersToProjectsModel;

    constructor(usersToProjectsModel: IUsersToProjectsModel) {
        this.usersToProjectsModel = usersToProjectsModel;
    }

    create = async (req: Request, res: Response) => {
        try {
            const result = validate(req.body, usersToProjectsSchema);
            if (!result.success) {
                res.status(400).json({message: JSON.parse(result.error.message)});
                return;
            }
            const userToProjectsData: NewUsersToProjects = {
                ...result.data
            };
            const newUserToProjects = await this.usersToProjectsModel.create(userToProjectsData);
            res.status(201).json(newUserToProjects)
        } catch (e) {
            res.status(500).json(ErrorMessage(e));
        }
    }

    getAll = async (req: Request, res: Response) => {
        try {
            const result = validatePartial(req.query, usersToProjectsSchema);
            if (!result.success) {
                res.status(400).json({message: JSON.parse(result.error.message)});
                return;
            }
            const usersToProjectsQuery: UsersToProjectsQuery = {
                ...result.data
            }
            const allUsersToProjects = await this.usersToProjectsModel.getAll(usersToProjectsQuery, usersToProjects.username, true);
            res.status(200).json(allUsersToProjects);
        } catch (e) {
            res.status(500).json(ErrorMessage(e));
        }
    }

    getAllDto = async (req: Request, res: Response) => {
        try {
            const result = validatePartial(req.query, usersToProjectsSchema);
            if (!result.success) {
                res.status(400).json({message: JSON.parse(result.error.message)});
                return;
            }
            const usersToProjectsQuery: UsersToProjectsQuery = {
                ...result.data
            }
            const allUsersToProjects = await this.usersToProjectsModel.getAllDto(usersToProjectsQuery);
            res.status(200).json(allUsersToProjects);
        } catch (e) {
            res.status(500).json(ErrorMessage(e));
        }
    }

    getById = async (req: Request, res: Response) => {
        try {
            const username = req.params.username;
            const project_id = req.params.project_id;
            const usersToProjectsQuery: UsersToProjectsQuery = {
                username: username,
                project_id: project_id
            }
            const userToProjectsFound = await this.usersToProjectsModel.getById(usersToProjectsQuery);
            if (!userToProjectsFound) {
                res.status(404).json({message: 'User to project not found'});
                return;
            }
            res.status(200).json(userToProjectsFound);
        } catch (e) {
            res.status(500).json(ErrorMessage(e));
        }
    }

    update = async (req: Request, res: Response) => {
        try {
            const username = req.params.username;
            const project_id = req.params.project_id;
            const result = validatePartial(req.body, usersToProjectsSchema);
            if (!result.success) {
                res.status(400).json({message: JSON.parse(result.error.message)});
                return;
            }
            const usersToProjectsQuery: UsersToProjectsQuery = {
                username: username,
                project_id: project_id
            }
            const usersToProjectsData: Partial<UsersToProjects> = {
                ...result.data
            }
            const userToProjectsFound = await this.usersToProjectsModel.getById(usersToProjectsQuery);
            if (!userToProjectsFound) {
                res.status(404).json({message: 'User to project not found'});
                return;
            }
            const updatedUserToProjects = await this.usersToProjectsModel.update(usersToProjectsQuery, usersToProjectsData);
            res.status(200).json(updatedUserToProjects);
        } catch (e) {
            res.status(500).json(ErrorMessage(e));
        }
    }

    delete = async (req: Request, res: Response) => {
        try {
            const username = req.params.username;
            const project_id = req.params.project_id;
            const usersToProjectsQuery: UsersToProjectsQuery = {
                username: username,
                project_id: project_id
            }
            const userToProjectsFound = await this.usersToProjectsModel.getById(usersToProjectsQuery);
            if (!userToProjectsFound) {
                res.status(404).json({message: 'User to project not found'});
                return;
            }
            await this.usersToProjectsModel.delete(usersToProjectsQuery);
            res.status(200).json({message: 'User to project deleted successfully'});
        } catch (e) {
            res.status(500).json(ErrorMessage(e));
        }
    }

}