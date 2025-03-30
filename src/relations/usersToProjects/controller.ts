import {IUsersToProjectsModel} from "../../interfaces/IUsersToProjects";
import {Request, Response} from "express";
import {APIResponse, ErrorMessage, StatusCode, StatusMessage, validate, validatePartial} from "../../utils";
import {UsersToProjectsQuery, usersToProjectsSchema} from "./utils";
import {NewUsersToProjects, UsersToProjects, usersToProjects} from "./schemas";

export class UsersToProjectsController {
    usersToProjectsModel: IUsersToProjectsModel;

    constructor(usersToProjectsModel: IUsersToProjectsModel) {
        this.usersToProjectsModel = usersToProjectsModel;
    }

    create = async (req: Request, res: Response) => {
        try {
            const {data, success, error} = validate(req.body, usersToProjectsSchema);
            if (!success) {
                res.status(StatusCode.BAD_REQUEST).json(
                    APIResponse(StatusMessage.BAD_REQUEST, error?.message)
                );
                return;
            }
            const userToProjectsData: NewUsersToProjects = {...data};
            const newUserToProjects = await this.usersToProjectsModel.create(userToProjectsData);
            res.status(StatusCode.CREATED).json(
                APIResponse(StatusMessage.CREATED, null, newUserToProjects)
            );
        } catch (e) {
            res.status(StatusCode.SERVER_ERROR).json(
                APIResponse(StatusMessage.SERVER_ERROR, ErrorMessage(e))
            );
        }
    }

    getAll = async (req: Request, res: Response) => {
        try {
            const {data, success, error} = validatePartial(req.query, usersToProjectsSchema);
            if (!success) {
                res.status(StatusCode.BAD_REQUEST).json(
                    APIResponse(StatusMessage.BAD_REQUEST, error?.message)
                );
                return;
            }
            const usersToProjectsQuery: UsersToProjectsQuery = {...data}
            const allUsersToProjects = await this.usersToProjectsModel.getAll(usersToProjectsQuery, usersToProjects.username, true);
            res.status(StatusCode.OK).json(
                APIResponse(StatusMessage.OK, null, allUsersToProjects)
            );
        } catch (e) {
            res.status(StatusCode.SERVER_ERROR).json(
                APIResponse(StatusMessage.SERVER_ERROR, ErrorMessage(e))
            );
        }
    }

    getAllDto = async (req: Request, res: Response) => {
        try {
            const {data, success, error} = validatePartial(req.query, usersToProjectsSchema);
            if (!success) {
                res.status(StatusCode.BAD_REQUEST).json(
                    APIResponse(StatusMessage.BAD_REQUEST, error?.message)
                );
                return;
            }
            const usersToProjectsQuery: UsersToProjectsQuery = {...data}
            const allUsersToProjects = await this.usersToProjectsModel.getAllDto(usersToProjectsQuery);
            res.status(StatusCode.OK).json(
                APIResponse(StatusMessage.OK, null, allUsersToProjects)
            );
        } catch (e) {
            res.status(StatusCode.SERVER_ERROR).json(
                APIResponse(StatusMessage.SERVER_ERROR, ErrorMessage(e))
            );
        }
    }

    getById = async (req: Request, res: Response) => {
        try {
            const {username, project_id} = req.params;
            const usersToProjectsQuery: UsersToProjectsQuery = {
                username: username,
                project_id: project_id
            }
            const userToProjectsFound = await this.usersToProjectsModel.getById(usersToProjectsQuery);
            if (!userToProjectsFound) {
                res.status(StatusCode.NOT_FOUND).json(
                    APIResponse(StatusMessage.NOT_FOUND, 'User to project relation not found')
                );
                return;
            }
            res.status(StatusCode.OK).json(
                APIResponse(StatusMessage.OK, null, usersToProjectsQuery)
            );
        } catch (e) {
            res.status(StatusCode.SERVER_ERROR).json(
                APIResponse(StatusMessage.SERVER_ERROR, ErrorMessage(e))
            );
        }
    }

    update = async (req: Request, res: Response) => {
        try {
            const {username, project_id} = req.params;
            const {data, success, error} = validatePartial(req.body, usersToProjectsSchema);
            if (!success) {
                res.status(StatusCode.BAD_REQUEST).json(
                    APIResponse(StatusMessage.BAD_REQUEST, error?.message)
                );
                return;
            }
            const usersToProjectsQuery: UsersToProjectsQuery = {
                username: username,
                project_id: project_id
            }
            const usersToProjectsData: Partial<UsersToProjects> = {...data}
            const userToProjectsFound = await this.usersToProjectsModel.getById(usersToProjectsQuery);
            if (!userToProjectsFound) {
                res.status(StatusCode.NOT_FOUND).json(
                    APIResponse(StatusMessage.NOT_FOUND, 'User to project relation not found')
                );
                return;
            }
            const updatedUserToProjects = await this.usersToProjectsModel.update(usersToProjectsQuery, usersToProjectsData);
            res.status(StatusCode.OK).json(
                APIResponse(StatusMessage.UPDATED, null, updatedUserToProjects)
            );
        } catch (e) {
            res.status(StatusCode.SERVER_ERROR).json(
                APIResponse(StatusMessage.SERVER_ERROR, ErrorMessage(e))
            );
        }
    }

    delete = async (req: Request, res: Response) => {
        try {
            const {username, project_id} = req.params;
            const usersToProjectsQuery: UsersToProjectsQuery = {
                username: username,
                project_id: project_id
            }
            const userToProjectsFound = await this.usersToProjectsModel.getById(usersToProjectsQuery);
            if (!userToProjectsFound) {
                res.status(StatusCode.NOT_FOUND).json(
                    APIResponse(StatusMessage.NOT_FOUND, 'User to project relation not found')
                );
                return;
            }
            await this.usersToProjectsModel.delete(usersToProjectsQuery);
            res.status(StatusCode.OK).json(
                APIResponse(StatusMessage.DELETED)
            );
        } catch (e) {
            res.status(StatusCode.SERVER_ERROR).json(
                APIResponse(StatusMessage.SERVER_ERROR, ErrorMessage(e))
            );
        }
    }

}