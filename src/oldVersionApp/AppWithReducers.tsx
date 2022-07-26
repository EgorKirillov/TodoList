import React, { useReducer } from 'react';
import '../App.css';
import {TaskType, Todolist} from '../components/Todolist';
import {v1} from 'uuid';
import {AddItemForm} from '../components/AddItemForm';
import {AppBar, IconButton, Typography, Button, Toolbar, Container, Grid, Paper} from '@material-ui/core';
import Menu from '@material-ui/icons/Add';
import {
   
   changeTodolistFilterAC,
   removeTodolistAC,
   changeTodolistTitleAC, addTodolistAC, todolistsReducer
} from "../state/todolists-reducer";
import {removeTaskAC, tasksReducer, addTaskAC, changeTaskStatusAC, changeTaskTitleAC} from '../state/tasks-reducer';

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
      dispatchToTasks(removeTaskAC(id,todolistId))
   }
   
   function addTask(title: string, todolistId: string) {
      dispatchToTasks(addTaskAC(title,todolistId))
   }
   
   function changeStatus(id: string, isDone: boolean, todolistId: string) {
      dispatchToTasks(changeTaskStatusAC(id,isDone,todolistId))
   }
   
   function changeTaskTitle(id: string, newTitle: string, todolistId: string) {
      dispatchToTasks(changeTaskTitleAC(id,newTitle,todolistId))
   }
   
   function changeFilter(value: FilterValuesType, todolistId: string) {
      dispatchToTodoList(changeTodolistFilterAC(todolistId,value))
   }
   
   function removeTodolist(id: string) {
      let action=removeTodolistAC(id)
      dispatchToTodoList(action)
      dispatchToTasks(action)
   }
   
   function changeTodolistTitle(id: string, title: string) {
      dispatchToTodoList(changeTodolistTitleAC(id,title))
   }
   
   function addTodolist(title: string) {
      let action=addTodolistAC(title)
      dispatchToTodoList(action)
      dispatchToTasks(action)
   }
   
   let todolistId1 = v1();
   let todolistId2 = v1();

   let [todolists, dispatchToTodoList] = useReducer(todolistsReducer,[
      {id: todolistId1, title: "What to learn", filter: "all"},
      {id: todolistId2, title: "What to buy", filter: "all"}
   ]);
   
   let [tasks, dispatchToTasks] = useReducer(tasksReducer,{
      [todolistId1]: [
         {id: v1(), title: "HTML&CSS", isDone: true},
         {id: v1(), title: "JS", isDone: true}
      ],
      [todolistId2]: [
         {id: v1(), title: "Milk", isDone: true},
         {id: v1(), title: "React Book", isDone: true}
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
                    tasksForTodolist = allTodolistTasks.filter(t => t.isDone === false);
                 }
                 if (tl.filter === "completed") {
                    tasksForTodolist = allTodolistTasks.filter(t => t.isDone === true);
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
