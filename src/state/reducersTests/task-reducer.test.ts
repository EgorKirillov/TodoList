import {TasksStateType} from '../../oldVersionApp/App';
import {addTaskAC, removeTaskAC, tasksReducer, updateTaskAC} from '../tasks-reducer';
import {addTodolistAC} from "../todolists-reducer";
import {TaskPriorities, TaskStatuses} from "../../api/00_task-api";
import {createUpdatedTask} from "../../utils/utils";

let startState: TasksStateType

beforeEach(() => {
    startState = {
        'todolistId1': [
            {
                id: '1',
                title: 'CSS',
                status: TaskStatuses.New,
                description: "",
                order: 0,
                addedDate: "",
                deadline: "",
                startDate: "",
                todoListId: 'todolistId1',
                priority: TaskPriorities.Low
            },
            {
                id: '2',
                title: 'JS',
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
                id: '3',
                title: 'React',
                status: TaskStatuses.New,
                description: "",
                order: 0,
                addedDate: "",
                deadline: "",
                startDate: "",
                todoListId: 'todolistId1',
                priority: TaskPriorities.Low
            }
        ],
        'todolistId2': [
            {
                id: '1',
                title: 'bread',
                status: TaskStatuses.New,
                description: "",
                order: 0,
                addedDate: "",
                deadline: "",
                startDate: "",
                todoListId: 'todolistId2',
                priority: TaskPriorities.Low
            },
            {
                id: '2',
                title: 'milk',
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
                id: '3',
                title: 'tea',
                status: TaskStatuses.New,
                description: "",
                order: 0,
                addedDate: "",
                deadline: "",
                startDate: "",
                todoListId: 'todolistId2',
                priority: TaskPriorities.Low
            }
        ]
    }
})

test('correct task should be deleted from correct array', () => {
    
    
    const action = removeTaskAC('2', 'todolistId2')
    const endState = tasksReducer(startState, action)
    
    expect(endState).toEqual({
        'todolistId1': [
            {
                id: '1',
                title: 'CSS',
                status: TaskStatuses.New,
                description: "",
                order: 0,
                addedDate: "",
                deadline: "",
                startDate: "",
                todoListId: 'todolistId1',
                priority: TaskPriorities.Low
            },
            {
                id: '2',
                title: 'JS',
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
                id: '3',
                title: 'React',
                status: TaskStatuses.New,
                description: "",
                order: 0,
                addedDate: "",
                deadline: "",
                startDate: "",
                todoListId: 'todolistId1',
                priority: TaskPriorities.Low
            }
        ],
        'todolistId2': [
            {
                id: '1',
                title: 'bread',
                status: TaskStatuses.New,
                description: "",
                order: 0,
                addedDate: "",
                deadline: "",
                startDate: "",
                todoListId: 'todolistId2',
                priority: TaskPriorities.Low
            },
            {
                id: '3',
                title: 'tea',
                status: TaskStatuses.New,
                description: "",
                order: 0,
                addedDate: "",
                deadline: "",
                startDate: "",
                todoListId: 'todolistId2',
                priority: TaskPriorities.Low
            }
        ]
    })
})

test('correct task should be added to correct array', () => {
    const newTask = {
        id: '1',
        title: 'juce',
        status: TaskStatuses.New,
        description: "",
        order: 0,
        addedDate: "",
        deadline: "",
        startDate: "",
        todoListId: 'todolistId2',
        priority: TaskPriorities.Low
    }
    const action = addTaskAC(newTask, 'todolistId2')
    const endState = tasksReducer(startState, action)
    
    expect(endState['todolistId1'].length).toBe(3)
    expect(endState['todolistId2'].length).toBe(4)
    expect(endState['todolistId2'][0].id).toBeDefined()
    expect(endState['todolistId2'][0].title).toBe('juce')
    expect(endState['todolistId2'][0].status).toBe(TaskStatuses.New)
})

test('status of specified task should be changed', () => {
    
    const updatedTask = createUpdatedTask({
        id: '2',
        title: 'milk',
        status: TaskStatuses.Complited,
        description: "",
        order: 0,
        addedDate: "",
        deadline: "",
        startDate: "",
        todoListId: 'todolistId2',
        priority: TaskPriorities.Low
    })
    updatedTask.status = TaskStatuses.New
    const action = updateTaskAC('2', updatedTask, 'todolistId2')
    
    const endState = tasksReducer(startState, action)
    
    expect(endState['todolistId2'][1].status).toBe(TaskStatuses.New)
    expect(endState['todolistId1'][1].status).toBe(TaskStatuses.Complited)
})

test('title of specified task should be changed', () => {
    
    const updatedTask = createUpdatedTask({
        id: '2',
        title: 'milk',
        status: TaskStatuses.Complited,
        description: "",
        order: 0,
        addedDate: "",
        deadline: "",
        startDate: "",
        todoListId: 'todolistId2',
        priority: TaskPriorities.Low
    })
    updatedTask.title = 'beer'
    
    let endState = tasksReducer(startState, updateTaskAC('2', updatedTask, 'todolistId2'))
    
    expect(endState['todolistId2'][1].title).toBe('beer')
    expect(endState['todolistId1'][1].title).toBe('JS')
    
    const updatedTask1 = createUpdatedTask({
        id: '3',
        title: 'React',
        status: TaskStatuses.New,
        description: "",
        order: 0,
        addedDate: "",
        deadline: "",
        startDate: "",
        todoListId: 'todolistId1',
        priority: TaskPriorities.Low
    })
    updatedTask1.title = 'Ract-Redux'
    endState = tasksReducer(startState, updateTaskAC('3', updatedTask1, 'todolistId1'))
    
    expect(endState['todolistId1'][2].title).toBe('Ract-Redux')
    expect(endState['todolistId2'][2].title).toBe('tea')
})

test('new array should be added when new todolist is added', () => {
    
    const action = addTodolistAC({id: 'todolistId3', title: "What to learn", order: 0, addedDate: ""})
    const endState = tasksReducer(startState, action)
    const keys = Object.keys(endState)
    const newKey = keys.find(k => k !== 'todolistId1' && k !== 'todolistId2')
    if (!newKey) {
        throw Error('new key should be added')
    }
    
    expect(keys.length).toBe(3)
    expect(endState[newKey]).toEqual([])
})
