import {v1} from 'uuid';
import {taskAPI, TaskStatuses, TaskType} from '../api/00_task-api';
import {AddTodolistActionType, RemoveTodolistActionType, SetTodolistActionType} from "./todolists-reducer";
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
export const fetchTasksTC = (todolistId: string) => (dispatch: Dispatch) => {
    taskAPI.getTasks(todolistId)
        .then((res) => {
            const tasks = res.data.items
            dispatch(setTasksAC(tasks, todolistId))
        })
}

export const removeTasksTC = (taskId:string,todolistId: string) => (dispatch: Dispatch) => {
    taskAPI.deleteTask(taskId,todolistId)
        .then((res) => {
            dispatch(removeTaskAC(taskId, todolistId))
        })
}
export const addTasksTC = (todolistID: string, title: string) => (dispatch: Dispatch) => {
    taskAPI.createTask(todolistID,title)
        .then((res) => {
            const newTask:TaskType=res.data.data.item
            dispatch(addTaskAC(newTask, todolistID))
        })
}
export const updateTaskStatusTC = (taskId: string, todolistId: string, status: TaskStatuses) => {
    return (dispatch: Dispatch, getState: () => AppRootStateType) => {

// так как мы обязаны на сервер отправить все св-ва, которые сервер ожидает, а не только
// те, которые мы хотим обновить, соответственно нам нужно в этом месте взять таску целиком  // чтобы у неё отобрать остальные св-ва
        
        const allTasksFromState = getState().tasks;
        const tasksForCurrentTodolist = allTasksFromState[todolistId]
        const task = tasksForCurrentTodolist.find(t => {
            return t.id === taskId
        })
        if (task) {
            taskAPI.updateTask(todolistId, taskId, {
                title: task.title,
                startDate: task.startDate,
                priority: task.priority,
                description: task.description,
                deadline: task.deadline,
                status: status,
                id:task.id,
                order:task.order,
                todoListId:todolistId,
                addedDate:task.addedDate
            }).then(() => {
                const action = changeTaskStatusAC(taskId, status, todolistId)
                dispatch(action)
            })
        }
    }
}
