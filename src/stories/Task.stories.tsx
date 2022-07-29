import React, {useState} from 'react';
import {ComponentMeta, ComponentStory} from '@storybook/react';
import {action} from "@storybook/addon-actions"
import {TaskPriorities, TaskStatuses} from "../api/00_task-api";
import { Task } from '../components/Task';


export default {
    title: 'TODOlist/Task',// название
    component: Task,  // имя компоненты
    
    
    argTypes: {
        task: {
            description: "bla bla bla",
            name: "тут можно поменять имя параметра 'таска'",
            // defaultValue:{id: "id111", title: "html", isDone: false},
            // variant: {
            //    options:[ {id: "id111", title: "html", isDone: false}, {id: "id111", title: "html", isDone: true}],
            //    control:  'object'
            // }
        },
        
    }
} as ComponentMeta<typeof Task>;

const changeTaskStatusCallback = action("statuus changed inside Task")
const removeTaskCallback = action("Task removed")
const changeTaskTitleCallback = action("task title changed inside Task")

const baseArgs = {
    changeTaskStatus: changeTaskStatusCallback,
    removeTask: removeTaskCallback,
    changeTaskTitle: changeTaskTitleCallback,
}


// неактивная компонента
const Template1: ComponentStory<typeof Task> = (args) => <Task {...args}/>

export const TaskIsDoneStory = Template1.bind({});
TaskIsDoneStory.args = {
    ...baseArgs,
    task: {
        id: "id111",
        title: "html",
        status: TaskStatuses.Complited,
        description: "",
        order: 0,
        addedDate: "",
        deadline: "",
        startDate: "",
        todoListId: 'todolistId1',
        priority: TaskPriorities.Low
    },
};

export const TaskIsNotDoneStory = Template1.bind({});
TaskIsNotDoneStory.args = {
    ...baseArgs,
    task: {
        id: "id111",
        title: "html",
        status: TaskStatuses.New,
        description: "",
        order: 0,
        addedDate: "",
        deadline: "",
        startDate: "",
        todoListId: 'todolistId1',
        priority: TaskPriorities.Low
    }
};


// активная компонента
const Template2: ComponentStory<typeof Task> = (args) => {
    
    const [task, setTask] = useState({
        id: "id111",
        title: "html",
        status: TaskStatuses.New,
        description: "",
        order: 0,
        addedDate: "",
        deadline: "",
        startDate: "",
        todoListId: 'todolistId1',
        priority: TaskPriorities.Low
    })
    const changeTaskStatus = () => {
        setTask({
            ...task,
            status: TaskStatuses.New ? TaskStatuses.Complited : TaskStatuses.New,
        })
    }
    const removeTask = action("remove task id")
    const changeTaskTitle = (taskId: string, title: string) => {
        setTask({
            ...task,
            title: title,
        })
    }
    
    return <Task task={task}
                 todolistID={"todolistId1"}/>;
}


export const TaskStoryChangeble = Template2.bind({});
TaskStoryChangeble.args = {};

