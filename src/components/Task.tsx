import React, {ChangeEvent, memo} from 'react';

import {removeTasksTC, TaskDomainType, updateTaskTC} from "../state/tasks-reducer";
import {useAppDispatch} from "../app/hooks";
import {EditableSpan} from "./EditableSpan";
import {TaskStatuses} from "../api/00_task-api";
import {RequestStatusType} from "../state/app-reducer";

import {Checkbox, IconButton, ListItem} from "@material-ui/core";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";

type TaskPropsType = {
  task: TaskDomainType
  todolistID: string
  todolistStatus: RequestStatusType
}

export const Task = memo(({task, todolistID, todolistStatus}: TaskPropsType) => {
  
  const dispatch = useAppDispatch()
  
  const onDeleteTaskClickHandler = () => dispatch(removeTasksTC({taskId: task.id, todolistId: todolistID}))
  
  const onChangeTaskStatusHandler = (e: ChangeEvent<HTMLInputElement>) => {
    let newStatus = e.currentTarget.checked ? TaskStatuses.Complited : TaskStatuses.New;
    dispatch(updateTaskTC({taskId: task.id, model: {status: newStatus}, todolistId: todolistID}));
  }
  
  const onChangeTaskTitleHandler = (newTitle: string) => {
    dispatch(updateTaskTC({taskId: task.id, model: {title: newTitle}, todolistId: todolistID}));
  }
  
  //при loading тудулиста или таски disable button and EditableSpan
  const isLoading = todolistStatus === "loading" || task.taskLoadingStatus === "loading"
  
  return (
    <div>
      <ListItem key={task.id} className={task.status === TaskStatuses.Complited ? "is-done" : ""}
                style={{padding: "0px"}}>
        <Checkbox color={"primary"} onChange={onChangeTaskStatusHandler}
                  checked={task.status === TaskStatuses.Complited}/>
        <EditableSpan value={task.title} onChange={onChangeTaskTitleHandler} disableEditMode={isLoading}/>
        <IconButton onClick={onDeleteTaskClickHandler} disabled={isLoading}>
          <DeleteForeverIcon fontSize={"small"}/>
        </IconButton>
      </ListItem>
    </div>
  );
})

