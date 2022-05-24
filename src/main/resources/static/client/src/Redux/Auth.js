import initialState from "./InitialState"
import {getAuth, onAuthStateChanged} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import {db} from "../../src/Configs/FirebaseConfig.js"

export const REQUEST_LOGIN = "@@auth/REQUEST_LOGIN"
export const REQUEST_LOGIN_FAILURE = "@@auth/REQUEST_LOGIN_FAILURE"
export const REQUEST_LOGIN_SUCCESS = "@@auth/REQUEST_LOGIN_SUCCESS"
export const REQUEST_LOG_USER_OUT = "@@auth/REQUEST_LOG_USER_OUT"


export default function authReducer(state = initialState.auth, action = {}) {
  switch(action.type) {
    case REQUEST_LOGIN:
      return {
        ...state,
        isLoading: true,
        userDetails: action.userDetails,
        userProfile: action.userProfile
      }
    case REQUEST_LOGIN_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.error,
        userDetails: '',
      }
    case REQUEST_LOGIN_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
      }
    case REQUEST_LOG_USER_OUT:
      return {
        ...initialState.auth,
      }
    default:
      return state;
  }
}

export const Actions = {}
Actions.requestUserLogin = (userDetails,userProfile) => {
  return { type: REQUEST_LOGIN, userDetails: userDetails, userProfile: userProfile }
}
Actions.logUserOut = () => {
  return { type: REQUEST_LOG_USER_OUT }
}
