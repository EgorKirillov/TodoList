import axios from 'axios'

export enum TaskStatuses { New, InProgress, Complited, Draft,}

export enum TaskPriorities {Low, Middle, Hi, Urgently, Later}

export type TaskType = {
    description: string
    title: string
    //completed: boolean
    status: TaskStatuses
    priority: TaskPriorities
    startDate: string //Date
    deadline: string //Date
    id: string
    todoListId: string
    order: number
    addedDate: string //Date
}
type GetTaskResponseType = {
    items: Array<TaskType>
    totalCount: number
    error: string
}

export type TaskResponseType<D = { item: TaskType }> = {
    resultCode: number
    messages: Array<string>
    data: D
}
const instance = axios.create({
    baseURL: 'https://social-network.samuraijs.com/api/1.1/',
    withCredentials: true,
    headers: {
        'API-KEY': '4f6e1a9b-a442-4dac-9b05-ef297eadf4f8'
    }
})
export const taskAPI = {
    getTasks(todolistID: string) {
        return instance.get<GetTaskResponseType>(`todo-lists/${todolistID}/tasks`)
    },
    createTask(todolistID: string, title: string) {
        return instance.post<TaskResponseType>(`todo-lists/${todolistID}/tasks`, {title: title})
    },
    deleteTask(todolistId: string, taskID: string) {
        return instance.delete<TaskResponseType<{}>>(`todo-lists/${todolistId}/tasks/${taskID}`)
    },
    updateTask(todolistId: string, taskID: string, title: string) {
        return instance.put<TaskResponseType>(`todo-lists/${todolistId}/tasks/${taskID}`, {title: title})
    },
    changeTaskStatusTrue(todolistId: string, taskID: string, title: string) {
        return instance.put<TaskResponseType>(`todo-lists/${todolistId}/tasks/${taskID}`, {
            title: title,
            status: true
        })
    },
    changeTaskStatusFalse(todolistId: string, taskID: string, title: string) {
        return instance.put<TaskResponseType>(`todo-lists/${todolistId}/tasks/${taskID}`, {
            title: title,
            status: false
        })
    }
}