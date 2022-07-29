import React, {ChangeEvent, memo} from 'react';
import {Checkbox, IconButton, ListItem} from "@material-ui/core";
import {EditableSpan} from "./EditableSpan";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import {removeTasksTC, updateTaskStatusTC, updateTaskTitleTC} from "../state/tasks-reducer";
import {TaskStatuses, TaskType} from "../api/00_task-api";
import {useAppDispatch} from "../app/hooks";

type TaskPropsType = {
    task: TaskType
    todolistID: string
}

export const Task = memo(({task, todolistID}: TaskPropsType) => {
    
    const dispatch = useAppDispatch()
    
    const onClickHandler = () => dispatch(removeTasksTC(task.id, todolistID))
    
    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        let newStatus = e.currentTarget.checked ? TaskStatuses.Complited : TaskStatuses.New;
        dispatch(updateTaskStatusTC(task.id, todolistID, newStatus));
    }
    
    const onTitleChangeHandler = (newTitle: string) => {
        dispatch(updateTaskTitleTC(task.id, todolistID, newTitle));
    }
    
    return (
        <div>
            <ListItem key={task.id} className={task.status === TaskStatuses.Complited ? "is-done" : ""}
                      style={{padding: "0px"}}>
                <Checkbox color={"primary"} onChange={onChangeHandler}
                          checked={task.status === TaskStatuses.Complited}/>
                <EditableSpan value={task.title} onChange={onTitleChangeHandler}/>
                <IconButton onClick={onClickHandler}>
                    <DeleteForeverIcon fontSize={"small"}/>
                </IconButton>
            </ListItem>
        </div>
    );
})

