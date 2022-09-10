import { Dispatch } from 'redux';
import {ResponseType} from "../api/00_todolist-api";
import { setAppErrorAC, setAppStatusAC} from '../state/app-reducer';
import {AxiosError} from "axios";

// generic function
export const handleServerAppError = <T>(data: ResponseType<T>, dispatch: Dispatch) => {
    if (data.messages.length) {
        dispatch(setAppErrorAC({error: data.messages[0]}))
    } else {
        dispatch(setAppErrorAC({error: 'Some error occurred'}))
    }
    dispatch(setAppStatusAC({status:'failed'}))
}

export const handleServerNetworkError = (error:AxiosError | { message: string }, dispatch: Dispatch) => {
    dispatch(setAppErrorAC({error: error.message ? error.message : "some unknown error"}))
    dispatch(setAppStatusAC({status: 'failed'}))
}

