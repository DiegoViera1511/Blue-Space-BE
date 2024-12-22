import {ErrorMessage, validate, validateUpdate} from "../../utils";
import { Request, Response } from 'express';
import { StateQuery, stateSchema} from "./utils";
import { NewState, State} from "./schemas";
import {IStateModel} from "../../Interfaces/IStateModel";

export class StateController {
    stateModel: IStateModel;
    constructor(stateModel: IStateModel) {
        this.stateModel = stateModel;
    }
    create = async (req: Request, res: Response) => {
        try {
            const result = validate(req.body, stateSchema);
            if (!result.success) {
                res.status(400).json({ message: JSON.parse(result.error.message) });
                return;
            }
            const stateData: NewState = {
                ...result.data
            };
            const newState = await this.stateModel.create(stateData);
            res.status(201).json(newState);
        } catch (e) {
            res.status(500).json(ErrorMessage(e));
        }
    };

    getAll = async (_req: Request, res: Response) => {
        try {
            const allState = await this.stateModel.getAll();
            res.status(200).json(allState);
        } catch (e) {
            res.status(500).json(ErrorMessage(e));
        }
    };

    getById = async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            const stateQuery : StateQuery = { id: id };

            const stateFound = await this.stateModel.getById(stateQuery);
            if (!stateFound) {
                res.status(404).json({ message: 'Status not found' });
                return;
            }
            res.status(200).json(stateFound);
        } catch (e) {
            res.status(500).json(ErrorMessage(e));
        }
    };
    update = async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            const result = validateUpdate(req.body, stateSchema);
            const stateQuery: StateQuery = { id: id };

            if (!result.success) {
                res.status(400).json({ message: JSON.parse(result.error.message) });
                return;
            }
            const stateData: Partial<State> = { ...result.data };
            const stateFound = await this.stateModel.getById(stateQuery);
            if (!stateFound) {
                res.status(404).json({ message: 'State not found' });
                return;
            }
            const updatedState = await this.stateModel.update(stateQuery, stateData);
            res.status(200).json(updatedState);
        } catch (e) {
            res.status(500).json(ErrorMessage(e));
        }
    };

    delete = async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            const stateQuery: StateQuery = { id: id };
            const stateFound = await this.stateModel.getById(stateQuery);
            if (!stateFound) {
                res.status(404).json({ message: 'State not found' });
                return;
            }
            await this.stateModel.delete(stateQuery);
            res.status(200).json({ message: 'State deleted successfully' });
        } catch (e) {
            res.status(500).json(ErrorMessage(e));
        }
    };
}