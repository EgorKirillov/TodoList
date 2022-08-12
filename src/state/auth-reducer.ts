import {Dispatch} from 'redux'
import {AppReducerActionsType, setAppStatusAC, setIsInitializedAC} from "./app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../utils/error-utils";
import {AppThunk} from "./store";
import { authAPI } from '../api/00_auth-api';
import {setTodolistAC} from "./todolists-reducer";

const initialState = {
    isLoggedIn: false
}

type InitialStateType = typeof initialState

export const authReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
    switch (action.type) {
        case 'login/SET-IS-LOGGED-IN':
            return {...state, isLoggedIn: action.value}
        default:
            return state
    }
}
// actions
export const setIsLoggedInAC = (value: boolean) =>
    ({type: 'login/SET-IS-LOGGED-IN', value} as const)

// thunks
export const loginTC = (email: string, password: string, rememberMe: boolean, captcha: boolean): AppThunk => async (dispatch: Dispatch<ActionsType>) => {
    try {
        dispatch(setAppStatusAC("loading"))
        const res = await authAPI.login(email, password, rememberMe, captcha)
        if (res.data.resultCode === 0) {
            dispatch(setIsLoggedInAC(true))
            dispatch(setAppStatusAC("succeeded"))
        } else {
            handleServerAppError(res.data, dispatch)
        }
    } catch (error) {
        handleServerNetworkError(error as { message: string }, dispatch)
    }
}

export const logoutTC = () => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC('loading'))
    authAPI.logout()
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(setIsLoggedInAC(false))
                dispatch(setTodolistAC([]))
                dispatch(setAppStatusAC('succeeded'))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch((error) => {
            handleServerNetworkError(error, dispatch)
        })
}

export const initializeAppTC = () => (dispatch: Dispatch) => {
    
    authAPI.me().then(res => {
        //dispatch(setAppStatusAC("loading"))
        if (res.data.resultCode === 0) {
            dispatch(setIsLoggedInAC(true));
            
        } else {
        
        }
    }).catch((err)=>{
        console.log(err)
    }).finally(()=>{
        dispatch(setIsInitializedAC(true));
        //dispatch(setAppStatusAC("idle"))
        
    })
    
}



// types
type ActionsType = ReturnType<typeof setIsLoggedInAC> | AppReducerActionsType