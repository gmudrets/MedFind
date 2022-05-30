import { combineReducers } from "redux"
import authReducer from "./Auth"
import uiReducer from "./UI";
import {persistReducer} from "redux-persist";
import storage from "redux-persist/lib/storage";
import userDataReducer from "./UserData";

const authPersistConfig = {
  key: 'auth',
}
const userDataPersistConfig = {
  key: 'userData',
}

const rootReducer = combineReducers({
  auth: persistReducer({ ...authPersistConfig, storage }, authReducer),
  ui: uiReducer,
  userData: persistReducer({ ...userDataPersistConfig, storage }, userDataReducer),
})

export default rootReducer
