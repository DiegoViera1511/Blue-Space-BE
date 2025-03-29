import {CRUD} from "../../general/crud";
import {StateQuery, StateQueryBuilder} from "./utils";
import {state} from "./schemas";
import {IStateModel} from "../../interfaces/IStateModel";

export class StateModel extends CRUD<StateQuery> implements IStateModel {
    constructor() {
        super(state, StateQueryBuilder);
    }
}