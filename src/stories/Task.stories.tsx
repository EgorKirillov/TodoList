import React, {useState} from 'react';
import {ComponentMeta, ComponentStory} from '@storybook/react';
import {action} from "@storybook/addon-actions"
import {Task} from '../state/Task';


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
   task: {id: "id111", title: "html", isDone: false},
};

export const TaskIsNotDoneStory = Template1.bind({});
TaskIsNotDoneStory.args = {
  ...baseArgs,
 task:  {id: "id111", title: "html", isDone: false}
};


// активная компонента
const Template2: ComponentStory<typeof Task> = (args) => {
   
   const [task, setTask] = useState({id: "id111", title: "html", isDone: false})
   const changeTaskStatus = () => {
      setTask({id: "111", title: "html", isDone: !task.isDone})
   }
   const removeTask = action("remove task id")
   const changeTaskTitle = (taskId: string, title: string) => {
      setTask({id: "111", title: title, isDone: task.isDone})
   }
   
   return <Task task={task} removeTask={removeTask} changeTaskStatus={changeTaskStatus}
                changeTaskTitle={changeTaskTitle}/>;
}


export const TaskStoryChangeble = Template2.bind({});
TaskStoryChangeble.args = {};

