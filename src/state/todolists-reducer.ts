import {todolistAPI, TodolistType} from "../api/00_todolist-api";
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

export const changeTodolistsTitleTC = createAsyncThunk(
  'todolists/changeTodolistTitle',
  async (args: { todolistId: string, title: string }, {dispatch, rejectWithValue}) => {
    try {
      dispatch(changeTodolistEntityStatusAC({todolistId: args.todolistId, todolistStatus: "loading"}))
      dispatch(setAppStatusAC({status: "loading"}))
      const res = await todolistAPI.updateTodolistTitle(args.todolistId, args.title)
      if (res.data.resultCode === 0) {
        dispatch(setAppStatusAC({status: "succeeded"}))
        return {...args}
      } else {
        handleServerAppError(res.data, dispatch)
        return rejectWithValue(null)
      }
    } catch (error) {
      handleServerNetworkError(error as { message: string }, dispatch)
      return rejectWithValue(null)
    } finally {
      dispatch(changeTodolistEntityStatusAC({todolistId: args.todolistId, todolistStatus: 'idle'}))
    }
  })

export const createTodolistsTC = createAsyncThunk(
  'todolists/addTodolist',
  async (title: string, {dispatch, rejectWithValue}) => {
    try {
      dispatch(setAppStatusAC({status: "loading"}))
      const res = await todolistAPI.createTodolist(title)
      if (res.data.resultCode === 0) {
        // dispatch(addTodolistAC({todolist: res.data.data.item}))
        dispatch(setAppStatusAC({status: "succeeded"}))
        return {todolist: res.data.data.item}
      } else {
        handleServerAppError(res.data, dispatch)
        return rejectWithValue(null)
      }
    } catch (error) {
      handleServerNetworkError(error as { message: string }, dispatch)
      return rejectWithValue(null)
    }
  })

export const deleteTodolistsTC = createAsyncThunk(
  'todolists/deleteTodolist',
  async (todolistId: string, {dispatch, rejectWithValue}) => {
    try {
      dispatch(changeTodolistEntityStatusAC({todolistId: todolistId, todolistStatus: "loading"}))
      dispatch(setAppStatusAC({status: "loading"}))
      const res = await todolistAPI.deleteTodolist(todolistId)
      if (res.data.resultCode === 0) {
        dispatch(setAppStatusAC({status: "succeeded"}))
        return {todolistId: todolistId}
      } else {
        handleServerAppError(res.data, dispatch)
        return rejectWithValue(null)
      }
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
        return action.payload.todolists.map(td => ({...td, filter: "all", todolistStatus: "idle"}))
      })
      .addCase(changeTodolistsTitleTC.fulfilled, (state, action) => {
        const index = state.findIndex(tl => tl.id === action.payload.todolistId)
        state[index].title = action.payload.title
      })
      .addCase(createTodolistsTC.fulfilled, (state, action) => {
        state.unshift({...action.payload.todolist, filter: "all", todolistStatus: "idle"})
      })
      .addCase(deleteTodolistsTC.fulfilled, (state, action) => {
        const index = state.findIndex(tl => tl.id === action.payload.todolistId)
        if (index > -1) state.splice(index, 1)
      })
  }
})

// reducer
export const todolistsReducer = slice.reducer
export const {changeTodolistFilterAC, changeTodolistEntityStatusAC, setTodolistAC} = slice.actions


// types
export type FilterValuesType = "all" | "active" | "completed";
export type TodoListDomainType = TodolistType & {
  filter: FilterValuesType
  todolistStatus: RequestStatusType
}