import axios from 'axios'

type TaskType = {
    description: string
    title: string
    //completed: boolean
    status: number
    priority: number
    startDate: Date
    deadline: Date
    id: string
    todoListId: string
    order: number
    addedDate: Date
}
type GetTaskResponseType = {
    items: Array<TaskType>
    totalCount: number
    error: string
}
/*type CreateTaskResponseType = {
    resultCode: number
    messages: Array<string>
    data: {
        item: TaskType
    }
}
type UpdateTaskResponseType = {
    resultCode: number
    messages: Array<string>
    data: {
        item: TaskType
    }
}
type DeleteTaskResponseType = {
    resultCode: number
    messages: Array<string>
    data: {}
}*/

export type TaskResponseType<D> = {
    resultCode: number
    messages: Array<string>
    data: D
}
const instance = axios.create({
    baseURL: 'https://social-network.samuraijs.com/api/1.1/',
    withCredentials: true,
    headers: {
        // Не забываем заменить API-KEY на собственный
        'API-KEY': '4f6e1a9b-a442-4dac-9b05-ef297eadf4f8'
    }
})
export const taskAPI = {
    getTasks(todolistID: string) {
        return instance.get<GetTaskResponseType>(`todo-lists/${todolistID}/tasks`)
    },
    createTask(todolistID: string, title: string) {
        return instance.post<TaskResponseType<{ item: TaskType }>>(`todo-lists/${todolistID}/tasks`, {title: title})
    },
    deleteTask(todolistId: string, taskID: string) {
        return instance.delete<TaskResponseType<{}>>(`todo-lists/${todolistId}/tasks/${taskID}`)
    },
    updateTask(todolistId: string, taskID: string, title: string) {
        return instance.put<TaskResponseType<{ item: TaskType }>>(`todo-lists/${todolistId}/tasks/${taskID}`, {title: title})
    }
}