import {TasksActionsType, tasksReducer} from './tasks-reducer'
import {TodolistsActionsType, todolistsReducer} from './todolists-reducer'
import {applyMiddleware, combineReducers, compose, legacy_createStore as createStore} from 'redux'
import thunk, {ThunkAction, ThunkDispatch} from "redux-thunk";
import {useDispatch} from "react-redux";

// необходимо для работы расширения Redux
declare global {
    interface Window {
        __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
    }
}
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;


// объединяя reducer-ы с помощью combineReducers,
// мы задаём структуру нашего единственного объекта-состояния
const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todolistsReducer
})

// непосредственно создаём store
export const store = createStore( // export const store = legacy_createStore(
    rootReducer,
    compose(applyMiddleware(thunk),
        composeEnhancers())  // export const store = createStore(rootReducer,applyMiddleware(thunk)) if only one enhancer (enhancer=усилитель)
)

// определить автоматически тип всего объекта состояния
// export type AppRootStateType = ReturnType<typeof rootReducer> // до типизации Dispatch
export type AppRootStateType = ReturnType<typeof store.getState> // после типизации Dispatch

//общий тип для все Action
export type AppActionType = TodolistsActionsType | TasksActionsType

export type AppDispatch = ThunkDispatch<AppRootStateType, unknown, AppActionType>;


export const useAppDispatch: () => AppDispatch = useDispatch

// типизация Thunk Action для всего объекта
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppRootStateType, unknown, AppActionType>;


// а это, чтобы можно было в консоли браузера обращаться к store в любой момент
// @ts-ignore
window.store = store