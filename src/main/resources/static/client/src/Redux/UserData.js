import initialState from "./InitialState"
import {getAuth, onAuthStateChanged} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import {db} from "../../src/Configs/FirebaseConfig.js"

export const CHANGE_FIELD = "@@userData/CHANGE_FIELD"
export const INITIALIZE_USER_DATA = "@@userData/INITIALIZE_USER_DATA"



export default function userDataReducer(state = initialState.auth, action = {}) {
    switch(action.type) {
        case INITIALIZE_USER_DATA:
            return {
                userProfile: action.userProfile
            }
        case CHANGE_FIELD:
            const newState = {...state, userProfile :{
                ...state.userProfile,
                }
            }
            newState.userProfile[action.field] = action.setTo;
            return newState;
        default:

            return state;
    }
}

export const Actions = {}
Actions.initializeUserData = (userProfile) => {
    return { type: INITIALIZE_USER_DATA, userProfile: userProfile }
}
Actions.changeField = (field,setTo) => {
    return { type: CHANGE_FIELD, field:field, setTo:setTo }
}
