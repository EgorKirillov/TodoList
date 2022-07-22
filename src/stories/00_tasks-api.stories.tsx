import React, {useEffect, useState} from 'react'
import {taskAPI, TaskType} from "../api/00_task-api";

export default {
    title: 'API/Tasks00'
}

const todolistID = "ba3db19b-c28f-4e07-8c16-c02b21dca9cc"
const taskID = "9264c786-ff32-4f87-bfa8-0f5afa4f5e74" // for change title
const newTaskTitle = "new task sec" + String(new Date().getSeconds())

export const GetTasks = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        taskAPI.getTasks(todolistID).then((res) => {
            setState(res.data);
        })
    }, [])
    return <div> {JSON.stringify(state)}
        {state && state.items && state.items.map((t: TaskType) => {
            return <>
                <div>
                    <hr/>
                </div>
                <div>title: {t.title}</div>
                <div>id: {t.id}</div>
                <div>complited?: {t.status ? "true" : "false"} </div>
                <div>
                    <hr/>
                </div>
            </>
        })}
    </div>
}
export const CreateTask = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        taskAPI.createTask(todolistID, newTaskTitle)
            .then((res) => {
                setState(res.data);
            })
        
    }, [])
    return <div> {JSON.stringify(state)}</div>
}
export const DeleteTask = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        taskAPI.deleteTask(todolistID, '3f363770-19f7-4b0a-b884-8a41ea1fb121')
            .then((res) => {
                setState(res.data);
            })
    }, [])
    return <div> {JSON.stringify(state)}</div>
}
export const UpdateTaskTitle = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        taskAPI.updateTask(todolistID, taskID, newTaskTitle)
            .then((res) => {
                setState(res.data)
            })
        
    }, [])
    
    return <div> {JSON.stringify(state)}</div>
}
export const UpdateTaskStatusOnTrue = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        taskAPI.changeTaskStatusTrue(todolistID, taskID, 'REACT change status')
            .then((res) => {
                setState(res.data)
            })
        
    }, [])
    
    return <div> {JSON.stringify(state)}</div>
}
export const UpdateTaskStatusOnFalse = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        taskAPI.changeTaskStatusFalse(todolistID, taskID, 'REACT change status')
            .then((res) => {
                setState(res.data)
            })
    }, [])
    return <div> {JSON.stringify(state)}</div>
}
