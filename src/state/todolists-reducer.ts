import {v1} from 'uuid';
import {todolistAPI, TodolistType} from "../api/00_todolist-api";
import {Dispatch} from "redux";
import {AppActionType} from "./store";

export type RemoveTodolistActionType = {
    type: 'REMOVE-TODOLIST'
    id: string
}
export type AddTodolistActionType = {
    type: 'ADD-TODOLIST'
    title: string
    todolistID: string
}
export type ChangeTodolistTitleActionType = {
    type: 'CHANGE-TODOLIST-TITLE'
    id: string
    title: string
}
export type ChangeTodolistFilterActionType = {
    type: 'CHANGE-TODOLIST-FILTER'
    id: string
    filter: FilterValuesType
}
export type SetTodolistActionType = {
    type: 'SET-TODOLISTS'
    todolists: TodolistType[]
}
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
            return [...state, {id: action.todolistID, title: action.title, filter: "all", addedDate: "", order: 0}]
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

export const removeTodolistAC = (todolistId: string): RemoveTodolistActionType => {
    return {type: 'REMOVE-TODOLIST', id: todolistId}
}
export const addTodolistAC = (title: string): AddTodolistActionType => {
    return {type: 'ADD-TODOLIST', title: title, todolistID: v1()}
}
export const changeTodolistTitleAC = (todolistId: string, title: string): ChangeTodolistTitleActionType => {
    return {type: 'CHANGE-TODOLIST-TITLE', title: title, id: todolistId}
}
export const changeTodolistFilterAC = (todolistId: string, filter: FilterValuesType): ChangeTodolistFilterActionType => {
    return {type: 'CHANGE-TODOLIST-FILTER', filter: filter, id: todolistId}
}
export const setTodolistAC = (todolists: TodolistType[]): SetTodolistActionType => {
    return {type: 'SET-TODOLISTS', todolists}
}
export const fetchTodolistsTC = () => (dispatch: Dispatch<AppActionType>) => { //fetch - принести, получать, привести
    todolistAPI.getTodolists()
        .then((res) => {
            dispatch(setTodolistAC(res.data))
        })
}
export const changeTodolistsTitleTC = (todolistId:string, title:string) => async (dispatch: Dispatch<AppActionType>) => { //fetch - принести, получать, привести
    const res = await todolistAPI.updateTodolistTitle(todolistId,title)
    if (res.data.resultCode === 0) {
        dispatch(changeTodolistTitleAC(todolistId, title))
    }
}