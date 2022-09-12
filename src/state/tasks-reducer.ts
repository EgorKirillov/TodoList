import {taskAPI, TaskStatuses, TaskType} from '../api/00_task-api';
import {
  changeTodolistEntityStatusAC,
  createTodolistsTC, deleteTodolistsTC,
  setTodolistAC,
} from "./todolists-reducer";
import {createUpdatedTask} from '../utils/utils';
import {RequestStatusType, setAppStatusAC} from "./app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../utils/error-utils";
import axios, {AxiosError} from 'axios';
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {TodolistType} from "../api/00_todolist-api";
import {AppRootStateType} from "./store";

//thunks
export const fetchTasksTC = createAsyncThunk('task/fetchTasksTC',
  async (todolistId: string, {dispatch, rejectWithValue}) => {
    try {
      dispatch(setAppStatusAC({status: "loading"}))
      const res = await taskAPI.getTasks(todolistId)
      const tasks: TaskType[] = res.data.items
      dispatch(setAppStatusAC({status: "succeeded"}))
      return {tasks, todolistID: todolistId}
      
    } catch (error) {
      handleServerNetworkError(error as { message: string }, dispatch)
      return rejectWithValue(null)
    }
  })

export const removeTasksTC = createAsyncThunk('task/removeTasksTC',
  async (args: { taskId: string, todolistId: string }, {dispatch, rejectWithValue}) => {
    try {
      dispatch(updateTaskLoadingStatusAC({...args, taskLoadingStatus: 'loading'}))
      dispatch(setAppStatusAC({status: "loading"}))
      
      const res = await taskAPI.deleteTask(args.taskId, args.todolistId)
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
      dispatch(updateTaskLoadingStatusAC({...args, taskLoadingStatus: "idle"}))
    }
  })

export const addTasksTC = createAsyncThunk(
  'task/addTask', async (args: { todolistId: string, title: string }, {dispatch, rejectWithValue}) => {
    try {
      dispatch(changeTodolistEntityStatusAC({todolistId: args.todolistId, todolistStatus: "loading"}))
      dispatch(setAppStatusAC({status: "loading"}))
      const res = await taskAPI.createTask(args.todolistId, args.title)
      if (res.data.resultCode === 0) {
        dispatch(setAppStatusAC({status: "succeeded"}))
        return {task: res.data.data.item, todolistID: args.todolistId}
      } else {
        handleServerAppError(res.data, dispatch)
        return rejectWithValue(null)
      }
      
    } catch (error) {
      handleServerNetworkError(error as { message: string }, dispatch)
      return rejectWithValue(null)
      
    } finally {
      dispatch(changeTodolistEntityStatusAC({todolistId: args.todolistId, todolistStatus: "idle"}))
    }
  })

export const updateTaskTC = createAsyncThunk(
  'task/updateTaskStatus',
  async (args: { taskId: string, todolistId: string, model: { title?: string; status?: TaskStatuses } },
         {dispatch, getState, rejectWithValue}) => {
    try {
      const state = getState() as AppRootStateType
      const tasks = state.tasks as TasksStateType
      const task = tasks[args.todolistId].find(t => t.id === args.taskId)
      
      if (!task) {
        return rejectWithValue('task not found')
      } else {
        const updatedTask = createUpdatedTask(task, args.model)
        dispatch(updateTaskLoadingStatusAC({
          taskLoadingStatus: "loading",
          taskId: args.taskId,
          todolistId: args.todolistId
        }))
        dispatch(setAppStatusAC({status: "loading"}))
        
        const res = await taskAPI.updateTask(args.todolistId, args.taskId, updatedTask)
        if (res.data.resultCode === 0) {
          dispatch(setAppStatusAC({status: "succeeded"}))
          return {taskId: args.taskId, todolistID: args.todolistId, updatedTask}
        } else {
          handleServerAppError(res.data, dispatch)
          return rejectWithValue(null)
        }
      }
      
    } catch (e) {
      const err = e as AxiosError | Error
      if (axios.isAxiosError(err)) {
        const error = err.response?.data
          ? (err.response.data as ({ error: string })).error
          : err.message
        handleServerNetworkError({message: error}, dispatch)
      } else {
        handleServerNetworkError(err as Error, dispatch)
      }
      return rejectWithValue(null)
      
    } finally {
      dispatch(updateTaskLoadingStatusAC({
        taskId: args.taskId,
        taskLoadingStatus: 'idle',
        todolistId: args.todolistId
      }))
    }
  }
)

//slice
const slice = createSlice({
  name: 'task',
  initialState: {} as TasksStateType,
  
  reducers: {
    removeAllTasksAC() {
      return {} as TasksStateType
    },
    updateTaskLoadingStatusAC(state, action: PayloadAction<{ taskId: string, todolistId: string, taskLoadingStatus: RequestStatusType }>) {
      const index = state[action.payload.todolistId].findIndex(t => t.id === action.payload.taskId)
      state[action.payload.todolistId][index].taskLoadingStatus = action.payload.taskLoadingStatus
    },
  },
  
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasksTC.fulfilled, (state: TasksStateType, action) => {
        state[action.payload.todolistID] = action.payload.tasks
      })
      .addCase(removeTasksTC.fulfilled, (state: TasksStateType, action) => {
        const index = state[action.payload.todolistId].findIndex(t => t.id === (!!action.payload ? action.payload.taskId : ''))
        if (index > -1) state[action.payload.todolistId].splice(index, 1)
      })
      .addCase(addTasksTC.fulfilled, (state: TasksStateType, action) => {
        state[action.payload.todolistID].unshift(action.payload.task)
      })
      .addCase(updateTaskTC.fulfilled, (state: TasksStateType, action) => {
        const index = state[action.payload.todolistID].findIndex(t => t.id === action.payload.taskId)
        if (index > -1) {
          state[action.payload.todolistID][index] = {...state[action.payload.todolistID][index], ...action.payload.updatedTask}
        }
      })
      .addCase(setTodolistAC.type, (state: TasksStateType, action: PayloadAction<{ todolists: TodolistType[] }>) => {
        action.payload.todolists.forEach(td => {
          state[td.id] = []
        })
      })
      .addCase(createTodolistsTC.fulfilled, (state: TasksStateType, action: PayloadAction<{ todolist: TodolistType }>) => {
        state[action.payload.todolist.id] = []
      })
      .addCase(deleteTodolistsTC.fulfilled, (state: TasksStateType, action: PayloadAction<{ todolistId: string }>) => {
        delete state[action.payload.todolistId]
      })
  },
})

export const tasksReducer = slice.reducer
export const {removeAllTasksAC, updateTaskLoadingStatusAC} = slice.actions

//types
export type TaskDomainType = // add utils keys
  TaskType & {
  taskLoadingStatus?: RequestStatusType
}

type TasksStateType = {
  [key: string]: Array<TaskDomainType>;
}
