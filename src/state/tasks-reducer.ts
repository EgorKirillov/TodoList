import {taskAPI, TaskStatuses, TaskType, UpdateTaskModelType} from '../api/00_task-api';
import {
  AddTodolistActionType,
  changeTodolistEntityStatusAC,
  RemoveTodolistActionType,
  SetTodolistActionType
} from "./todolists-reducer";
import {AppRootStateType} from "./store";
import {Dispatch} from 'redux';
import {createUpdatedTask} from '../utils/utils';
import {RequestStatusType, setAppStatusAC} from "./app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../utils/error-utils";
import axios, {AxiosError} from 'axios';
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {TodolistType} from "../api/00_todolist-api";

//types
// export type RemoveTaskActionType = ReturnType<typeof removeTaskAC>
// export type removeAllTasksActionType = ReturnType<typeof removeAllTasksAC>
// export type AddTaskActionType = ReturnType<typeof addTaskAC>
// export type SetTasksActionType = ReturnType<typeof setTasksAC>
// export type UpdateTaskActionType = ReturnType<typeof updateTaskAC>
// export type updateTaskLoadingStatusActionType = ReturnType<typeof updateTaskLoadingStatusAC>
//
// export type TasksActionsType =
//   RemoveTaskActionType
//   | removeAllTasksActionType
//   | AddTaskActionType
//   | AddTodolistActionType
//   | SetTasksActionType
//   | UpdateTaskActionType
//   | updateTaskLoadingStatusActionType


export type TaskDomainType = // add utils keys
  TaskType & {
  taskLoadingStatus?: RequestStatusType
}

type TasksStateType = {
  [key: string]: Array<TaskDomainType>;
}

const initialState: TasksStateType = {} as TasksStateType

const slice = createSlice({
  name: 'taskReducer',
  initialState: initialState,
  reducers: {
    removeTaskAC(state: TasksStateType, action: PayloadAction<{ taskID: string, todolistID: string }>) {
      state[action.payload.todolistID] = state[action.payload.todolistID].filter((t) => (t.id !== action.payload.taskID))
    }
    ,
    removeAllTasksAC(state: TasksStateType, action: PayloadAction<{}>) {
      state = {}
    },
    addTaskAC(state: TasksStateType, action: PayloadAction<{ task: TaskType, todolistID: string }>) {
      state[action.payload.todolistID].unshift(action.payload.task)
    },
    setTasksAC(state: TasksStateType, action: PayloadAction<{ tasks: TaskType[], todolistID: string }>) {
      state[action.payload.todolistID] = action.payload.tasks
    },
    updateTaskAC(state: TasksStateType, action: PayloadAction<{ taskId: string, taskModel: UpdateTaskModelType, todolistID: string }>) {
      state[action.payload.todolistID].forEach(t => t.id === action.payload.taskId ? {...t, ...action.payload.taskModel} : t)
    },
    updateTaskLoadingStatusAC(state: TasksStateType, action: PayloadAction<{ taskId: string, todolistID: string, taskLoadingStatus: RequestStatusType }>) {
      state[action.payload.todolistID]
        .forEach(t => t.id === action.payload.taskId ? {...t, taskLoadingStatus: action.payload.taskLoadingStatus} : t)
    },
  },
  extraReducers: {
    ['ADD-TODOLIST'](state: TasksStateType, action: PayloadAction<{ todolist: TodolistType }>) {
      console.log("add")
      state[action.payload.todolist.id] = []
    },
    ['REMOVE-TODOLIST'](state: TasksStateType, action: PayloadAction<{ todolistId: string }>) {
      delete state[action.payload.todolistId]
    },
    ['SET-TODOLISTS'](state: TasksStateType, action: { todolists: TodolistType[] }) {
      console.log('set')
      action.todolists.forEach(td => {
        state[td.id] = []
      })
    },

  }
})


//reducer
export const tasksReducer = slice.reducer
export const {
  removeTaskAC,
  removeAllTasksAC,
  addTaskAC,
  setTasksAC,
  updateTaskAC,
  updateTaskLoadingStatusAC
} = slice.actions

// case'REMOVE-TODOLIST':
// {
//   let stateCopy = {...state}
//   delete stateCopy[action.id]
//   return stateCopy
// }
// case'SET-TODOLISTS':
// {
//   let stateCopy = {...state}
//   action.todolists.forEach((td) => {
//     stateCopy[td.id] = []
//   })
//   return stateCopy
// }


// action creators
// export const removeTaskAC = (taskID: string, todolistID: string) => {
//   return {type: 'REMOVE-TASK', taskID, todolistID} as const
// }
// export const removeAllTasksAC = () => {
//   return {type: 'REMOVE-ALL-TASKS'} as const
// }
// export const addTaskAC = (task: TaskType, todolistID: string) => {
//   return {type: 'ADD-TASK', task, todolistID} as const
// }
// export const setTasksAC = (tasks: TaskType[], todolistID: string) => {
//   return {type: 'SET-TASKS', tasks, todolistID} as const
// }
// export const updateTaskAC = (taskId: string, taskModel: UpdateTaskModelType, todolistID: string) => {
//   return {type: 'UPDATE-TASK', taskModel, todolistID, taskId} as const
// }
// export const updateTaskLoadingStatusAC = (taskId: string, todolistID: string, taskLoadingStatus: RequestStatusType) => {
//   return {type: 'CHANGE-TASK-LOADING-STATUS', todolistID, taskId, taskLoadingStatus} as const
// }


// thunk creators
export const fetchTasksTC = (todolistId: string) => async (dispatch: Dispatch) => {
  try {
    dispatch(setAppStatusAC({status: "loading"}))
    const res = await taskAPI.getTasks(todolistId)
    const tasks: TaskType[] = res.data.items
    dispatch(setTasksAC({tasks, todolistID: todolistId}))
    dispatch(setAppStatusAC({status: "succeeded"}))
  } catch (error) {
    handleServerNetworkError(error as { message: string }, dispatch)
  }
}
export const removeTasksTC = (taskId: string, todolistId: string) => async (dispatch: Dispatch) => {
  try {
    dispatch(updateTaskLoadingStatusAC({taskId: taskId, todolistID: todolistId, taskLoadingStatus: 'loading'}))
    dispatch(setAppStatusAC({status: "loading"}))
    const res = await taskAPI.deleteTask(taskId, todolistId)
    if (res.data.resultCode === 0) {
      dispatch(removeTaskAC({taskID: taskId, todolistID: todolistId}))
      dispatch(setAppStatusAC({status: "succeeded"}))
    } else {
      handleServerAppError(res.data, dispatch)
    }
  } catch (error) {
    handleServerNetworkError(error as { message: string }, dispatch)
  } finally {
    dispatch(updateTaskLoadingStatusAC({taskId: taskId, todolistID: todolistId, taskLoadingStatus: "idle"}))
  }
}

export const addTasksTC = (todolistID: string, title: string) => async (dispatch: Dispatch) => {
  try {
    dispatch(changeTodolistEntityStatusAC(todolistID, "loading"))
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
    dispatch(changeTodolistEntityStatusAC(todolistID, "idle"))
  }

}
export const updateTaskStatusTC = (taskId: string, todolistId: string, status: TaskStatuses) => {
  return (dispatch: Dispatch, getState: () => AppRootStateType) => {
    // find task by id
    const task = getState().tasks[todolistId].find(t => {
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
  return (dispatch: Dispatch, getState: () => AppRootStateType) => {
    // find task by id
    const task = getState().tasks[todolistId].find(t => {
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

