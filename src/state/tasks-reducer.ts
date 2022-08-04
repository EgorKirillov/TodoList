import {taskAPI, TaskStatuses, TaskType, UpdateTaskModelType} from '../api/00_task-api';
import {AddTodolistActionType} from "./todolists-reducer";
import {AppActionType, AppRootStateType} from "./store";
import {Dispatch} from 'redux';
import {createUpdatedTask} from '../utils/utils';
import {setAppErrorAC, setAppStatusAC} from "./app-reducer";

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
    dispatch(setAppStatusAC("loading"))
    const res = await taskAPI.getTasks(todolistId)
    const tasks: TaskType[] = res.data.items
    dispatch(setTasksAC(tasks, todolistId))
    dispatch(setAppStatusAC("succeeded"))
}
export const removeTasksTC = (taskId: string, todolistId: string) => async (dispatch: Dispatch) => {
    dispatch(setAppStatusAC("loading"))
    await taskAPI.deleteTask(taskId, todolistId)
    dispatch(removeTaskAC(taskId, todolistId))
    dispatch(setAppStatusAC("succeeded"))
}
export const addTasksTC = (todolistID: string, title: string) => async (dispatch: Dispatch) => {
    dispatch(setAppStatusAC("loading"))
    try {
        const res = await taskAPI.createTask(todolistID, title)
        if (res.data.resultCode === 0) {
            const newTask: TaskType = res.data.data.item
            dispatch(addTaskAC(newTask, todolistID))
            dispatch(setAppStatusAC("succeeded"))
        } else if (res.data.messages.length) {
            dispatch(setAppErrorAC(res.data.messages[0]))
        } else {
            dispatch(setAppErrorAC('Some error occurred'))
        }
        dispatch(setAppStatusAC('failed'))
    } catch (err) {
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
            taskAPI.updateTask(todolistId, taskId, updatedTask).then(() => {
                dispatch(updateTaskAC(taskId, updatedTask, todolistId))
                dispatch(setAppStatusAC("succeeded"))
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
            taskAPI.updateTask(todolistId, taskId, updatedTask).then(() => {
                dispatch(updateTaskAC(taskId, updatedTask, todolistId))
                dispatch(setAppStatusAC("succeeded"))
            })
        }
    }
}

