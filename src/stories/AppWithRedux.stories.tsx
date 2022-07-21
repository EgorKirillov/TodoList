import React from 'react';
import {ComponentMeta, ComponentStory} from '@storybook/react';
import AppWithRedux from "../AppWithRedux";
import {ReduxStoreProviderDecorator} from "../state/ReduxStoreProviderDecorator";


export default {
   title: 'TODOlist/AppWithRedux',// название
   component: AppWithRedux,  // имя компоненты
   decorators: [ReduxStoreProviderDecorator],
   argTypes: {
   
   }
   
   
} as ComponentMeta<typeof AppWithRedux>;


const Template: ComponentStory<typeof AppWithRedux> = (args) => <AppWithRedux/>


export const AppWithReduxStory = Template.bind({});
AppWithReduxStory.args = {};

