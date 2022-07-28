import React, {useCallback, useEffect} from 'react';
import '../App.css';
import {Todolist} from './Todolist';
import {AddItemForm} from './AddItemForm';
import {AppBar, IconButton, Typography, Button, Toolbar, Container, Grid, Paper} from '@material-ui/core';
import Menu from '@material-ui/icons/Add';
import {
    changeTodolistFilterAC,
    removeTodolistAC,
    changeTodolistTitleAC,
    addTodolistAC,
    FilterValuesType,
    TodoListDomainType,
    fetchTodolistsTC
} from "../state/todolists-reducer";
import {
    removeTaskAC,
    addTaskAC,
    changeTaskStatusAC,
    changeTaskTitleAC,
    removeTasksTC,
    addTasksTC, updateTaskStatusTC
} from '../state/tasks-reducer';
import {AppRootStateType} from "../state/store";
import {useDispatch, useSelector} from "react-redux";
import {TaskStatuses, TaskType} from "../api/00_task-api";


export type TasksStateType = {
    [key: string]: Array<TaskType>
}

function App() {
    
    const todolists = useSelector<AppRootStateType, Array<TodoListDomainType>>(state => state.todolists)
    const tasks = useSelector<AppRootStateType, TasksStateType>(state => state.tasks)
    const dispatch = useDispatch()
    
    // const removeTask = useCallback((id: string, todolistId: string) => {
    //     //let action = removeTaskAC(id, todolistId)
    //
    //     // @ts-ignore
    //     dispatch(removeTasksTC(id, todolistId))
    // }, [dispatch])
    
    const addTask = useCallback((title: string, todolistId: string) => {
        //let action = addTaskAC(title, todolistId)
        // @ts-ignore
        dispatch(addTasksTC(todolistId,title))
        
    }, [dispatch])
    
    // const changeStatus = useCallback((id: string, status: TaskStatuses, todolistId: string) => {
    //     let action = changeTaskStatusAC(id, status, todolistId)
    //     // @ts-ignore
    //     dispatch(updateTaskStatusTC(id, todolistId, status))
    // }, [dispatch])
    
    const changeTaskTitle = useCallback((id: string, newTitle: string, todolistId: string) => {
        let action = changeTaskTitleAC(id, newTitle, todolistId)
        dispatch(action)
    }, [dispatch])
    
    const changeFilter = useCallback((value: FilterValuesType, todolistId: string) => {
        let action = changeTodolistFilterAC(todolistId, value)
        dispatch(action)
    }, [dispatch])
    
    const removeTodolist = useCallback((id: string) => {
        let action = removeTodolistAC(id)
        dispatch(action)
        
    }, [dispatch])
    
    const changeTodolistTitle = useCallback((id: string, title: string) => {
        let action = changeTodolistTitleAC(id, title)
        dispatch(action)
    }, [dispatch])
    
    const addTodolist = useCallback((title: string) => {
        let action = addTodolistAC(title)
        dispatch(action)
    }, [dispatch])

    useEffect(() => {
        // @ts-ignore
        dispatch(fetchTodolistsTC())
    }, [])
    
    
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
                                     // removeTask={removeTask} // Task1 use useDispatch
                                    changeFilter={changeFilter}
                                    addTask={addTask}
                                    //changeTaskStatus={changeStatus} // Task1 use useDispatch
                                    filter={tl.filter}
                                    removeTodolist={removeTodolist}
                                    changeTaskTitle={changeTaskTitle}
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
