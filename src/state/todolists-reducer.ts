import {todolistAPI, TodolistType} from "../api/00_todolist-api";
import {Dispatch} from "redux";
import {RequestStatusType, setAppStatusAC} from "./app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../utils/error-utils";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState:Array<TodoListDomainType> = []

const slice = createSlice({
  name: 'todolists',
  initialState: initialState,
  reducers: {
    removeTodolistAC(state, action: PayloadAction<{ todolistId: string }>) {
      const index = state.findIndex(tl => tl.id === action.payload.todolistId)
      if (index > -1) state.splice(index, 1)
    },
    addTodolistAC(state, action: PayloadAction<{ todolist: TodolistType }>) {
      state.unshift({...action.payload.todolist, filter: "all", todolistStatus: "idle"})
    },
    changeTodolistTitleAC(state, action: PayloadAction<{ todolistId: string, title: string }>) {
      const index = state.findIndex(tl => tl.id === action.payload.todolistId)
      state[index].title = action.payload.title
    },
    changeTodolistFilterAC(state, action: PayloadAction<{ todolistId: string, filter: FilterValuesType }>) {
      const index = state.findIndex(tl => tl.id === action.payload.todolistId)
      state[index].filter = action.payload.filter
    },
    changeTodolistEntityStatusAC(state, action: PayloadAction<{ todolistId: string, todolistStatus: RequestStatusType }>) {
      const index = state.findIndex(tl => tl.id === action.payload.todolistId)
      state[index].todolistStatus = action.payload.todolistStatus
    },
    setTodolistAC(state, action: PayloadAction<{ todolists: TodolistType[] }>) {
      //  проверить forEach
      return action.payload.todolists.map(td => ({...td, filter: "all", todolistStatus: "idle"}))
    },
  }

})

// reducer
export const todolistsReducer = slice.reducer
export const {
  removeTodolistAC, addTodolistAC,
  changeTodolistTitleAC, changeTodolistFilterAC,
  changeTodolistEntityStatusAC, setTodolistAC
} = slice.actions
// action creators


// thunk creators
export const fetchTodolistsTC = () =>    // (dispatch: Dispatch<AppActionType>) => { //fetch - принести, получать, привести
  (dispatch: Dispatch) => { //fetch - принести, получать, привести
    dispatch(setAppStatusAC({status: "loading"}))
    todolistAPI.getTodolists()
      .then((res) => {
        dispatch(setTodolistAC({todolists: res.data}))
        dispatch(setAppStatusAC({status: "succeeded"}))
      }).catch(() => {
      dispatch(setAppStatusAC({status: "failed"}))
    })
  }
export const changeTodolistsTitleTC = (todolistId: string, title: string) => async (dispatch: Dispatch) => {
  try {
    dispatch(changeTodolistEntityStatusAC({todolistId: todolistId, todolistStatus: "loading"}))
    dispatch(setAppStatusAC({status: "loading"}))
    const res = await todolistAPI.updateTodolistTitle(todolistId, title)
    if (res.data.resultCode === 0) {
      dispatch(changeTodolistTitleAC({todolistId: todolistId, title: title}))
      dispatch(setAppStatusAC({status: "succeeded"}))
    } else {
      handleServerAppError(res.data, dispatch)
    }
  } catch (error) {
    handleServerNetworkError(error as { message: string }, dispatch)

  } finally {
    dispatch(changeTodolistEntityStatusAC({todolistId, todolistStatus: 'idle'}))
  }

}

export const createTodolistsTC = (title: string) => async (dispatch: Dispatch) => {

  try {
    dispatch(setAppStatusAC({status: "loading"}))
    const res = await todolistAPI.createTodolist(title)
    if (res.data.resultCode === 0) {
      dispatch(addTodolistAC({todolist: res.data.data.item}))
      dispatch(setAppStatusAC({status: "succeeded"}))
    } else {
      handleServerAppError(res.data, dispatch)
    }
  } catch (error) {
    handleServerNetworkError(error as { message: string }, dispatch)
  }
}

export const deleteTodolistsTC = (todolistId: string) => async (dispatch: Dispatch) => {
  try {
    dispatch(changeTodolistEntityStatusAC({todolistId: todolistId, todolistStatus: "loading"}))
    dispatch(setAppStatusAC({status: "loading"}))
    const res = await todolistAPI.deleteTodolist(todolistId)
    if (res.data.resultCode === 0) {
      dispatch(removeTodolistAC({todolistId: todolistId}))
      dispatch(setAppStatusAC({status: "succeeded"}))
    } else {
      handleServerAppError(res.data, dispatch)
    }
  } catch (error) {
    handleServerNetworkError(error as { message: string }, dispatch)
  }
}

// types

export type FilterValuesType = "all" | "active" | "completed";
//
// export type TodolistsActionsType =
//     RemoveTodolistActionType
//     | AddTodolistActionType
//     | ChangeTodolistTitleActionType
//     | SetTodolistActionType
//     | ChangeTodolistFilterActionType
//     | ChangeTodolistEntityStatusType;
// TodolistType from server and field "filter"
export type TodoListDomainType = TodolistType
  & {
  filter: FilterValuesType
  todolistStatus: RequestStatusType
}