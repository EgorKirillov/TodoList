import React, {useCallback, useEffect} from 'react';

import {useNavigate} from "react-router-dom";

import {fetchTodolistsTC, createTodolistsTC} from "../state/todolists-reducer";
import {TaskType} from "../api/00_task-api";
import {useAppDispatch, useAppSelector} from "../app/hooks";

import {Todolist} from './Todolist';
import {AddItemForm} from './AddItemForm';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';


export type TasksStateType = {
  [key: string]: Array<TaskType>
}

export const TodolistList = () => {
  
  const todolists = useAppSelector(state => state.todolists)
  const appLoadingStatus = useAppSelector(state => state.app.status)
  const isLoggedIn = useAppSelector(state => state.auth.isLoggedIn)
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
  }, [dispatch, isLoggedIn, navigate])
  
  return (
    <div>
      <Container fixed={true}>
        
        <Grid container style={{padding: "15px 0"}}>
          <AddItemForm addItem={addTodolist} disabled={appLoadingStatus === "loading"}/>
        </Grid>
        
        {todolists.length === 0 && <span>todolists is empty, create todolist</span>}
        
        <Grid container spacing={3}>
          {todolists?.map(tl =>
            <Grid item key={`grid${tl.id}`}>
              <Paper key={`paper${tl.id}`} elevation={8} style={{padding: "15px"}}>
                <Todolist key={tl.id} id={tl.id} title={tl.title}
                          filter={tl.filter} todolistStatus={tl.todolistStatus}/>
              </Paper>
            </Grid>
          )}
        </Grid>
      
      </Container>
    </div>
  )
}

