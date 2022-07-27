import React, {useState} from 'react';
import '../App.css';
import {Todolist} from '../components/Todolist';
import {v1} from 'uuid';
import {AddItemForm} from '../components/AddItemForm';
import {AppBar, Button, Container, Grid, IconButton, Paper, Toolbar, Typography} from '@material-ui/core';
import Menu from '@material-ui/icons/Add';
import {TaskPriorities, TaskStatuses, TaskType} from "../api/00_task-api";
import {FilterValuesType, TodoListDomainType} from "../state/todolists-reducer";

export type TasksStateType = {
    [key: string]: Array<TaskType>
}

function App() {
    
    function removeTask(id: string, todolistId: string) {
        
        let todolistTasks = tasks[todolistId];
        tasks[todolistId] = todolistTasks.filter(t => t.id !== id);
        setTasks({...tasks});
    }
    
    function addTask(title: string, todolistId: string) {
        let task: TaskType = {
            id: v1(), title: title, status: TaskStatuses.New,
            description: "", order: 0, addedDate: "", deadline: "", startDate: "",
            todoListId: todolistId1, priority: TaskPriorities.Low
        };
        let todolistTasks = tasks[todolistId];
        tasks[todolistId] = [task, ...todolistTasks];
        setTasks({...tasks});
    }
    
    function changeStatus(id: string, status: TaskStatuses, todolistId: string) {
        //достанем нужный массив по todolistId:
        let todolistTasks = tasks[todolistId];
        // найдём нужную таску:
        let task = todolistTasks.find(t => t.id === id);
        //изменим таску, если она нашлась
        if (task) {
            task.status = status;
            // засетаем в стейт копию объекта, чтобы React отреагировал перерисовкой
            setTasks({...tasks});
        }
    } //// added in task-reducer
    
    function changeTaskTitle(id: string, newTitle: string, todolistId: string) {
        //достанем нужный массив по todolistId:
        let todolistTasks = tasks[todolistId];
        // найдём нужную таску:
        let task = todolistTasks.find(t => t.id === id);
        //изменим таску, если она нашлась
        if (task) {
            task.title = newTitle;
            // засетаем в стейт копию объекта, чтобы React отреагировал перерисовкой
            setTasks({...tasks});
        }
    } //// added in task-reducer
    
    
    function changeFilter(value: FilterValuesType, todolistId: string) {
        let todolist = todolists.find(tl => tl.id === todolistId);
        if (todolist) {
            todolist.filter = value;
            setTodolists([...todolists])
        }
    } // added in reducer
    
    function removeTodolist(id: string) {
        setTodolists(todolists.filter(tl => tl.id !== id));
        delete tasks[id]; // удаляем св-во из объекта... значением которого являлся массив тасок
        setTasks({...tasks});
    } // added in reducer
    
    function changeTodolistTitle(id: string, title: string) {
        // найдём нужный todolist
        const todolist = todolists.find(tl => tl.id === id);
        if (todolist) {
            // если нашёлся - изменим ему заголовок
            todolist.title = title;
            setTodolists([...todolists]);
        }
    } // added in reducer
    
    let todolistId1 = v1();
    let todolistId2 = v1();
    
    let [todolists, setTodolists] = useState<Array<TodoListDomainType>>([
        {
            id: todolistId1, title: "What to learn", filter: "all", addedDate: "",
            order: 0,
        },
        {
            id: todolistId2, title: "What to buy", filter: "all", addedDate: "",
            order: 0,
        }
    ])
    
    let [tasks, setTasks] = useState<TasksStateType>({
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
                todoListId: todolistId2,
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
                todoListId: todolistId2,
                priority: TaskPriorities.Low
            }
        ]
    });
    
    function addTodolist(title: string) {
        let newTodolistId = v1();
        let newTodolist: TodoListDomainType = {id: newTodolistId, title: title, filter: 'all', order: 0, addedDate: ""};
        setTodolists([newTodolist, ...todolists]);
        setTasks({
            ...tasks,
            [newTodolistId]: []
        })
    } // added in reducer
    
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
                                    removeTask={removeTask}
                                    changeFilter={changeFilter}
                                    addTask={addTask}
                                    changeTaskStatus={changeStatus}
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
