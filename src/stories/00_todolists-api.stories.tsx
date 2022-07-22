import React, {useEffect, useState} from 'react'
import {todolistAPI, TodolistType} from "../api/00_todolist-api";

export default {
    title: 'API/todolist00'
}

export const GetTodolists = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        todolistAPI.getTodolists().then((res) => {
            setState(res.data);
        })
    }, [])
    return <div> {JSON.stringify(state)}
        {state && state.map((td: TodolistType) => {
            return <>
                <div>
                    <hr/>
                </div>
                <div>title: {td.title}</div>
                <div>id: {td.id}</div>
                <div>
                    <hr/>
                </div>
            </>
        })}
    </div>
}
export const CreateTodolist = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        const newTitle = "newTitle todolist"
        todolistAPI.createTodolist(newTitle).then((res) => {
            setState(res.data);
        })
    }, [])
    return <div> {JSON.stringify(state)}</div>
}

export const DeleteTodolist = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        const todolistId = 'd32c072e-74d9-434c-a641-d4bce37522a0';
        todolistAPI.deleteTodolist(todolistId).then((res) => {
            setState(res.data);
        })
    }, [])
    return <div> {JSON.stringify(state)}</div>
}

export const UpdateTodolistTitle = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        const todolistId = 'e83854c7-54d5-42d2-bc1c-59ba7a82c434'
        todolistAPI.updateTodolist(todolistId, "update title")
            .then((res) => {
                setState(res.data)
            })
    }, [])
    return <div> {JSON.stringify(state)}</div>
}
