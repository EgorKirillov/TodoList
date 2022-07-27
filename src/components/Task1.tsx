import React, {ChangeEvent, memo} from 'react';
import {Checkbox, IconButton, ListItem} from "@material-ui/core";
import {EditableSpan} from "./EditableSpan";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import {useDispatch} from "react-redux";
import {changeTaskStatusAC, changeTaskTitleAC, removeTaskAC} from "../state/tasks-reducer";
import {TaskStatuses, TaskType} from "../api/00_task-api";

type TaskPropsType = {
    task: TaskType
    todolistID: string
}

export const Task1 = memo(({task, todolistID}: TaskPropsType) => {
    console.log("task1")
    const dispatch = useDispatch()
    
    const onClickHandler = () => dispatch(removeTaskAC(task.id, todolistID))
    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        let newIsDoneValue = e.currentTarget.checked;
        dispatch(changeTaskStatusAC(task.id, newIsDoneValue ? TaskStatuses.Complited : TaskStatuses.New, todolistID));
    }
    const onTitleChangeHandler = (newTitle: string) => {
        dispatch(changeTaskTitleAC(task.id, newTitle, todolistID));
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
