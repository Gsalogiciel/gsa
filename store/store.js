import { combineReducers,createStore } from "redux";

const initialState = {
    isLoggedIn: false,
    user: "connan"
}

const rootReducer = combineReducers({
    userData : () => initialState
})

export const store = createStore(rootReducer)