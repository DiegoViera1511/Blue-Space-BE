import {createApp} from "./app";
import {UserModel} from "./features/User/model";
import {CardModel} from "./features/Card/model";

const appModels ={
    userModel: new UserModel(),
    cardModel : new CardModel()
}

createApp(appModels);