import React, {useCallback, useEffect} from 'react';
import '../App.css';
import {Todolist} from './Todolist';
import {AddItemForm} from './AddItemForm';
import {AppBar, IconButton, Typography, Button, Toolbar, Container, Grid, Paper} from '@material-ui/core';
import Menu from '@material-ui/icons/Add';
import {TodoListDomainType, fetchTodolistsTC, createTodolistsTC} from "../state/todolists-reducer";
import {AppRootStateType} from "../state/store";
import {useSelector} from "react-redux";
import {TaskType} from "../api/00_task-api";
import {useAppDispatch} from "../app/hooks";
import {LinearProgress} from '@mui/material';
import {RequestStatusType} from "../state/app-reducer";
import {ErrorSnackbar} from "./ErrorSnackbar/ErrorSnackbar";


export type TasksStateType = {
    [key: string]: Array<TaskType>
}

function App() {
    
    const todolists = useSelector<AppRootStateType, Array<TodoListDomainType>>(state => state.todolists)
    const status = useSelector<AppRootStateType, RequestStatusType>(state => state.app.status)
    const dispatch = useAppDispatch()
    
    const addTodolist = useCallback((title: string) => {
        dispatch(createTodolistsTC(title))
    }, [dispatch])
    
    useEffect(() => {
        dispatch(fetchTodolistsTC())
    }, [dispatch])
    
    
    return (
        <div className="App">
            <ErrorSnackbar />
            <AppBar position="static">
                <Toolbar style={{justifyContent: "space-between"}}>
                    <IconButton edge="start" color="inherit" aria-label="menu">
                        <Menu/>
                    </IconButton>
                    <Typography variant="h6">
                        Todolists
                    </Typography>
                    <Button color="inherit" variant={"outlined"}>Login</Button>
                </Toolbar>
            </AppBar>
            {status === "loading" && <LinearProgress/>}
            <Container fixed={true}>
                <Grid container
                      style={{padding: "15px 0"}}>
                    <AddItemForm addItem={addTodolist}/>
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

export default App;
