import {tasksReducer} from './tasks-reducer'
import {todolistsReducer} from './todolists-reducer'
import {combineReducers} from 'redux'
import thunk from "redux-thunk";
import {appReducer} from "./app-reducer";
import {authReducer} from "./auth-reducer";
import {configureStore} from "@reduxjs/toolkit";

const rootReducer = combineReducers({
  tasks: tasksReducer,
  todolists: todolistsReducer,
  app: appReducer,
  auth: authReducer,
})

export const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware => getDefaultMiddleware().prepend(thunk)
})

//types
export type AppRootStateType = ReturnType<typeof store.getState> // после типизации Dispatch
export type AppDispatchType = typeof store.dispatch


// а это, чтобы можно было в консоли браузера обращаться к store в любой момент
// @ts-ignore
window.store = store