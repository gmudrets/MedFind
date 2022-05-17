import { combineReducers } from "redux"
import authReducer from "./Auth"
import {persistReducer} from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistConfig = {
  key: 'auth',
}

const rootReducer = combineReducers({
  auth: persistReducer({ ...persistConfig, storage }, authReducer),
  // other reducers will go here later
})

export default rootReducer