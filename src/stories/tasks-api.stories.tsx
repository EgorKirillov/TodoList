import axios from 'axios'
import React, {useEffect, useState} from 'react'

export default {
    title: 'API_Tasks'
}

type TaskType = {
    description: string
    title: string
    completed: boolean
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
export type TaskResponseType<D> = {
    resultCode: number
    messages: Array<string>
    data: D
}


const settings = {
    withCredentials: true,
    headers: {
        'API-KEY': '4f6e1a9b-a442-4dac-9b05-ef297eadf4f8'
    },
}

const todolistID="10312211-647b-4cc5-9263-5c40087a1402"
const taskID="592f63a5-1d49-49fc-b166-8a79d5796b92"

export const GetTasks = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        axios.get<GetTaskResponseType>(`https://social-network.samuraijs.com/api/1.1/todo-lists/${todolistID}/tasks`, settings)
            .then((res) => {
                setState(res.data);
            })



    }, [])

    return <div> {JSON.stringify(state)}</div>
}
export const CreateTask = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        axios.post<TaskResponseType<{ item: TaskType }>>(`https://social-network.samuraijs.com/api/1.1/todo-lists/${todolistID}/tasks`, {title: "newTaskTitle"}, settings).then( (res) => {
            setState(res.data);
        } )

    }, [])

    return <div> {JSON.stringify(state)}</div>
}
export const DeleteTask = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        axios.delete<TaskResponseType<{}>>(`https://social-network.samuraijs.com/api/1.1/todo-lists/${todolistID}/tasks/${taskID}`, settings).then( (res) => {
            setState(res.data);
        })

    }, [])

    return <div> {JSON.stringify(state)}</div>
}
export const UpdateTaskTitle = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        axios.put<TaskResponseType<{ item: TaskType }>>(`https://social-network.samuraijs.com/api/1.1/todo-lists/${todolistID}/tasks/${taskID}`, {title: 'REACT==========>>>>>>>>>'}, settings)
            .then((res) => {
                setState(res.data)
            })

    }, [])

    return <div> {JSON.stringify(state)}</div>
}
