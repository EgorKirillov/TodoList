import { Dispatch } from 'redux';
import {ResponseType} from "../api/00_todolist-api";
import {AppReducerActionsType, setAppErrorAC, setAppStatusAC} from '../state/app-reducer';

// generic function
export const handleServerAppError = <T>(data: ResponseType<T>, dispatch: Dispatch<AppReducerActionsType>) => {
    if (data.messages.length) {
        dispatch(setAppErrorAC(data.messages[0]))
    } else {
        dispatch(setAppErrorAC('Some error occurred'))
    }
    dispatch(setAppStatusAC('failed'))
}

export const handleServerNetworkError = (error: {message: string}, dispatch: Dispatch<AppReducerActionsType>) => {
    dispatch(setAppErrorAC(error.message ? error.message : "some unknown error"))
    dispatch(setAppStatusAC('failed'))
}

