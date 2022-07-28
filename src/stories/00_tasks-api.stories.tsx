import React, {useEffect, useState} from 'react'
import {taskAPI, TaskPriorities, TaskStatuses, TaskType} from "../api/00_task-api";

export default {
    title: 'API/Tasks00'
}

const todolistID = "44ad9c16-b040-443d-aa20-ddb65fd230e5"
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
        const newTask={ description: "",
            title: newTaskTitle,
            //completed: boolean,
            status: 0,
            priority: 0,
            startDate: "",
            deadline: "",
            id: taskID,
            todoListId: todolistID,
            order: 0,
            addedDate: ""}
        taskAPI.updateTask(todolistID, taskID, newTask) //
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
