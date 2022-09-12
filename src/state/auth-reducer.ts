import {setAppStatusAC, setIsInitializedAC} from "./app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../utils/error-utils";
import {authAPI} from '../api/00_auth-api';
import {setTodolistAC} from "./todolists-reducer";
import {removeAllTasksAC} from "./tasks-reducer";
import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {AxiosError} from "axios";
import {FieldErrorType} from "../api/00_todolist-api";

export const loginTC = createAsyncThunk<{}, LoginDataType, { rejectValue: { errors: string[], fieldsErrors?: FieldErrorType[] } }>(
  'auth/login',
  async (loginData, thunkApi) => {
    try {
      thunkApi.dispatch(setAppStatusAC({status: "loading"}))
      const res = await authAPI.login(loginData)
      if (res.data.resultCode === 0) {
        thunkApi.dispatch(setAppStatusAC({status: "succeeded"}))
        return;
      } else {
        handleServerAppError(res.data, thunkApi.dispatch)
        return thunkApi.rejectWithValue({errors: res.data.messages, fieldsErrors: res.data.fieldsErrors})
      }
    } catch (err) {
      const error: AxiosError = err as AxiosError
      handleServerNetworkError(error, thunkApi.dispatch)
      return thunkApi.rejectWithValue({errors: [error.message], fieldsErrors: undefined})
    }
  })


export const logoutTC = createAsyncThunk(
  'auth/logout',
  async (args, {dispatch, rejectWithValue}) => {
    try {
      dispatch(setAppStatusAC({status: 'loading'}))
      const res = await authAPI.logout()
      if (res.data.resultCode === 0) {
        dispatch(setTodolistAC({todolists: []}))
        dispatch(removeAllTasksAC())
        dispatch(setAppStatusAC({status: 'succeeded'}))
        return;
      } else {
        handleServerAppError(res.data, dispatch)
        return rejectWithValue(null)
      }
    } catch (err) {
      const error: AxiosError = err as AxiosError
      handleServerNetworkError(error, dispatch)
      return rejectWithValue(null)
    }
  }
)


export const initializeAppTC = createAsyncThunk(
  'auth/me',
  async (args, {dispatch, rejectWithValue}) => {
    try {
      const res = await authAPI.me()
      if (res.data.resultCode === 0) return;
      else {
        handleServerAppError(res.data, dispatch)
        return rejectWithValue(null)
      }
    } catch (err) {
      const error: AxiosError = err as AxiosError
      handleServerNetworkError(error, dispatch)
      return rejectWithValue(null)
    } finally {
      dispatch(setIsInitializedAC({isInitialized: true}));
    }
  }
)


const slice = createSlice({
  name: 'auth',
  initialState: {isLoggedIn: false},
  reducers: {},
  extraReducers: builder => {
    builder.addCase(loginTC.fulfilled, (state) => {
      state.isLoggedIn = true
    })
    builder.addCase(logoutTC.fulfilled, (state) => {
      state.isLoggedIn = false
    })
    builder.addCase(initializeAppTC.fulfilled, (state) => {
      state.isLoggedIn = true
    })
  }
  
})

export const authReducer = slice.reducer

// types
export type LoginDataType = {
  email: string
  password: string
  rememberMe: boolean
  captcha: boolean
}