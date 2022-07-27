import {TasksStateType} from "../../oldVersionApp/App"
import {addTodolistAC, removeTodolistAC, TodoListDomainType, todolistsReducer} from "../todolists-reducer";
import {tasksReducer} from "../tasks-reducer";
import {TaskPriorities, TaskStatuses} from "../../api/00_task-api";

test('ids should be equals', () => {
    const startTasksState: TasksStateType = {}
    const startTodolistsState: Array<TodoListDomainType> = []
    const action = addTodolistAC('new todolist')
    const endTasksState = tasksReducer(startTasksState, action)
    const endTodolistsState = todolistsReducer(startTodolistsState, action)
    const keys = Object.keys(endTasksState)
    const idFromTasks = keys[0]
    const idFromTodolists = endTodolistsState[0].id
    
    expect(idFromTasks).toBe(action.todolistID)
    expect(idFromTodolists).toBe(action.todolistID)
})

test('property with todolistId should be deleted', () => {
    const startState: TasksStateType = {
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
    
    const action = removeTodolistAC('todolistId2')
    const endState = tasksReducer(startState, action)
    const keys = Object.keys(endState)
    
    expect(keys.length).toBe(1)
    expect(endState['todolistId2']).not.toBeDefined()
})