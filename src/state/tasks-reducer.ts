import {taskAPI, TaskStatuses, TaskType, UpdateTaskModelType} from '../api/00_task-api';
import {AddTodolistActionType, changeTodolistEntityStatusAC} from "./todolists-reducer";
import {AppActionType, AppRootStateType} from "./store";
import {Dispatch} from 'redux';
import {createUpdatedTask} from '../utils/utils';
import {setAppStatusAC} from "./app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../utils/error-utils";
import axios, {AxiosError} from 'axios';

//types
export type RemoveTaskActionType = ReturnType<typeof removeTaskAC>
export type AddTaskActionType = ReturnType<typeof addTaskAC>
export type SetTasksActionType = ReturnType<typeof setTasksAC>
export type UpdateTaskActionType = ReturnType<typeof updateTaskAC>

export type TasksActionsType =
    RemoveTaskActionType
    | AddTaskActionType
    | AddTodolistActionType
    | SetTasksActionType
    | UpdateTaskActionType

type TasksStateType = {
    [key: string]: Array<TaskType>;
}

const initialState: TasksStateType = {} as TasksStateType

//reducer
export const tasksReducer = (state: TasksStateType = initialState, action: AppActionType): TasksStateType => {
    switch (action.type) {
        case  "REMOVE-TASK":
            return {...state, [action.todolistID]: state[action.todolistID].filter((t) => (t.id !== action.taskID))}
        case "ADD-TASK":
            return {...state, [action.todolistID]: [action.task, ...state[action.todolistID]]}
        case 'ADD-TODOLIST':
            return {...state, [action.todolist.id]: []}
        case 'REMOVE-TODOLIST': {
            let stateCopy = {...state}
            delete stateCopy[action.id]
            return stateCopy
        }
        case 'SET-TODOLISTS': {
            let stateCopy = {...state}
            action.todolists.forEach((td) => {
                stateCopy[td.id] = []
            })
            return stateCopy
        }
        case  "SET-TASKS": {
            let stateCopy = {...state}
            stateCopy[action.todolistID] = action.tasks
            return stateCopy
        }
        case "UPDATE-TASK":
            return {
                ...state, [action.todolistID]: state[action.todolistID]
                    .map(t => t.id === action.taskId ? {...t, ...action.taskModel} : t)
            }
        default:
            return state
    }
}

// action creators
export const removeTaskAC = (taskID: string, todolistID: string) => {
    return {type: 'REMOVE-TASK', taskID, todolistID} as const
}
export const addTaskAC = (task: TaskType, todolistID: string) => {
    return {type: 'ADD-TASK', task, todolistID} as const
}
export const setTasksAC = (tasks: TaskType[], todolistID: string) => {
    return {type: 'SET-TASKS', tasks, todolistID} as const
}
export const updateTaskAC = (taskId: string, taskModel: UpdateTaskModelType, todolistID: string) => {
    return {type: 'UPDATE-TASK', taskModel, todolistID, taskId} as const
}

// thunk creators
export const fetchTasksTC = (todolistId: string) => async (dispatch: Dispatch) => {
    try {
        dispatch(setAppStatusAC("loading"))
        const res = await taskAPI.getTasks(todolistId)
        const tasks: TaskType[] = res.data.items
        dispatch(setTasksAC(tasks, todolistId))
        dispatch(setAppStatusAC("succeeded"))
    } catch (error) {
        handleServerNetworkError(error as { message: string }, dispatch)
    }
}
export const removeTasksTC = (taskId: string, todolistId: string) => async (dispatch: Dispatch) => {
    try {
        dispatch(setAppStatusAC("loading"))
        const res = await taskAPI.deleteTask(taskId, todolistId)
        if (res.data.resultCode === 0) {
            dispatch(removeTaskAC(taskId, todolistId))
            dispatch(setAppStatusAC("succeeded"))
        } else {
            handleServerAppError(res.data, dispatch)
        }
    }
        
        // catch (e) {
        //     let err = e as AxiosError | Error
        //     if (axios.isAxiosError(err)) {
        //         const error = err.response?.data
        //             ? (err.response.data as ({ error: string })).error
        //             : err.message
        //         handleServerNetworkError({message: error}, dispatch)
        //     }
        //     handleServerNetworkError(err, dispatch)
        // }
    catch (error) {
        handleServerNetworkError(error as { message: string }, dispatch)
    }
}

export const addTasksTC = (todolistID: string, title: string) => async (dispatch: Dispatch) => {
    try {
        dispatch(changeTodolistEntityStatusAC(todolistID, "loading"))
        dispatch(setAppStatusAC("loading"))
        // make Error property of undefined, title<30
        // let trt=title[30]
        // let aa=trt.length
        const res = await taskAPI.createTask(todolistID, title)
        if (res.data.resultCode === 0) {
            dispatch(addTaskAC(res.data.data.item, todolistID))
            dispatch(setAppStatusAC("succeeded"))
        } else {
            handleServerAppError(res.data, dispatch)
        }
    }
        // one way  typing errors
        // catch (e) {
        //     let err = e as AxiosError | Error
        //     if (axios.isAxiosError(err)) {
        //         const error = err.response?.data
        //             ? (err.response.data as ({ error: string })).error
        //             : err.message
        //         handleServerNetworkError({message: error}, dispatch)
        //     }
        //     handleServerNetworkError(err, dispatch)
        // }
        
        //                 another way  typing errors
    catch (error) {
        handleServerNetworkError(error as { message: string }, dispatch)
    }
    finally {
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
            
            dispatch(setAppStatusAC("loading"))
            taskAPI.updateTask(todolistId, taskId, updatedTask).then((res) => {
                if (res.data.resultCode === 0) {
                    dispatch(updateTaskAC(taskId, updatedTask, todolistId))
                    dispatch(setAppStatusAC("succeeded"))
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
            
            dispatch(setAppStatusAC("loading"))
            taskAPI.updateTask(todolistId, taskId, updatedTask).then((res) => {
                if (res.data.resultCode === 0) {
                    dispatch(updateTaskAC(taskId, updatedTask, todolistId))
                    dispatch(setAppStatusAC("succeeded"))
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

