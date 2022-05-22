import initialState from "./InitialState"
export const REQUEST_MENU_OPEN = "@@ui/REQUEST_MENU_OPEN"
export const REQUEST_MENU_CLOSE = "@@ui/REQUEST_MENU_CLOSE"

export default function uiReducer(state = initialState.ui, action = {}) {
    switch(action.type) {
        case REQUEST_MENU_OPEN:
            let openSideMenu = {open: true}
            return {
                ...state,
                sideMenu: openSideMenu,
            }
        case REQUEST_MENU_CLOSE:
            let closeSideMenu = {open: false}
            return {
                ...state,
                sideMenu: closeSideMenu,
            }
        default:
            return state
    }
}
export const Actions = {}
Actions.openMenu = () => {
    return { type: REQUEST_MENU_OPEN}
}
Actions.closeMenu = () => {
    return { type: REQUEST_MENU_CLOSE }
}
