import {ErrorMessage, validate, validatePartial} from "../../utils";
import { Request, Response } from 'express';
import { ProjectQuery, projectSchema} from "./utils";
import {NewProject, Project} from "./schemas";
import {IProjectModel} from "../../Interfaces/IProjectModel";

export class ProjectController {
    projectModel: IProjectModel;
    constructor(projectModel: IProjectModel) {
        this.projectModel = projectModel;
    }
    create = async (req: Request, res: Response) => {
        try {
            const result = validate(req.body, projectSchema);
            if (!result.success) {
                res.status(400).json({ message: JSON.parse(result.error.message) });
                return;
            }
            const projectData: NewProject = {
                ...result.data
            };
            const newProject = await this.projectModel.create(projectData);
            res.status(201).json(newProject);
        } catch (e) {
            res.status(500).json(ErrorMessage(e));
        }
    };

    getAll = async (req: Request, res: Response) => {
        try {
            const result = validatePartial(req.query, projectSchema);
            if (!result.success) {
                res.status(400).json({ message: JSON.parse(result.error.message) });
                return;
            }
            const projectQuery : ProjectQuery = {
                username: result.data.username,
                name: result.data.name
            }
            const allProjects = await this.projectModel.getAll(projectQuery);
            res.status(200).json(allProjects);
        } catch (e) {
            res.status(500).json(ErrorMessage(e));
        }
    };

    getById = async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            const projectQuery : ProjectQuery = { id: id };

            const projectFound = await this.projectModel.getById(projectQuery);
            if (!projectFound) {
                res.status(404).json({ message: 'Project not found' });
                return;
            }
            res.status(200).json(projectFound);
        } catch (e) {
            res.status(500).json(ErrorMessage(e));
        }
    };
    update = async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            const result = validatePartial(req.body, projectSchema);
            const projectQuery: ProjectQuery = { id: id };

            if (!result.success) {
                res.status(400).json({ message: JSON.parse(result.error.message) });
                return;
            }
            const projectData: Partial<Project> = { ...result.data };
            const projectFound = await this.projectModel.getById(projectQuery);
            if (!projectFound) {
                res.status(404).json({ message: 'Project not found' });
                return;
            }
            const updatedProject = await this.projectModel.update(projectQuery, projectData);
            res.status(200).json(updatedProject);
        } catch (e) {
            res.status(500).json(ErrorMessage(e));
        }
    };

    delete = async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            const projectQuery: ProjectQuery = { id: id };
            const projectFound = await this.projectModel.getById(projectQuery);
            if (!projectFound) {
                res.status(404).json({ message: 'Project not found' });
                return;
            }
            await this.projectModel.delete(projectQuery);
            res.status(200).json({ message: 'Project deleted successfully' });
        } catch (e) {
            res.status(500).json(ErrorMessage(e));
        }
    };
}