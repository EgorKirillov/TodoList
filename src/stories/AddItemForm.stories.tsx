import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import {action} from "@storybook/addon-actions"
import { AddItemForm } from '../AddItemForm'; //импорт компоненьы


export default {
   title: 'TODOlist/AddItemForm',// название
   component: AddItemForm,  // имя компоненты
   
   argTypes: { // описываем пропсы или задаем значения жестко
      addItem: {
         discription: 'click inside form'
      },
   },
} as ComponentMeta<typeof AddItemForm>;


const Template: ComponentStory<typeof AddItemForm> = (args) => <AddItemForm {...args} />;  // образец компоненты

export const AddItemFormStory = Template.bind({});  // первая история
// More on args: https://storybook.js.org/docs/react/writing-stories/args
AddItemFormStory.args = {
   addItem: action("clicked inside form"),
   
};
