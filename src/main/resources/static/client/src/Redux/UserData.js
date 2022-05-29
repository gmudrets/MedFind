import initialState from "./InitialState"

export const CHANGE_FIELD = "@@userData/CHANGE_FIELD"
export const INITIALIZE_USER_DATA = "@@userData/INITIALIZE_USER_DATA"



export default function userDataReducer(state = initialState.userData, action = {}) {
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
