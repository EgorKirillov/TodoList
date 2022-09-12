import {todolistAPI, TodolistType} from "../api/00_todolist-api";
import {Dispatch} from "redux";
import {RequestStatusType, setAppStatusAC} from "./app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../utils/error-utils";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";

//thunks

export const fetchTodolistsTC = createAsyncThunk(
  'todolists/fetchTodolist',
  async (args, {dispatch, rejectWithValue}) => {
    try {
      dispatch(setAppStatusAC({status: "loading"}))
      const res = await todolistAPI.getTodolists()
      dispatch(setAppStatusAC({status: "succeeded"}))
      return {todolists: res.data}
    } catch (error) {
      handleServerNetworkError(error as { message: string }, dispatch)
      return rejectWithValue(null)
    }
  })


//slice
const slice = createSlice({
  name: 'todolists',
  initialState: [] as TodoListDomainType[],
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
      return action.payload.todolists.map(td => ({...td, filter: "all", todolistStatus: "idle"}))
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchTodolistsTC.fulfilled, (state, action) => {
        console.log(action.payload)
       return action.payload.todolists.map(td => ({...td, filter: "all", todolistStatus: "idle"}))
      })
  }
  
})

// reducer
export const todolistsReducer = slice.reducer
export const {
  removeTodolistAC, addTodolistAC,
  changeTodolistTitleAC, changeTodolistFilterAC,
  changeTodolistEntityStatusAC, setTodolistAC
} = slice.actions


// thunk creators

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
export type TodoListDomainType = TodolistType & {
  filter: FilterValuesType
  todolistStatus: RequestStatusType
}