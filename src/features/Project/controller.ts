import {APIResponse, ErrorMessage, StatusCode, StatusMessage, validate, validatePartial} from "../../utils";
import {Request, Response} from 'express';
import {ProjectQuery, projectSchema} from "./utils";
import {NewProject, project, Project} from "./schemas";
import {IProjectModel} from "../../interfaces/IProjectModel";
import {IUsersToProjectsModel} from "../../interfaces/IUsersToProjects";

export class ProjectController {
    projectModel: IProjectModel;
    usersToProjectsModel: IUsersToProjectsModel

    constructor(projectModel: IProjectModel, usersToProjectsModel: IUsersToProjectsModel) {
        this.projectModel = projectModel;
        this.usersToProjectsModel = usersToProjectsModel;
    }

    create = async (req: Request, res: Response) => {
        try {
            const {data, success, error} = validate(req.body, projectSchema);
            if (!success) {
                res.status(StatusCode.BAD_REQUEST).json(
                    APIResponse(StatusMessage.BAD_REQUEST, error?.message)
                );
                return;
            }
            const projectData: NewProject = {...data};
            const newProject = await this.projectModel.create(projectData)
            res.status(StatusCode.CREATED).json(
                APIResponse(StatusMessage.CREATED, null, newProject)
            );
        } catch (e) {
            res.status(StatusCode.SERVER_ERROR).json(
                APIResponse(StatusMessage.SERVER_ERROR, ErrorMessage(e))
            );
        }
    };

    getAll = async (req: Request, res: Response) => {
        try {
            const {data, success, error} = validatePartial(req.query, projectSchema);
            if (!success) {
                res.status(StatusCode.BAD_REQUEST).json(
                    APIResponse(StatusMessage.BAD_REQUEST, error?.message)
                );
                return;
            }
            const projectQuery: ProjectQuery = {...data}
            const allProjects = await this.projectModel.getAll(projectQuery, project.name, true);
            res.status(StatusCode.OK).json(
                APIResponse(StatusMessage.OK, null, allProjects)
            );
        } catch (e) {
            res.status(StatusCode.SERVER_ERROR).json(
                APIResponse(StatusMessage.SERVER_ERROR, ErrorMessage(e))
            );
        }
    };

    getById = async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            const projectQuery: ProjectQuery = {id: id};
            const projectFound = await this.projectModel.getById(projectQuery);
            if (!projectFound) {
                res.status(StatusCode.NOT_FOUND).json(
                    APIResponse(StatusMessage.NOT_FOUND, `Project with id ${id} not found`)
                );
                return;
            }
            res.status(StatusCode.OK).json(
                APIResponse(StatusMessage.OK, null, projectFound)
            );
        } catch (e) {
            res.status(StatusCode.SERVER_ERROR).json(
                APIResponse(StatusMessage.SERVER_ERROR, ErrorMessage(e))
            );
        }
    };

    update = async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            const {data, success, error} = validatePartial(req.body, projectSchema);
            const projectQuery: ProjectQuery = {id: id};
            if (!success) {
                res.status(StatusCode.BAD_REQUEST).json(
                    APIResponse(StatusMessage.BAD_REQUEST, error?.message)
                );
                return;
            }
            const projectData: Partial<Project> = {...data};
            const projectFound = await this.projectModel.getById(projectQuery);
            if (!projectFound) {
                res.status(StatusCode.NOT_FOUND).json(
                    APIResponse(StatusMessage.NOT_FOUND, `Project with id ${id} not found`)
                );
                return;
            }
            const updatedProject = await this.projectModel.update(projectQuery, projectData);
            res.status(StatusCode.OK).json(
                APIResponse(StatusMessage.UPDATED, null, updatedProject)
            );
        } catch (e) {
            res.status(StatusCode.SERVER_ERROR).json(
                APIResponse(StatusMessage.SERVER_ERROR, ErrorMessage(e))
            );
        }
    };

    delete = async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            const projectQuery: ProjectQuery = {id: id};
            const projectFound = await this.projectModel.getById(projectQuery);
            if (!projectFound) {
                res.status(StatusCode.NOT_FOUND).json(
                    APIResponse(StatusMessage.NOT_FOUND, `Project with id ${id} not found`)
                );
                return;
            }
            await this.projectModel.delete(projectQuery);
            res.status(StatusCode.OK).json(
                APIResponse(StatusMessage.DELETED)
            );
        } catch (e) {
            res.status(StatusCode.SERVER_ERROR).json(
                APIResponse(StatusMessage.SERVER_ERROR, ErrorMessage(e))
            );
        }
    };
}