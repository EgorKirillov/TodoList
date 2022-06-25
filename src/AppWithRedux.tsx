import React from 'react';
import './App.css';
import {TaskType, Todolist} from './Todolist';
import {AddItemForm} from './AddItemForm';
import {AppBar, IconButton, Typography, Button, Toolbar, Container, Grid, Paper} from '@material-ui/core';
import Menu from '@material-ui/icons/Add';
import {
   changeTodolistFilterAC,
   removeTodolistAC,
   changeTodolistTitleAC, addTodolistAC
} from "./state/todolists-reducer";
import {removeTaskAC, addTaskAC, changeTaskStatusAC, changeTaskTitleAC} from './state/tasks-reducer';
import {AppRootStateType} from "./state/store";
import {useDispatch, useSelector} from "react-redux";

export type FilterValuesType = "all" | "active" | "completed";

export type TodolistType = {
   id: string
   title: string
   filter: FilterValuesType
}

export type TasksStateType = {
   [key: string]: Array<TaskType>
}

function App() {
   
   function removeTask(id: string, todolistId: string) {
      let action = removeTaskAC(id, todolistId)
      dispatch(action)
   }
   
   function addTask(title: string, todolistId: string) {
      let action = addTaskAC(title, todolistId)
      dispatch(action)
   }
   
   function changeStatus(id: string, isDone: boolean, todolistId: string) {
      let action = changeTaskStatusAC(id, isDone, todolistId)
      dispatch(action)
   }
   
   function changeTaskTitle(id: string, newTitle: string, todolistId: string) {
      let action = changeTaskTitleAC(id, newTitle, todolistId)
      dispatch(action)
   }
   
   function changeFilter(value: FilterValuesType, todolistId: string) {
      let action = changeTodolistFilterAC(todolistId, value)
      dispatch(action)
   }
   
   function removeTodolist(id: string) {
      let action = removeTodolistAC(id)
      dispatch(action)
      
   }
   
   function changeTodolistTitle(id: string, title: string) {
      let action = changeTodolistTitleAC(id, title)
      dispatch(action)
   }
   
   function addTodolist(title: string) {
      let action = addTodolistAC(title)
      dispatch(action)
      
   }
   
   const todolists = useSelector<AppRootStateType, Array<TodolistType>>(state => state.todolists)
   const tasks = useSelector<AppRootStateType, TasksStateType>(state => state.tasks)
   const dispatch = useDispatch()
   
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
                    tasksForTodolist = allTodolistTasks.filter(t => !t.isDone);
                 }
                 if (tl.filter === "completed") {
                    tasksForTodolist = allTodolistTasks.filter(t => t.isDone );
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
