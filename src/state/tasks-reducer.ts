import {taskAPI, TaskStatuses, TaskType, UpdateTaskModelType} from '../api/00_task-api';
import {addTodolistAC, changeTodolistEntityStatusAC, removeTodolistAC, setTodolistAC,} from "./todolists-reducer";
import {createUpdatedTask} from '../utils/utils';
import {RequestStatusType, setAppStatusAC} from "./app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../utils/error-utils";
import axios, {AxiosError} from 'axios';
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {TodolistType} from "../api/00_todolist-api";


export const fetchTasksTC = createAsyncThunk('task/fetchTasksTC',
  async (todolistId: string, thunkAPI) => {
    try {
      thunkAPI.dispatch(setAppStatusAC({status: "loading"}))
      const res = await taskAPI.getTasks(todolistId)
      const tasks: TaskType[] = res.data.items
      thunkAPI.dispatch(setAppStatusAC({status: "succeeded"}))
      return {tasks, todolistID: todolistId}
    } catch (error) {
      handleServerNetworkError(error as { message: string }, thunkAPI.dispatch)
    }
  })

export const removeTasksTC = createAsyncThunk('task/removeTasksTC',
  async (param: { taskId: string, todolistId: string }, thunkAPI) => {
    try {
      thunkAPI.dispatch(updateTaskLoadingStatusAC({
        taskId: param.taskId,
        todolistID: param.todolistId,
        taskLoadingStatus: 'loading'
      }))
      thunkAPI.dispatch(setAppStatusAC({status: "loading"}))
      const res = await taskAPI.deleteTask(param.taskId, param.todolistId)
      if (res.data.resultCode === 0) {
        thunkAPI.dispatch(setAppStatusAC({status: "succeeded"}))
        return {taskID: param.taskId, todolistID: param.todolistId}
      } else {
        handleServerAppError(res.data, thunkAPI.dispatch)
      }
    } catch (error) {
      handleServerNetworkError(error as { message: string }, thunkAPI.dispatch)
    } finally {
      thunkAPI.dispatch(updateTaskLoadingStatusAC({
        taskId: param.taskId,
        todolistID: param.todolistId,
        taskLoadingStatus: "idle"
      }))
    }
  })

export const addTasksTC = createAsyncThunk(
  'task/addTask', async (args:{ todolistID: string, title: string }, {dispatch,  rejectWithValue}) => {
    try {
      dispatch(changeTodolistEntityStatusAC({todolistId: args.todolistID, todolistStatus: "loading"}))
      dispatch(setAppStatusAC({status: "loading"}))
      const res = await taskAPI.createTask(args.todolistID, args.title)
      if (res.data.resultCode === 0) {
        dispatch(setAppStatusAC({status: "succeeded"}))
        return {task: res.data.data.item, todolistID: args.todolistID}
      } else {
        handleServerAppError(res.data, dispatch)
        return rejectWithValue(null)
      }
    } catch (error) {
      handleServerNetworkError(error as { message: string }, dispatch)
      return rejectWithValue(null)
    } finally {
      dispatch(changeTodolistEntityStatusAC({todolistId: args.todolistID, todolistStatus: "idle"}))
    }
  })

export const updateTaskStatusTC = createAsyncThunk<{ taskId: string, todolistID: string, status: TaskStatuses } | undefined,
  { taskId: string, todolistId: string, status: TaskStatuses },
  { state: any }>(
  'task/updateTaskStatus',
  async (args, thunkAPI) => {
    try {
      const task = thunkAPI.getState().tasks[args.todolistId]
        .find((t: TaskType) => t.id === args.taskId)
      if (task) {
        const updatedTask = createUpdatedTask(task)
        updatedTask.status = args.status
        thunkAPI.dispatch(updateTaskLoadingStatusAC({
          taskLoadingStatus: "loading",
          taskId: args.taskId,
          todolistID: args.todolistId
        }))
        thunkAPI.dispatch(setAppStatusAC({status: "loading"}))
        const res = await taskAPI.updateTask(args.todolistId, args.taskId, updatedTask)
        if (res.data.resultCode === 0) {
          thunkAPI.dispatch(setAppStatusAC({status: "succeeded"}))
          return {taskId: args.taskId, todolistID: args.todolistId, status: args.status}
        } else {
          handleServerAppError(res.data, thunkAPI.dispatch)
        }
      }
    } catch (e) {
      const err = e as AxiosError | Error
      if (axios.isAxiosError(err)) {
        const error = err.response?.data
          ? (err.response.data as ({ error: string })).error
          : err.message
        handleServerNetworkError({message: error}, thunkAPI.dispatch)
      } else {
        handleServerNetworkError(err as Error, thunkAPI.dispatch)
      }
      
    } finally {
      thunkAPI.dispatch(updateTaskLoadingStatusAC({
        taskId: args.taskId,
        taskLoadingStatus: 'idle',
        todolistID: args.todolistId
      }))
    }
  }
)
export const updateTaskTitleTC = createAsyncThunk<{ taskId: string, todolistID: string, title: string } | undefined, { taskId: string, todolistId: string, title: string }, { state: any }>
('task/updateTaskTitle',
  async (args, thunkAPI) => {
    try {
      const task = thunkAPI.getState().tasks[args.todolistId].find((t: TaskType) => t.id === args.taskId)
      if (task) {
        const updatedTask = createUpdatedTask(task)
        updatedTask.title = args.title
        
        thunkAPI.dispatch(setAppStatusAC({status: "loading"}))
        
        const res = await taskAPI.updateTask(args.todolistId, args.taskId, updatedTask)
        
        if (res.data.resultCode === 0) {
          // thunkAPI.dispatch(updateTaskAC({taskId: taskId, todolistID: todolistId, taskModel: updatedTask}))
          thunkAPI.dispatch(setAppStatusAC({status: "succeeded"}))
          return {taskId: args.taskId, todolistID: args.todolistId, title: args.title}
        } else {
          handleServerAppError(res.data, thunkAPI.dispatch)
        }
      }
    } catch (e) {
      const err = e as AxiosError | Error
      if (axios.isAxiosError(err)) {
        const error = err.response?.data
          ? (err.response.data as ({ error: string })).error
          : err.message
        handleServerNetworkError({message: error}, thunkAPI.dispatch)
      } else {
        handleServerNetworkError(err as Error, thunkAPI.dispatch)
      }
    }
  })

const slice = createSlice({
  name: 'task',
  initialState: {} as TasksStateType,
  
  reducers: {
    removeAllTasksAC() {
      return {}
    },
    setTasksAC(state, action: PayloadAction<{ tasks: TaskType[], todolistID: string }>) {
      state[action.payload.todolistID] = action.payload.tasks
    },
    updateTaskAC(state, action: PayloadAction<{ taskId: string, taskModel: UpdateTaskModelType, todolistID: string }>) {
      const index = state[action.payload.todolistID].findIndex(t => t.id === action.payload.taskId)
      state[action.payload.todolistID][index] = {...state[action.payload.todolistID][index], ...action.payload.taskModel}
      // forEach не сработал
      // state[action.payload.todolistID].forEach(t => t.id === action.payload.taskId ? {...t, ...action.payload.taskModel} : t)
    },
    updateTaskLoadingStatusAC(state, action: PayloadAction<{ taskId: string, todolistID: string, taskLoadingStatus: RequestStatusType }>) {
      const index = state[action.payload.todolistID].findIndex(t => t.id === action.payload.taskId)
      state[action.payload.todolistID][index].taskLoadingStatus = action.payload.taskLoadingStatus
      //state[action.payload.todolistID].forEach(t => t.id === action.payload.taskId ? {...t, taskLoadingStatus: action.payload.taskLoadingStatus} : t)
    },
  },
  
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasksTC.fulfilled, (state: TasksStateType, action) => {
        if (!!action.payload && !!state[action.payload.todolistID]) {
          state[action.payload.todolistID] = action.payload.tasks
        }
      })
      .addCase(removeTasksTC.fulfilled, (state: TasksStateType, action) => {
        if (!!action) {
          if (!!action.payload) {
            const index = state[action.payload.todolistID].findIndex(t => t.id === (!!action.payload ? action.payload.taskID : ''))
            if (index > -1) state[action.payload.todolistID].splice(index, 1)
            // state[action.payload.todolistID] = state[action.payload.todolistID].filter((t) => (t.id !== action.payload.taskID))
          }
        }
      })
      .addCase(addTasksTC.fulfilled, (state: TasksStateType, action) => {
        state[action.payload.todolistID].unshift(action.payload.task)
      })
      .addCase(setTodolistAC.type, (state: TasksStateType, action: PayloadAction<{ todolists: TodolistType[] }>) => {
        action.payload.todolists.forEach(td => {
          state[td.id] = []
        })
      })
      .addCase(addTodolistAC.type, (state: TasksStateType, action: PayloadAction<{ todolist: TodolistType }>) => {
        state[action.payload.todolist.id] = []
      })
      .addCase(removeTodolistAC.type, (state: TasksStateType, action: PayloadAction<{ todolistId: string }>) => {
        delete state[action.payload.todolistId]
      })
      .addCase(updateTaskStatusTC.fulfilled, (state: any, action) => {
        if (action.payload) {
          const taskID = action.payload.taskId
          const tasks: TaskType[] = state[action.payload.todolistID]
          const index = tasks.findIndex(t => t.id === taskID)
          state[action.payload.todolistID][index].status = action.payload.status
        }
      })
      .addCase(updateTaskTitleTC.fulfilled, (state: any, action) => {
        if (action.payload) {
          const taskID = action.payload.taskId
          const tasks: TaskType[] = state[action.payload.todolistID]
          const index = tasks.findIndex(t => t.id === taskID)
          state[action.payload.todolistID][index].title = action.payload.title
        }
      })
  },
})

//reducer
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
