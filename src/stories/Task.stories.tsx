import React, { useState } from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import {action} from "@storybook/addon-actions"
import {Task} from '../state/Task';


export default {
   title: 'TODOlist/Task',// название
   component: Task,  // имя компоненты
   args: {
      removeTask: action("remove task"),
      changeTaskStatus: action("changeTaskStatus"),
      changeTaskTitle: action("changeTaskTitle"),
   }
   
   
} as ComponentMeta<typeof Task>;


const Template: ComponentStory<typeof Task> = (args) => {
   const [task,setTask] = useState({id: "111", title: "html", isDone: false})
   const changeTaskStatus = () => {setTask({id: "111", title: "html", isDone: !task.isDone})}
   const removeTask = () => {  action("remove task") }
   const changeTaskTitle = (taskId:string, title:string) => { setTask({id: "111", title: title, isDone: task.isDone})}
   
   return <Task task={task} removeTask={removeTask} changeTaskStatus={changeTaskStatus} changeTaskTitle={changeTaskTitle}/>;
}


// образец компоненты

export const TaskIsDoneStory = Template.bind({});  // первая история
// More on args: https://storybook.js.org/docs/react/writing-stories/args
TaskIsDoneStory.args = {
   task: {id: "111", title: "html", isDone: false},
   removeTask: action("remove task"),
};


export const TaskIsNotDoneStory = Template.bind({});  // первая история
// More on args: https://storybook.js.org/docs/react/writing-stories/args
TaskIsNotDoneStory.args = {
   task: {id: "111", title: "html", isDone: true},
};