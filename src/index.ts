import {createApp} from "./app";
import {UserModel} from "./features/User/model";
import {CardModel} from "./features/Card/model";
import {ProjectModel} from "./features/Project/model";

const appModels ={
    userModel: new UserModel(),
    cardModel : new CardModel(),
    projectModel : new ProjectModel()
}

createApp(appModels);