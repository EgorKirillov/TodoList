import React, {useEffect} from 'react';
import {AddItemForm} from './AddItemForm';
import {EditableSpan} from './EditableSpan';
import {Button, List} from "@material-ui/core"
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import {Task} from "./Task";
import {TaskStatuses, TaskType} from "../api/00_task-api";
import {FilterValuesType} from "../state/todolists-reducer";
import {fetchTasksTC} from "../state/tasks-reducer";
import {useAppDispatch} from "../app/hooks";


type PropsType = {
    id: string
    title: string
    tasks: Array<TaskType>
    changeFilter: (value: FilterValuesType, todolistId: string) => void
    addTask: (title: string, todolistId: string) => void
    removeTodolist: (id: string) => void
    changeTodolistTitle: (id: string, newTitle: string) => void
    filter: FilterValuesType
   // changeTaskTitle: (taskId: string, newTitle: string, todolistId: string) => void
}

export const Todolist = React.memo((props: PropsType) => {
    const dispatch = useAppDispatch()

    const addTask = (title: string) => {
        props.addTask(title, props.id);
    }
    
    const removeTodolist = () => {
        props.removeTodolist(props.id);
    }
    const changeTodolistTitle = (title: string) => {
        props.changeTodolistTitle(props.id, title);
    }
    
    const onAllClickHandler = () => props.changeFilter("all", props.id);
    const onActiveClickHandler = () => props.changeFilter("active", props.id);
    const onCompletedClickHandler = () => props.changeFilter("completed", props.id);
    
    let tasksForTodolist = props.tasks
    if (props.filter === "active") {
        tasksForTodolist = tasksForTodolist.filter(t => t.status === TaskStatuses.New);
    }
    if (props.filter === "completed") {
        tasksForTodolist = tasksForTodolist.filter(t => t.status === TaskStatuses.Complited);
    }
    useEffect(() => {
        dispatch(fetchTasksTC(props.id))
    }, [dispatch,props.id])
    
    return <div>
        <h3><EditableSpan value={props.title} onChange={changeTodolistTitle}/>
            <Button onClick={removeTodolist}><DeleteForeverIcon fontSize={"small"}/></Button>
        </h3>
        <AddItemForm addItem={addTask}/>
        <List>
            {
                tasksForTodolist.map(t => {
                    return <Task task={t}
                                 todolistID={props.id}/>
                })
            }
        </List>
        <div>
            <Button variant={"contained"} color={props.filter === 'all' ? "primary" : "default"} size={"small"}
                    disableElevation className={props.filter === 'all' ? "active-filter" : ""}
                    onClick={onAllClickHandler}>All
            </Button>
            <Button variant={"contained"} color={props.filter === 'active' ? "primary" : "default"} size={"small"}
                    disableElevation className={props.filter === 'active' ? "active-filter" : ""}
                    onClick={onActiveClickHandler}>Active
            </Button>
            <Button variant={"contained"} color={props.filter === 'completed' ? "primary" : "default"} size={"small"}
                    disableElevation className={props.filter === 'completed' ? "active-filter" : ""}
                    onClick={onCompletedClickHandler}>Completed
            </Button>
        </div>
    </div>
})




