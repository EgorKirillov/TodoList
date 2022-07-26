import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import {action} from "@storybook/addon-actions"
import { AddItemForm } from '../components/AddItemForm'; //импорт компоненьы


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

export const AddItemFormStory = Template.bind({});
AddItemFormStory.args = {
   addItem: action("clicked add"),
   
};
