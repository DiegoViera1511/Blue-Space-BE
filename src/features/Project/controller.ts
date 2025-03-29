import {APIMessage, ErrorMessage, StatusCode, StatusMessage, validate, validatePartial} from "../../utils";
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
                res.status(StatusCode.BAD_REQUEST).json(APIMessage(error.message));
                return;
            }
            const projectData: NewProject = {...data};
            const newProject = await this.projectModel.create(projectData)
            res.status(StatusCode.CREATED).json(newProject);
        } catch (e) {
            res.status(StatusCode.SERVER_ERROR).json(ErrorMessage(e));
        }
    };

    getAll = async (req: Request, res: Response) => {
        try {
            const {data, success, error} = validatePartial(req.query, projectSchema);
            if (!success) {
                res.status(StatusCode.BAD_REQUEST).json(APIMessage(error.message));
                return;
            }
            const projectQuery: ProjectQuery = {...data}
            const allProjects = await this.projectModel.getAll(projectQuery, project.name, true);
            res.status(StatusCode.OK).json(allProjects);
        } catch (e) {
            res.status(StatusCode.SERVER_ERROR).json(ErrorMessage(e));
        }
    };

    getById = async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            const projectQuery: ProjectQuery = {id: id};
            const projectFound = await this.projectModel.getById(projectQuery);
            if (!projectFound) {
                res.status(StatusCode.NOT_FOUND).json(APIMessage(StatusMessage.NOT_FOUND));
                return;
            }
            res.status(StatusCode.OK).json(projectFound);
        } catch (e) {
            res.status(StatusCode.SERVER_ERROR).json(ErrorMessage(e));
        }
    };

    update = async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            const {data, success, error} = validatePartial(req.body, projectSchema);
            const projectQuery: ProjectQuery = {id: id};
            if (!success) {
                res.status(StatusCode.BAD_REQUEST).json(APIMessage(error.message));
                return;
            }
            const projectData: Partial<Project> = {...data};
            const projectFound = await this.projectModel.getById(projectQuery);
            if (!projectFound) {
                res.status(StatusCode.NOT_FOUND).json(APIMessage(StatusMessage.NOT_FOUND));
                return;
            }
            const updatedProject = await this.projectModel.update(projectQuery, projectData);
            res.status(StatusCode.OK).json(updatedProject);
        } catch (e) {
            res.status(StatusCode.SERVER_ERROR).json(ErrorMessage(e));
        }
    };

    delete = async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            const projectQuery: ProjectQuery = {id: id};
            const projectFound = await this.projectModel.getById(projectQuery);
            if (!projectFound) {
                res.status(StatusCode.NOT_FOUND).json(APIMessage(StatusMessage.NOT_FOUND));
                return;
            }
            await this.projectModel.delete(projectQuery);
            res.status(StatusCode.OK).json(APIMessage(StatusMessage.DELETED));
        } catch (e) {
            res.status(StatusCode.SERVER_ERROR).json(ErrorMessage(e));
        }
    };
}