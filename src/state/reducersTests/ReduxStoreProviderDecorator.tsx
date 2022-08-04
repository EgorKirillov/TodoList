import React from 'react'
import {Provider} from 'react-redux'
import {combineReducers, createStore} from 'redux'
import {v1} from 'uuid'
import {AppRootStateType} from '../store'
import {tasksReducer} from '../tasks-reducer'
import {todolistsReducer} from '../todolists-reducer'
import {TaskPriorities, TaskStatuses} from "../../api/00_task-api";


const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todolistsReducer
})

const initialGlobalState = {
    todolists: [
        {id: 'todolistId1', title: 'What to learn', filter: 'all', addedDate: "", order: 0,entityStatus: "idle"},
        {id: 'todolistId2', title: 'What to buy', filter: 'all', addedDate: "", order: 0,entityStatus: "idle"}
    ],
    tasks: {
        ['todolistId1']: [
            {
                id: v1(),
                title: 'HTML&CSS',
                status: TaskStatuses.Complited,
                description: "",
                order: 0,
                addedDate: "",
                deadline: "",
                startDate: "",
                todoListId: 'todolistId1',
                priority: TaskPriorities.Low
            },
            {
                id: v1(),
                title: 'JS',
                status: TaskStatuses.Complited,
                description: "",
                order: 0,
                addedDate: "",
                deadline: "",
                startDate: "",
                todoListId: 'todolistId1',
                priority: TaskPriorities.Low
            }
        ],
        ['todolistId2']: [
            {
                id: v1(),
                title: 'Milk',
                status: TaskStatuses.Complited,
                description: "",
                order: 0,
                addedDate: "",
                deadline: "",
                startDate: "",
                todoListId: 'todolistId2',
                priority: TaskPriorities.Low
            },
            {
                id: v1(),
                title: 'React Book',
                status: TaskStatuses.Complited,
                description: "",
                order: 0,
                addedDate: "",
                deadline: "",
                startDate: "",
                todoListId: 'todolistId2',
                priority: TaskPriorities.Low
            }
        ]
    },
    app:{
        status:"loading",
        error: ""
    }
    
}

export const storyBookStore = createStore(rootReducer, initialGlobalState as AppRootStateType)

export const ReduxStoreProviderDecorator = (storyFn: any) => (
    <Provider
        store={storyBookStore}>{storyFn()}
    </Provider>)