import React, { useState } from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import {action} from "@storybook/addon-actions"
import {Task} from '../state/Task';
import AppWithRedux from "../AppWithRedux";
import {Provider} from "react-redux";
import {store} from "../state/store";
import {ReduxStoreProviderDecorator} from "../state/ReduxStoreProviderDecorator";


export default {
   title: 'TODOlist/AppWithRedux',// название
   component: AppWithRedux,  // имя компоненты
   decorators: [ReduxStoreProviderDecorator],
   argTypes: {
   
   }
   
   
} as ComponentMeta<typeof Task>;


const Template: ComponentStory<typeof AppWithRedux> = (args) => <AppWithRedux/>


export const AppWithReduxStory = Template.bind({});
AppWithReduxStory.args = {};

