import {taskAPI, TaskStatuses, TaskType, UpdateTaskModelType} from '../api/00_task-api';
import {AddTodolistActionType} from "./todolists-reducer";
import {AppActionType, AppRootStateType} from "./store";
import {Dispatch} from 'redux';

export type RemoveTaskActionType = ReturnType<typeof removeTaskAC>
export type AddTaskActionType = ReturnType<typeof addTaskAC>
export type ChangeTaskStatusActionType = ReturnType<typeof changeTaskStatusAC>
export type changeTaskTitleActionType = ReturnType<typeof changeTaskTitleAC>
export type SetTasksActionType = ReturnType<typeof setTasksAC>


export type TasksActionsType =
    RemoveTaskActionType
    | AddTaskActionType
    | ChangeTaskStatusActionType
    | changeTaskTitleActionType
    | AddTodolistActionType
    | SetTasksActionType


type TasksStateType = {
    [key: string]: Array<TaskType>;
}

const initialState: TasksStateType = {} as TasksStateType

export const tasksReducer = (state: TasksStateType = initialState, action: AppActionType): TasksStateType => {
    switch (action.type) {
        case  "REMOVE-TASK": {
            return {
                ...state,
                [action.todolistID]: state[action.todolistID].filter((t) => (t.id !== action.taskID)),
            }
        }
        case "ADD-TASK": {
            return {
                ...state,
                [action.todolistID]: [action.task, ...state[action.todolistID]]
            }
        }
        case 'CHANGE-TASK-STATUS': {
            return {
                ...state,
                [action.todolistID]: state[action.todolistID]
                    .map(t =>
                        t.id === action.taskID
                            ? {...t, status: action.status}
                            : t
                    )
            }
        }
        case 'CHANGE-TASK-TITLE': {
            return {
                ...state,
                [action.todolistID]: state[action.todolistID]
                    .map(t =>
                        t.id === action.taskID
                            ? {...t, title: action.title}
                            : t
                    )
            }
        }
        case 'ADD-TODOLIST': {
            return {
                ...state,
                [action.todolistID]: []
            }
        }
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
        default:
            return state
    }
}

export const removeTaskAC = (taskID: string, todolistID: string) => {
    return {type: 'REMOVE-TASK', taskID, todolistID} as const
}
export const addTaskAC = (task: TaskType, todolistID: string) => {
    return {type: 'ADD-TASK', task, todolistID} as const
}
export const changeTaskStatusAC = (taskID: string, status: TaskStatuses, todolistID: string) => {
    return {type: 'CHANGE-TASK-STATUS', taskID, status, todolistID} as const
}
export const changeTaskTitleAC = (taskID: string, title: string, todolistID: string) => {
    return {type: 'CHANGE-TASK-TITLE', taskID, title, todolistID} as const
}
export const setTasksAC = (tasks: TaskType[], todolistID: string) => {
    return {type: 'SET-TASKS', tasks, todolistID} as const
}
export const fetchTasksTC = (todolistId: string) => async (dispatch: Dispatch) => {
    const res = await taskAPI.getTasks(todolistId)
    const tasks:TaskType[] = res.data.items
    dispatch(setTasksAC(tasks, todolistId))
}

export const removeTasksTC = (taskId: string, todolistId: string) => async (dispatch: Dispatch) => {
    await taskAPI.deleteTask(taskId, todolistId)
    dispatch(removeTaskAC(taskId, todolistId))
}

export const addTasksTC = (todolistID: string, title: string) => async (dispatch: Dispatch) => {
    const res = await taskAPI.createTask(todolistID, title)
    const newTask: TaskType = res.data.data.item
    dispatch(addTaskAC(newTask, todolistID))
    
}
export const updateTaskStatusTC = (taskId: string, todolistId: string, status: TaskStatuses) => {
    return (dispatch: Dispatch, getState: () => AppRootStateType) => {
        // find task by id
        const task = getState().tasks[todolistId].find(t => {
            return t.id === taskId
        })
        if (task) {
            //create a task using api example
            const updatedTask = {
                title: task.title,
                description: task.description,
                status: status,
                priority: task.priority,
                startDate: task.startDate,
                deadline: task.deadline,
            }
            taskAPI.updateTask(todolistId, taskId, updatedTask).then(() => {
                dispatch(changeTaskStatusAC(taskId, status, todolistId))
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
            const updatedTask: UpdateTaskModelType = {
                title: title,
                description: task.description,
                status: task.status,
                priority: task.priority,
                startDate: task.startDate,
                deadline: task.deadline,
            }
            taskAPI.updateTask(todolistId, taskId, updatedTask).then(() => {
                dispatch(changeTaskTitleAC(taskId, title, todolistId))
            })
        }
    }
}