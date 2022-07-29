import {todolistAPI, TodolistType} from "../api/00_todolist-api";
import {Dispatch} from "redux";
import {AppActionType} from "./store";

export type RemoveTodolistActionType = ReturnType<typeof removeTodolistAC>
export type AddTodolistActionType = ReturnType<typeof addTodolistAC>
export type ChangeTodolistTitleActionType = ReturnType<typeof changeTodolistTitleAC>
export type ChangeTodolistFilterActionType = ReturnType<typeof changeTodolistFilterAC>
export type SetTodolistActionType = ReturnType<typeof setTodolistAC>
export type FilterValuesType = "all" | "active" | "completed";

export type TodolistsActionsType =
    RemoveTodolistActionType
    | AddTodolistActionType
    | ChangeTodolistTitleActionType
    | SetTodolistActionType
    | ChangeTodolistFilterActionType;


export type TodoListDomainType = TodolistType & { filter: FilterValuesType } // TodolistType from server and field "filter"

const initialState: Array<TodoListDomainType> = []

export const todolistsReducer = (state: Array<TodoListDomainType> = initialState, action: AppActionType): Array<TodoListDomainType> => {
    switch (action.type) {
        case 'SET-TODOLISTS': // add field "filter" to all todolist from server  TodolistType -> TodoListDomainType
            return action.todolists.map(td => ({...td, filter: "all"}))
        case 'REMOVE-TODOLIST':
            return state.filter(tl => tl.id !== action.id)
        case 'ADD-TODOLIST':
            return [ {...action.todolist, filter:"all"},...state]
        case 'CHANGE-TODOLIST-TITLE': {
            const todolist = state.find(tl => tl.id === action.id);
            if (todolist) {
                todolist.title = action.title;
            }
            return [...state]
        }
        case 'CHANGE-TODOLIST-FILTER': {
            const todolist = state.find(tl => tl.id === action.id);
            if (todolist) {
                todolist.filter = action.filter;
            }
            return [...state];
        }
        default:
            return state;
    }
}

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
export const fetchTodolistsTC = () => (dispatch: Dispatch<AppActionType>) => { //fetch - принести, получать, привести
    todolistAPI.getTodolists()
        .then((res) => {
            dispatch(setTodolistAC(res.data))
        })
}
export const changeTodolistsTitleTC = (todolistId:string, title:string) => async (dispatch: Dispatch<AppActionType>) => {
    const res = await todolistAPI.updateTodolistTitle(todolistId,title)
    if (res.data.resultCode === 0) {
        dispatch(changeTodolistTitleAC(todolistId, title))
    }
}
export const createTodolistsTC = (title:string) => async (dispatch: Dispatch<AppActionType>) => {
    const res = await todolistAPI.createTodolist(title)
    if (res.data.resultCode === 0) {
        dispatch(addTodolistAC(res.data.data.item))
    }
}
export const deleteTodolistsTC = (id:string) => async (dispatch: Dispatch<AppActionType>) => {
    const res = await todolistAPI.deleteTodolist(id)
    if (res.data.resultCode === 0) {
        dispatch(removeTodolistAC(id))
    }
}