import React, {useCallback, useEffect} from 'react';
import '../App.css';
import {Todolist} from './Todolist';
import {AddItemForm} from './AddItemForm';
import {Container, Grid, Paper} from '@material-ui/core';
import {TodoListDomainType, fetchTodolistsTC, createTodolistsTC} from "../state/todolists-reducer";
import {AppRootStateType} from "../state/store";
import {useSelector} from "react-redux";
import {useAppDispatch} from "../app/hooks";
import {TaskType} from "../api/00_task-api";
import {useNavigate} from "react-router-dom";

export type TasksStateType = {
    [key: string]: Array<TaskType>
}

function TodolistList() {
    
    const todolists = useSelector<AppRootStateType, Array<TodoListDomainType>>(state => state.todolists)
    const isLoggedIn = useSelector<AppRootStateType, boolean>(state => state.auth.isLoggedIn)
    const dispatch = useAppDispatch()
    const navigate = useNavigate();
    
    const addTodolist = useCallback((title: string) => {
        dispatch(createTodolistsTC(title))
    }, [dispatch])
    
    // если залогинен то запросить тудулисты, есле нет - перенаправить на страницу логинизации
    useEffect(() => {
        if (isLoggedIn) {
            dispatch(fetchTodolistsTC())
        } else {
            navigate("/login")
        }
    }, [dispatch,isLoggedIn,navigate])
    
    return (
        <div className="App">
            <Container fixed={true}>
                <Grid container
                      style={{padding: "15px 0"}}>
                    <AddItemForm addItem={addTodolist} disabled={false}/>
                </Grid>
                <Grid container spacing={3}>
                    {todolists.map(tl => {
                        return (
                            <Grid item
                                  key={tl.id}
                            >
                                <Paper
                                    elevation={8}
                                    style={{padding: "15px"}}
                                ><Todolist
                                    key={tl.id}
                                    id={tl.id}
                                    title={tl.title}
                                    filter={tl.filter}
                                    entityStatus={tl.entityStatus}
                                /></Paper>
                            </Grid>)
                    })}
                </Grid>
            </Container>
        </div>
    );
}

export default TodolistList;
