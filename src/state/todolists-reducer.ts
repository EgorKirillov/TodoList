import {todolistAPI, TodolistType} from "../api/00_todolist-api";
import {Dispatch} from "redux";
// import {AppActionType, AppThunk} from "./store";
import {RequestStatusType, setAppStatusAC} from "./app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../utils/error-utils";

const initialState: Array<TodoListDomainType> = []

// reducer
export const todolistsReducer = (state: Array<TodoListDomainType> = initialState, action:TodolistsActionsType): Array<TodoListDomainType> => {
    switch (action.type) {
        case 'SET-TODOLISTS': { // add field "filter" to all todolist from server and entityStatus: "idle" TodolistType -> TodoListDomainType
            console.log(action)
            return action.todolists.map(td => ({...td, filter: "all", todolistStatus: "idle"}))
        }
        case 'REMOVE-TODOLIST':
            return state.filter(tl => tl.id !== action.id)
        case 'ADD-TODOLIST':
            return [{...action.todolist, filter: "all", todolistStatus: "idle"}, ...state]
        case 'CHANGE-TODOLIST-TITLE':
            return state.map(tl => tl.id === action.id ? {...tl, title: action.title} : tl)
        case 'CHANGE-TODOLIST-FILTER':
            return state.map(tl => tl.id === action.id ? {...tl, filter: action.filter} : tl)
        case "CHANGE-TODOLIST-ENTITY-STATUS":
            return state.map(tl => tl.id === action.id ? {...tl, todolistStatus: action.entityStatus} : tl)
        default:
            return state;
    }
}
// action creators
export const removeTodolistAC = (todolistId: string) => {
    return {type: 'REMOVE-TODOLIST', id: todolistId} as const
}
export const addTodolistAC = (todolist: TodolistType) => {
    return {type: 'ADD-TODOLIST', todolist} as const
}
export const changeTodolistTitleAC = (todolistId: string, title: string) => {
    return {type: 'CHANGE-TODOLIST-TITLE', title: title, id: todolistId} as const
}
export const changeTodolistFilterAC = (todolistId: string, filter: FilterValuesType) => {
    return {type: 'CHANGE-TODOLIST-FILTER', filter: filter, id: todolistId} as const
}
export const setTodolistAC = (todolists: TodolistType[]) => {
    return {type: 'SET-TODOLISTS', todolists} as const
}
export const changeTodolistEntityStatusAC = (id: string, todolistStatus: RequestStatusType) => {
    return {type: 'CHANGE-TODOLIST-ENTITY-STATUS', id, entityStatus: todolistStatus} as const
}

// thunk creators
export const fetchTodolistsTC = () =>    // (dispatch: Dispatch<AppActionType>) => { //fetch - принести, получать, привести
    (dispatch:Dispatch) => { //fetch - принести, получать, привести
        dispatch(setAppStatusAC({status:"loading"}))
        todolistAPI.getTodolists()
            .then((res) => {
                dispatch(setTodolistAC(res.data))
                dispatch(setAppStatusAC({status:"succeeded"}))
            }).catch(() => {
            dispatch(setAppStatusAC({status:"failed"}))
        })
    }
export const changeTodolistsTitleTC = (todolistId: string, title: string) => async (dispatch: Dispatch) => {
    try {
        dispatch(changeTodolistEntityStatusAC(todolistId, "loading"))
        dispatch(setAppStatusAC({status:"loading"}))
        const res = await todolistAPI.updateTodolistTitle(todolistId, title)
        if (res.data.resultCode === 0) {
            dispatch(changeTodolistTitleAC(todolistId, title))
            dispatch(setAppStatusAC({status:"succeeded"}))
        } else {
            handleServerAppError(res.data, dispatch)
        }
    } catch (error) {
        handleServerNetworkError(error as { message: string }, dispatch)
        
    } finally {
        dispatch(changeTodolistEntityStatusAC(todolistId, "idle"))
    }
    
}

export const createTodolistsTC = (title: string) => async (dispatch: Dispatch) => {
    
    try {
        dispatch(setAppStatusAC({status:"loading"}))
        const res = await todolistAPI.createTodolist(title)
        if (res.data.resultCode === 0) {
            dispatch(addTodolistAC(res.data.data.item))
            dispatch(setAppStatusAC({status:"succeeded"}))
        } else {
            handleServerAppError(res.data, dispatch)
        }
    } catch (error) {
        handleServerNetworkError(error as { message: string }, dispatch)
    }
}

export const deleteTodolistsTC = (id: string) => async (dispatch: Dispatch) => {
    try {
        dispatch(changeTodolistEntityStatusAC(id, "loading"))
        dispatch(setAppStatusAC({status:"loading"}))
        const res = await todolistAPI.deleteTodolist(id)
        if (res.data.resultCode === 0) {
            dispatch(removeTodolistAC(id))
            dispatch(setAppStatusAC({status:"succeeded"}))
        } else {
            handleServerAppError(res.data, dispatch)
        }
    } catch (error) {
        handleServerNetworkError(error as { message: string }, dispatch)
    }
}

// types

export type RemoveTodolistActionType = ReturnType<typeof removeTodolistAC>
export type AddTodolistActionType = ReturnType<typeof addTodolistAC>
export type ChangeTodolistTitleActionType = ReturnType<typeof changeTodolistTitleAC>
export type ChangeTodolistFilterActionType = ReturnType<typeof changeTodolistFilterAC>
export type SetTodolistActionType = ReturnType<typeof setTodolistAC>
export type ChangeTodolistEntityStatusType = ReturnType<typeof changeTodolistEntityStatusAC>

export type FilterValuesType = "all" | "active" | "completed";

export type TodolistsActionsType =
    RemoveTodolistActionType
    | AddTodolistActionType
    | ChangeTodolistTitleActionType
    | SetTodolistActionType
    | ChangeTodolistFilterActionType
    | ChangeTodolistEntityStatusType;
// TodolistType from server and field "filter"
export type TodoListDomainType = TodolistType
    & {
    filter: FilterValuesType
    todolistStatus: RequestStatusType
}