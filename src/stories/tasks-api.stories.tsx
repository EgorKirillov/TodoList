import axios from 'axios'
import React, {useEffect, useState} from 'react'

export default {
    title: 'API_Tasks'
}

type TaskType = {
    description: string
    title: string
    //completed: boolean
    status: number
    priority: number
    startDate: string
    deadline: string
    id: string
    todoListId: string
    order: number
    addedDate: string
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

const todolistID="7c42c7f2-1cf9-4498-a016-71e28ab1d713"
const taskID="28df0d0d-d975-4978-a3bd-3e4964cce3e2"

export const GetTasks = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        axios.get<GetTaskResponseType>(`https://social-network.samuraijs.com/api/1.1/todo-lists/${todolistID}/tasks`, settings)
            .then((res) => {
                setState(res.data);
            })
    }, [])

    return <div> {JSON.stringify(state)}
        {state && state.items && state.items.map((t: TaskType) => {
            return <>
                <div> <hr/> </div>
                <div>title: {t.title}</div>
                <div>id: {t.id}</div>
                <div>Data: {t.addedDate}</div>
                <div>complited?: {t.status ? "true" : "false"} </div>
                <div> <hr/> </div>
            </>
        })}

       </div>
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
export const UpdateTaskStatusOnTrue = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        axios.put<TaskResponseType<{ item: TaskType }>>(`https://social-network.samuraijs.com/api/1.1/todo-lists/${todolistID}/tasks/${taskID}`, {title: 'REACT change status', status: true }, settings)
            .then((res) => {
                setState(res.data)
            })

    }, [])

    return <div> {JSON.stringify(state)}</div>
}
export const UpdateTaskStatusOnFalse = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        axios.put<TaskResponseType<{ item: TaskType }>>(`https://social-network.samuraijs.com/api/1.1/todo-lists/${todolistID}/tasks/${taskID}`, {title: 'REACT change status', completed: false }, settings)
            .then((res) => {
                setState(res.data)
            })

    }, [])

    return <div> {JSON.stringify(state)}</div>
}
