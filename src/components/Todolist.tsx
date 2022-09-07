import React, {useCallback, useEffect} from 'react';
import {AddItemForm} from './AddItemForm';
import {EditableSpan} from './EditableSpan';
import {Button, List} from "@material-ui/core"
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import {Task} from "./Task";
import {TaskStatuses, TaskType} from "../api/00_task-api";
import {
    changeTodolistFilterAC,
    changeTodolistsTitleTC,
    deleteTodolistsTC,
    FilterValuesType
} from "../state/todolists-reducer";
import {addTasksTC, fetchTasksTC} from "../state/tasks-reducer";
import {useAppDispatch} from "../app/hooks";
import {useSelector} from "react-redux";
import {AppRootStateType, useAppSelector} from "../state/store";
import {RequestStatusType} from "../state/app-reducer";


type PropsType = {
    id: string
    title: string
    filter: FilterValuesType
    todolistStatus: RequestStatusType
}

export const Todolist = React.memo((props: PropsType) => {
    const tasks = useAppSelector(state => state.tasks[props.id])
    const dispatch = useAppDispatch()
    
    //добавление новой Task
    const addTask = useCallback((title: string) => {
        dispatch(addTasksTC(props.id, title))
    }, [dispatch, props.id])
    
    //удаление Todolist
    const removeTodolist = useCallback(() => {
        dispatch(deleteTodolistsTC(props.id))
    }, [dispatch, props.id])
    
    //изменение Titlе todolist
    const changeTodolistTitle = useCallback((title: string) => {
        dispatch(changeTodolistsTitleTC(props.id, title))
    }, [dispatch, props.id])
    
    //изменение фильтра todolist
    const changeFilter = useCallback((value: FilterValuesType) => {
        dispatch(changeTodolistFilterAC({todolistId:props.id, filter:value}))
    }, [dispatch, props.id])
    
    // применение фильтра к Tasks
    let tasksForTodolist = tasks
    if (props.filter === "active") {
        tasksForTodolist = tasksForTodolist.filter(t => t.status === TaskStatuses.New);
    }
    if (props.filter === "completed") {
        tasksForTodolist = tasksForTodolist.filter(t => t.status === TaskStatuses.Complited);
    }
    
    //подгрузка Tasks с сервера
    useEffect(() => {
        dispatch(fetchTasksTC(props.id))
    }, [dispatch,props.id])
    
    return <div>
        <h3><EditableSpan value={props.title} onChange={changeTodolistTitle}/>
            <Button onClick={removeTodolist} disabled={props.todolistStatus === "loading"}><DeleteForeverIcon
                fontSize={"small"}/></Button>
        </h3>
        <AddItemForm addItem={addTask} disabled={props.todolistStatus === "loading"}/>
        <List>
            {tasksForTodolist.map(t => {
                return <Task task={t}
                             todolistID={props.id}
                             todolistStatus={props.todolistStatus}
                />
            })
            }
        </List>
        <div>
            <Button variant={"contained"} color={props.filter === 'all' ? "primary" : "default"} size={"small"}
                    disableElevation className={props.filter === 'all' ? "active-filter" : ""}
                    onClick={() => changeFilter("all")}>All
            </Button>
            <Button variant={"contained"} color={props.filter === 'active' ? "primary" : "default"} size={"small"}
                    disableElevation className={props.filter === 'active' ? "active-filter" : ""}
                    onClick={() => changeFilter("active")}>Active
            </Button>
            <Button variant={"contained"} color={props.filter === 'completed' ? "primary" : "default"} size={"small"}
                    disableElevation className={props.filter === 'completed' ? "active-filter" : ""}
                    onClick={() => changeFilter("completed")}>Completed
            </Button>
        </div>
    </div>
})




