import React, {ChangeEvent, memo} from 'react';
import {Checkbox, IconButton, ListItem} from "@material-ui/core";
import {EditableSpan} from "./EditableSpan";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import {removeTasksTC, TaskDomainType, updateTaskStatusTC, updateTaskTitleTC} from "../state/tasks-reducer";
import {TaskStatuses} from "../api/00_task-api";
import {useAppDispatch} from "../app/hooks";
import {RequestStatusType} from "../state/app-reducer";

type TaskPropsType = {
    task: TaskDomainType
    todolistID: string
    todolistStatus: RequestStatusType
}

export const Task = memo(({task, todolistID, todolistStatus}: TaskPropsType) => {

    const dispatch = useAppDispatch()
    
    //удаление Task
    const onClickHandler = () => dispatch(removeTasksTC({taskId:task.id, todolistId:todolistID}))
    
    //изменение status
    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        let newStatus = e.currentTarget.checked ? TaskStatuses.Complited : TaskStatuses.New;
        dispatch(updateTaskStatusTC({taskId:task.id, status:newStatus,todolistId:todolistID}));
    }
    
    //изменение Title
    const onTitleChangeHandler = (newTitle: string) => {
        dispatch(updateTaskTitleTC(task.id, todolistID, newTitle));
    }
    
    //при loading тудулиста или таски disable button and EditableSpan
    const isLoading = todolistStatus === "loading" || task.taskLoadingStatus === "loading"
    
    return (
        <div>
            <ListItem key={task.id} className={task.status === TaskStatuses.Complited ? "is-done" : ""}
                      style={{padding: "0px"}}>
                <Checkbox color={"primary"} onChange={onChangeHandler}
                          checked={task.status === TaskStatuses.Complited}/>
                <EditableSpan value={task.title} onChange={onTitleChangeHandler} disableEditMode={isLoading}/>
                <IconButton onClick={onClickHandler} disabled={isLoading}>
                    <DeleteForeverIcon fontSize={"small"}/>
                </IconButton>
            </ListItem>
        </div>
    );
})

