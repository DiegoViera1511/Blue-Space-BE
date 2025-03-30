import {APIResponse, ErrorMessage, StatusCode, StatusMessage, validate, validatePartial} from "../../utils";
import {Request, Response} from 'express';
import {StateQuery, stateSchema} from "./utils";
import {NewState, state, State} from "./schemas";
import {IStateModel} from "../../interfaces/IStateModel";

export class StateController {
    stateModel: IStateModel;

    constructor(stateModel: IStateModel) {
        this.stateModel = stateModel;
    }

    create = async (req: Request, res: Response) => {
        try {
            const {data, success, error} = validate(req.body, stateSchema);
            if (!success) {
                res.status(StatusCode.BAD_REQUEST).json(
                    APIResponse(StatusMessage.BAD_REQUEST, error?.message)
                );
                return;
            }
            const stateData: NewState = {...data};
            const newState = await this.stateModel.create(stateData);
            res.status(StatusCode.CREATED).json(
                APIResponse(StatusMessage.CREATED, null, newState)
            );
        } catch (e) {
            res.status(StatusCode.SERVER_ERROR).json(
                APIResponse(StatusMessage.SERVER_ERROR, ErrorMessage(e))
            );
        }
    };

    getAll = async (req: Request, res: Response) => {
        try {
            const {data, success, error} = validatePartial(req.query, stateSchema);
            if (!success) {
                res.status(StatusCode.BAD_REQUEST).json(
                    APIResponse(StatusMessage.BAD_REQUEST, error?.message)
                );
                return;
            }
            const stateQuery: StateQuery = {...data}
            const allState = await this.stateModel.getAll(stateQuery, state.position, true);
            res.status(StatusCode.OK).json(
                APIResponse(StatusMessage.OK, null, allState)
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
            const stateQuery: StateQuery = {id: id};
            const stateFound = await this.stateModel.getById(stateQuery);
            if (!stateFound) {
                res.status(StatusCode.NOT_FOUND).json(
                    APIResponse(StatusMessage.NOT_FOUND, `State with id ${id} not found`)
                );
                return;
            }
            res.status(StatusCode.OK).json(
                APIResponse(StatusMessage.OK, null, stateFound)
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
            const {data, success, error} = validatePartial(req.body, stateSchema);
            const stateQuery: StateQuery = {id: id};
            if (!success) {
                res.status(StatusCode.BAD_REQUEST).json(
                    APIResponse(StatusMessage.BAD_REQUEST, error?.message)
                );
                return;
            }
            const stateData: Partial<State> = {...data};
            const stateFound = await this.stateModel.getById(stateQuery);
            if (!stateFound) {
                res.status(StatusCode.NOT_FOUND).json(
                    APIResponse(StatusMessage.NOT_FOUND, `State with id ${id} not found`)
                );
                return;
            }
            const updatedState = await this.stateModel.update(stateQuery, stateData);
            res.status(StatusCode.OK).json(
                APIResponse(StatusMessage.UPDATED, null, updatedState)
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
            const stateQuery: StateQuery = {id: id};
            const stateFound = await this.stateModel.getById(stateQuery);
            if (!stateFound) {
                res.status(StatusCode.NOT_FOUND).json(
                    APIResponse(StatusMessage.NOT_FOUND, `State with id ${id} not found`)
                );
                return;
            }
            await this.stateModel.delete(stateQuery);
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