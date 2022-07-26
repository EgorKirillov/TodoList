import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';


import { EditableSpan } from '../components/EditableSpan';
import {action} from "@storybook/addon-actions";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'TODOlist/EditableSpan',// название
  component: EditableSpan,  // имя компоненты
  argTypes: { // описываем пропсы или задаем значения жестко
    onClick: { description: 'Buttton inside form clicked',},
    value: {defaultValue: "start value",description: "value of editable dpan"}
  },
} as ComponentMeta<typeof EditableSpan>;


const Template: ComponentStory<typeof EditableSpan> = (args) => <EditableSpan {...args} />;

export const  EditableSpanExample  = Template.bind({});
EditableSpanExample.args = {
  onChange: action('Editable span value changed')
};
