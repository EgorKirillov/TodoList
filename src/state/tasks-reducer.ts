import {v1} from 'uuid';
import {TaskStatuses, TaskType} from '../api/00_task-api';
import {AddTodolistActionType, RemoveTodolistActionType} from "./todolists-reducer";

export type RemoveTaskActionType = ReturnType<typeof removeTaskAC>
export type AddTaskActionType = ReturnType<typeof addTaskAC>
export type ChangeTaskStatusActionType = ReturnType<typeof changeTaskStatusAC>
export type changeTaskTitleActionType = ReturnType<typeof changeTaskTitleAC>

type ActionsType =
    RemoveTaskActionType
    | AddTaskActionType
    | ChangeTaskStatusActionType
    | changeTaskTitleActionType
    | AddTodolistActionType
    | RemoveTodolistActionType;

type TasksStateType = {
    [key: string]: Array<TaskType>;
}

const initialState: TasksStateType = {} as TasksStateType

export const tasksReducer = (state: TasksStateType = initialState, action: ActionsType): TasksStateType => {
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
                [action.todolistID]: [{
                    description: "",
                    title: action.title,
                    //completed: false
                    status: 0,
                    priority: 0,
                    startDate: "",
                    deadline: "",
                    id: v1(),
                    todoListId: action.todolistID,
                    order: 0,
                    addedDate: "",
                }, ...state[action.todolistID]]
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
                [action.todolistID]:[]
            }
        }
        case 'REMOVE-TODOLIST': {
            let stateCopy = {...state}
            delete stateCopy[action.id]
            return stateCopy
        }
        default:
            return state
    }
}

export const removeTaskAC = (taskID: string, todolistID: string) => {
    return {type: 'REMOVE-TASK', taskID, todolistID} as const
}
export const addTaskAC = (title: string, todolistID: string) => {
    return {type: 'ADD-TASK', title, todolistID} as const
}
export const changeTaskStatusAC = (taskID: string, status: TaskStatuses, todolistID: string) => {
    return {type: 'CHANGE-TASK-STATUS', taskID, status, todolistID} as const
}
export const changeTaskTitleAC = (taskID: string, title: string, todolistID: string) => {
    return {type: 'CHANGE-TASK-TITLE', taskID, title, todolistID} as const
}





