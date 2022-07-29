import React, {useReducer} from 'react';
import '../App.css';
import {Todolist} from '../components/Todolist';
import {v1} from 'uuid';
import {AddItemForm} from '../components/AddItemForm';
import {AppBar, IconButton, Typography, Button, Toolbar, Container, Grid, Paper} from '@material-ui/core';
import Menu from '@material-ui/icons/Add';
import {
    
    changeTodolistFilterAC,
    removeTodolistAC,
    changeTodolistTitleAC, addTodolistAC, todolistsReducer, FilterValuesType
} from "../state/todolists-reducer";
import {tasksReducer, addTaskAC} from '../state/tasks-reducer';
import {TaskPriorities, TaskStatuses, TaskType} from "../api/00_task-api";


export type TasksStateType = {
    [key: string]: Array<TaskType>
}


function App() {
    
    function addTask(title: string, todolistId: string) {
        dispatchToTasks(addTaskAC({title: title} as TaskType, todolistId))
    }
    
    function changeFilter(value: FilterValuesType, todolistId: string) {
        dispatchToTodoList(changeTodolistFilterAC(todolistId, value))
    }
    
    function removeTodolist(id: string) {
        let action = removeTodolistAC(id)
        dispatchToTodoList(action)
        dispatchToTasks(action)
    }
    
    function changeTodolistTitle(id: string, title: string) {
        dispatchToTodoList(changeTodolistTitleAC(id, title))
    }
    
    function addTodolist(title: string) {
        let action = addTodolistAC({id: v1(), title: title, order: 0, addedDate: ""})
        dispatchToTodoList(action)
        dispatchToTasks(action)
    }
    
    let todolistId1 = v1();
    let todolistId2 = v1();
    
    let [todolists, dispatchToTodoList] = useReducer(todolistsReducer, [
        {id: todolistId1, title: "What to learn", filter: "all", order: 0, addedDate: ""},
        {id: todolistId2, title: "What to buy", filter: "all", order: 0, addedDate: ""}
    ]);
    
    let [tasks, dispatchToTasks] = useReducer(tasksReducer, {
        [todolistId1]: [
            {
                id: v1(),
                title: "HTML&CSS",
                status: TaskStatuses.Complited,
                description: "",
                order: 0,
                addedDate: "",
                deadline: "",
                startDate: "",
                todoListId: todolistId1,
                priority: TaskPriorities.Low
            },
            {
                id: v1(),
                title: "JS",
                status: TaskStatuses.Complited,
                description: "",
                order: 0,
                addedDate: "",
                deadline: "",
                startDate: "",
                todoListId: todolistId1,
                priority: TaskPriorities.Low
            }
        ],
        [todolistId2]: [
            {
                id: v1(),
                title: "Milk",
                status: TaskStatuses.Complited,
                description: "",
                order: 0,
                addedDate: "",
                deadline: "",
                startDate: "",
                todoListId: todolistId1,
                priority: TaskPriorities.Low
            },
            {
                id: v1(),
                title: "React Book",
                status: TaskStatuses.Complited,
                description: "",
                order: 0,
                addedDate: "",
                deadline: "",
                startDate: "",
                todoListId: todolistId1,
                priority: TaskPriorities.Low
            }
        ]
    });
    
    
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
                        let allTodolistTasks = tasks[tl.id];
                        let tasksForTodolist = allTodolistTasks;
                        
                        if (tl.filter === "active") {
                            tasksForTodolist = allTodolistTasks.filter(t => t.status === TaskStatuses.New);
                        }
                        if (tl.filter === "completed") {
                            tasksForTodolist = allTodolistTasks.filter(t => t.status === TaskStatuses.Complited);
                        }
                        
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
                                    tasks={tasksForTodolist}
                                    changeFilter={changeFilter}
                                    addTask={addTask}
                                    filter={tl.filter}
                                    removeTodolist={removeTodolist}
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
