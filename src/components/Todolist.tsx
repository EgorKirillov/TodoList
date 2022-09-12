import React, {memo, useCallback, useEffect} from 'react';

import {useAppDispatch, useAppSelector} from "../app/hooks";
import {RequestStatusType} from "../state/app-reducer";
import {TaskStatuses, TaskType} from "../api/00_task-api";
import {
  changeTodolistFilterAC,
  changeTodolistsTitleTC,
  deleteTodolistsTC,
  FilterValuesType
} from "../state/todolists-reducer";
import {addTasksTC, fetchTasksTC} from "../state/tasks-reducer";

import {Task} from "./Task";
import {AddItemForm} from './AddItemForm';
import {EditableSpan} from './EditableSpan';

import {Button, List} from "@material-ui/core"
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';

type PropsType = {
  id: string
  title: string
  filter: FilterValuesType
  todolistStatus: RequestStatusType
}

export const Todolist = memo((props: PropsType) => {
  const tasks: TaskType[] = useAppSelector(state => state.tasks[props.id])
  const dispatch = useAppDispatch()
  
  const addTask = useCallback((title: string) => {
    dispatch(addTasksTC({todolistId: props.id, title}))
  }, [dispatch, props.id])
  
  const removeTodolist = useCallback(() => {
    dispatch(deleteTodolistsTC(props.id))
  }, [dispatch, props.id])
  
  const changeTodolistTitle = useCallback((title: string) => {
    dispatch(changeTodolistsTitleTC({todolistId: props.id, title}))
  }, [dispatch, props.id])
  
  const changeFilter = useCallback((value: FilterValuesType) => {
    dispatch(changeTodolistFilterAC({todolistId: props.id, filter: value}))
  }, [dispatch, props.id])
  
  let tasksForTodolist = tasks
  if (props.filter === "active") {
    tasksForTodolist = tasksForTodolist.filter(t => t.status === TaskStatuses.New);
  } else if (props.filter === "completed") {
    tasksForTodolist = tasksForTodolist.filter(t => t.status === TaskStatuses.Complited);
  }
  
  useEffect(() => {
    dispatch(fetchTasksTC(props.id))
  }, [dispatch, props.id])
  
  return <div>
    <h3>
      <EditableSpan value={props.title} onChange={changeTodolistTitle}/>
      <Button onClick={removeTodolist} disabled={props.todolistStatus === "loading"}>
        <DeleteForeverIcon fontSize={"small"}/>
      </Button>
    </h3>
    
    <AddItemForm addItem={addTask} disabled={props.todolistStatus === "loading"}/>
    
    <List>
      {tasksForTodolist?.map(t => {
        return <Task task={t}
                     todolistID={props.id}
                     todolistStatus={props.todolistStatus}
        />
      })
      }
    </List>
    
    <div>
      <Button key={'allFilterButton'} variant={"contained"} color={props.filter === 'all' ? "primary" : "default"} size={"small"}
              disableElevation className={props.filter === 'all' ? "active-filter" : ""}
              onClick={() => changeFilter("all")}>All
      </Button>
      <Button key={'activeFilterButton'} variant={"contained"} color={props.filter === 'active' ? "primary" : "default"} size={"small"}
              disableElevation className={props.filter === 'active' ? "active-filter" : ""}
              onClick={() => changeFilter("active")}>Active
      </Button>
      <Button key={'complitedFilterButton'} variant={"contained"} color={props.filter === 'completed' ? "primary" : "default"} size={"small"}
              disableElevation className={props.filter === 'completed' ? "active-filter" : ""}
              onClick={() => changeFilter("completed")}>Completed
      </Button>
    </div>
  </div>
})




