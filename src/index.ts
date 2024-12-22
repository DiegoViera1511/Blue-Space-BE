import {createApp} from "./app";
import {UserModel} from "./features/User/model";

const appModels ={
    userModel: new UserModel()
}

createApp(appModels);