import { instance } from "./00_api-data";
import {ResponseType} from "./00_todolist-api";

export const taskAPI = {
    getTasks(todolistID: string) {
        return instance.get<GetTaskResponseType>(`todo-lists/${todolistID}/tasks`)
    },
    createTask(todolistID: string, title: string) {
        return instance.post<ResponseType<{ item: TaskType }>>(`todo-lists/${todolistID}/tasks`, {title: title})
    },
    deleteTask(taskID: string, todolistId: string) {
        return instance.delete<ResponseType>(`todo-lists/${todolistId}/tasks/${taskID}`)
    },
    updateTask(todolistId: string, taskID: string, task: UpdateTaskModelType) {
        return instance.put<ResponseType>(`todo-lists/${todolistId}/tasks/${taskID}`, task)
    },
   
}
// types
export enum TaskStatuses { New, InProgress, Complited, Draft,}
export enum TaskPriorities {Low, Middle, Hi, Urgently, Later}
export type TaskType = {
    description: string
    title: string
    status: TaskStatuses
    priority: TaskPriorities
    startDate: string //Date
    deadline: string //Date
    id: string
    todoListId: string
    order: number
    addedDate: string //Date
}
// Type for update task
export type UpdateTaskModelType = {
    title: string
    description: string
    status: TaskStatuses
    priority: TaskPriorities
    startDate: string
    deadline: string
}
export type GetTaskResponseType = {
    items: Array<TaskType>
    totalCount: number
    error: string | null
}
