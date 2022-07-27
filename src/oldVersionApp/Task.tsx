import React, {ChangeEvent, memo} from 'react';
import {Checkbox, IconButton, ListItem} from "@material-ui/core";
import {EditableSpan} from "../components/EditableSpan";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import {TaskStatuses, TaskType} from "../api/00_task-api";

type TaskPropsType = {
    task: TaskType
    removeTask: (taskId: string) => void
    changeTaskStatus: (taskid: string, status: TaskStatuses) => void
    changeTaskTitle: (taskId: string, newTitle: string) => void
}

export const Task = memo(({task, removeTask, changeTaskStatus, changeTaskTitle}: TaskPropsType) => {
    //console.log("task")
    const onClickHandler = () => removeTask(task.id)
    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        let newIsDoneValue = e.currentTarget.checked;
        
        changeTaskStatus(task.id, newIsDoneValue ? TaskStatuses.Complited : TaskStatuses.New);
    }
    const onTitleChangeHandler = (newValue: string) => {
        changeTaskTitle(task.id, newValue);
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
