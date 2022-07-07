import { tasksReducer } from './tasks-reducer'
import { todolistsReducer } from './todolists-reducer'
import { combineReducers, compose, legacy_createStore as createStore } from 'redux'

declare global {
   interface Window { // необходимо для работы расширения Redux
      __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
   }
}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;// необходимо для работы расширения Redux
// непосредственно создаём store
//export const store = legacy_createStore(rootReducer, composeEnhancers());


// объединяя reducer-ы с помощью combineReducers,
// мы задаём структуру нашего единственного объекта-состояния
const rootReducer = combineReducers({
   tasks: tasksReducer,
   todolists: todolistsReducer
})

// непосредственно создаём store
export const store = createStore(rootReducer, composeEnhancers())

// определить автоматически тип всего объекта состояния
export type AppRootStateType = ReturnType<typeof rootReducer>


// а это, чтобы можно было в консоли браузера обращаться к store в любой момент
// @ts-ignore
window.store = store