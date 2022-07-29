import React, {useCallback, useEffect} from 'react';
import '../App.css';
import {Todolist} from './Todolist';
import {AddItemForm} from './AddItemForm';
import {AppBar, IconButton, Typography, Button, Toolbar, Container, Grid, Paper} from '@material-ui/core';
import Menu from '@material-ui/icons/Add';
import {
    changeTodolistFilterAC,
    FilterValuesType,
    TodoListDomainType,
    fetchTodolistsTC, changeTodolistsTitleTC, deleteTodolistsTC, createTodolistsTC
} from "../state/todolists-reducer";
import {addTasksTC,} from '../state/tasks-reducer';
import {AppRootStateType} from "../state/store";
import {useSelector} from "react-redux";
import {TaskType} from "../api/00_task-api";
import {useAppDispatch} from "../app/hooks";


export type TasksStateType = {
    [key: string]: Array<TaskType>
}

function App() {
    
    const todolists = useSelector<AppRootStateType, Array<TodoListDomainType>>(state => state.todolists)
    const tasks = useSelector<AppRootStateType, TasksStateType>(state => state.tasks)
    const dispatch = useAppDispatch()
    
    const addTask = useCallback((title: string, todolistId: string) => {
        dispatch(addTasksTC(todolistId, title))
    }, [dispatch])
    
    // const changeTaskTitle = useCallback((id: string, newTitle: string, todolistId: string) => {
    //     dispatch(changeTaskTitleAC(id, newTitle, todolistId))
    // }, [dispatch])
    
    const changeFilter = useCallback((value: FilterValuesType, todolistId: string) => {
        dispatch(changeTodolistFilterAC(todolistId, value))
    }, [dispatch])
    
    const removeTodolist = useCallback((id: string) => {
        dispatch(deleteTodolistsTC(id))
    }, [dispatch])
    
    const changeTodolistTitle = useCallback((id: string, title: string) => {
        dispatch(changeTodolistsTitleTC(id, title))
    }, [dispatch])
    
    const addTodolist = useCallback((title: string) => {
        dispatch(createTodolistsTC(title))
    }, [dispatch])
    
    useEffect(() => {
        dispatch(fetchTodolistsTC())
    }, [dispatch])
    
    return (
        <div className="App">
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
                                    tasks={tasks[tl.id]}
                                    changeFilter={changeFilter}
                                    addTask={addTask}
                                    filter={tl.filter}
                                    removeTodolist={removeTodolist}
                                   // changeTaskTitle={changeTaskTitle}
                                    changeTodolistTitle={changeTodolistTitle}
                                /></Paper>
                            </Grid>)
                    })}
                </Grid>
            </Container>
        </div>
    );
}

export default App;
