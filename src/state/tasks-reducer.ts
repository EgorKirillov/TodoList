import {taskAPI, TaskStatuses, TaskType, UpdateTaskModelType} from '../api/00_task-api';
import {
  addTodolistAC,
  changeTodolistEntityStatusAC, removeTodolistAC,
  setTodolistAC,
} from "./todolists-reducer";
import {Dispatch} from 'redux';
import {createUpdatedTask} from '../utils/utils';
import {RequestStatusType, setAppStatusAC} from "./app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../utils/error-utils";
import axios, {AxiosError} from 'axios';
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {TodolistType} from "../api/00_todolist-api";


export const fetchTasksTC = createAsyncThunk(
  'task/fetchTasksTC',
  async (todolistId: string, thunkAPI) => {
    try {
      thunkAPI.dispatch(setAppStatusAC({status: "loading"}))
      const res = await taskAPI.getTasks(todolistId)
      const tasks: TaskType[] = res.data.items
      // thunkAPI.dispatch(setTasksAC({tasks, todolistID: todolistId}))
      thunkAPI.dispatch(setAppStatusAC({status: "succeeded"}))
      return {tasks, todolistID: todolistId}
    } catch (error) {
      handleServerNetworkError(error as { message: string }, thunkAPI.dispatch)
    }
  })

export const removeTasksTC = createAsyncThunk(
  'task/removeTasksTC',
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

const slice = createSlice({
  name: 'task',
  initialState: {} as TasksStateType,
  reducers: {
    // _removeTaskAC(state, action: PayloadAction<{ taskID: string, todolistID: string }>) {
    //   state[action.payload.todolistID] = state[action.payload.todolistID].filter((t) => (t.id !== action.payload.taskID))
    // },
    removeAllTasksAC(state, action: PayloadAction<{}>) {
      return {}
    },
    addTaskAC(state, action: PayloadAction<{ task: TaskType, todolistID: string }>) {
      state[action.payload.todolistID].unshift(action.payload.task)
    },
    setTasksAC(state, action: PayloadAction<{ tasks: TaskType[], todolistID: string }>) {
      state[action.payload.todolistID] = action.payload.tasks
    },
    updateTaskAC(state, action: PayloadAction<{ taskId: string, taskModel: UpdateTaskModelType, todolistID: string }>) {
      state[action.payload.todolistID].forEach(t => t.id === action.payload.taskId ? {...t, ...action.payload.taskModel} : t)
    },
    updateTaskLoadingStatusAC(state, action: PayloadAction<{ taskId: string, todolistID: string, taskLoadingStatus: RequestStatusType }>) {
      state[action.payload.todolistID]
        .forEach(t => t.id === action.payload.taskId ? {...t, taskLoadingStatus: action.payload.taskLoadingStatus} : t)
    },
  },
  // можно так
  // extraReducers: {
  // [addTodolistAC.type](state: TasksStateType, action: PayloadAction<{ todolist: TodolistType }>) {
  //   state[action.payload.todolist.id] = []
  // },
  // [removeTodolistAC.type](state: TasksStateType, action: PayloadAction<{ todolistId: string }>) {
  //   delete state[action.payload.todolistId]
  // },
  // [setTodolistAC.type](state: TasksStateType, action: PayloadAction<{ todolists: TodolistType[] }>) {
  //   action.payload.todolists.forEach(td => {
  //     state[td.id] = []
  //   })
  // },
  //
  // }

  // лучше так
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


  },

})


//reducer
export const tasksReducer = slice.reducer
export const {
  // removeTaskAC,
  removeAllTasksAC,
  addTaskAC,
  // setTasksAC,
  updateTaskAC,
  updateTaskLoadingStatusAC
} = slice.actions


// thunk creators
export const _fetchTasksTC = (todolistId: string) => async (dispatch: Dispatch) => {
  // try {
  //   dispatch(setAppStatusAC({status: "loading"}))
  //   const res = await taskAPI.getTasks(todolistId)
  //   const tasks: TaskType[] = res.data.items
  //   dispatch(setTasksAC({tasks, todolistID: todolistId}))
  //   dispatch(setAppStatusAC({status: "succeeded"}))
  // } catch (error) {
  //   handleServerNetworkError(error as { message: string }, dispatch)
  // }
}
export const _removeTasksTC = (taskId: string, todolistId: string) => async (dispatch: Dispatch) => {
  // try {
  //   dispatch(updateTaskLoadingStatusAC({taskId: taskId, todolistID: todolistId, taskLoadingStatus: 'loading'}))
  //   dispatch(setAppStatusAC({status: "loading"}))
  //   const res = await taskAPI.deleteTask(taskId, todolistId)
  //   if (res.data.resultCode === 0) {
  //     dispatch(removeTaskAC({taskID: taskId, todolistID: todolistId}))
  //     dispatch(setAppStatusAC({status: "succeeded"}))
  //   } else {
  //     handleServerAppError(res.data, dispatch)
  //   }
  // } catch (error) {
  //   handleServerNetworkError(error as { message: string }, dispatch)
  // } finally {
  //   dispatch(updateTaskLoadingStatusAC({taskId: taskId, todolistID: todolistId, taskLoadingStatus: "idle"}))
  // }
}

export const addTasksTC = (todolistID: string, title: string) => async (dispatch: Dispatch) => {
  try {
    dispatch(changeTodolistEntityStatusAC({todolistId: todolistID, todolistStatus: "loading"}))
    dispatch(setAppStatusAC({status: "loading"}))
    // make Error property of undefined, title<30
    // let trt=title[30]
    // let aa=trt.length
    const res = await taskAPI.createTask(todolistID, title)
    if (res.data.resultCode === 0) {
      dispatch(addTaskAC({task: res.data.data.item, todolistID: todolistID}))
      dispatch(setAppStatusAC({status: "succeeded"}))
    } else {
      handleServerAppError(res.data, dispatch)
    }
  } catch (error) {
    handleServerNetworkError(error as { message: string }, dispatch)
  } finally {
    dispatch(changeTodolistEntityStatusAC({todolistId: todolistID, todolistStatus: "idle"}))
  }

}
export const updateTaskStatusTC = (taskId: string, todolistId: string, status: TaskStatuses) => {
  return (dispatch: Dispatch, getState: () => any/*AppRootStateType*/) => {
    // find task by id
    const task = getState().tasks[todolistId].find((t: TaskType) => {
      return t.id === taskId
    })
    if (task) {
      //create a task using api example
      const updatedTask = createUpdatedTask(task)
      updatedTask.status = status
      dispatch(updateTaskLoadingStatusAC({taskLoadingStatus: "loading", taskId: taskId, todolistID: todolistId}))
      dispatch(setAppStatusAC({status: "loading"}))
      taskAPI.updateTask(todolistId, taskId, updatedTask).then((res) => {
        if (res.data.resultCode === 0) {
          // console.log(updatedTask.status, res.data.
          dispatch(updateTaskAC({taskId: taskId, todolistID: todolistId, taskModel: updatedTask}))
          dispatch(setAppStatusAC({status: "succeeded"}))
        } else {
          handleServerAppError(res.data, dispatch)
        }
      }).catch((e) => {
        const err = e as AxiosError | Error
        if (axios.isAxiosError(err)) {
          const error = err.response?.data
            ? (err.response.data as ({ error: string })).error
            : err.message
          handleServerNetworkError({message: error}, dispatch)
        } else {
          handleServerNetworkError(err as Error, dispatch)
        }
      }).finally(() => {
        dispatch(updateTaskLoadingStatusAC({taskId: taskId, taskLoadingStatus: 'idle', todolistID: todolistId}))
      })
    }
  }
}
export const updateTaskTitleTC = (taskId: string, todolistId: string, title: string) => {
  return (dispatch: Dispatch, getState: () => any/*AppRootStateType*/) => {
    // find task by id
    const task = getState().tasks[todolistId].find((t: TaskType) => {
      return t.id === taskId
    })
    if (task) {
      //create a task using api example
      const updatedTask = createUpdatedTask(task)
      updatedTask.title = title

      dispatch(setAppStatusAC({status: "loading"}))
      taskAPI.updateTask(todolistId, taskId, updatedTask).then((res) => {
        if (res.data.resultCode === 0) {
          dispatch(updateTaskAC({taskId: taskId, todolistID: todolistId, taskModel: updatedTask}))
          dispatch(setAppStatusAC({status: "succeeded"}))
        } else {
          handleServerAppError(res.data, dispatch)
        }
      }).catch((e) => {
        const err = e as AxiosError | Error
        if (axios.isAxiosError(err)) {
          const error = err.response?.data
            ? (err.response.data as ({ error: string })).error
            : err.message
          handleServerNetworkError({message: error}, dispatch)
        } else {
          handleServerNetworkError(err as Error, dispatch)
        }
      })
    }
  }
}


//types
export type TaskDomainType = // add utils keys
  TaskType & {
  taskLoadingStatus?: RequestStatusType
}

type TasksStateType = {
  [key: string]: Array<TaskDomainType>;
}


