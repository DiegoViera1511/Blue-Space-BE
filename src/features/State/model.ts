import {CRUD} from "../../types";
import { StateQuery, StateQueryBuilder} from "./utils";
import {state} from "./schemas";
import {IStateModel} from "../../Interfaces/IStateModel";

export class StateModel extends CRUD<StateQuery> implements IStateModel {
    constructor() {
        super(state , StateQueryBuilder);
    }
}