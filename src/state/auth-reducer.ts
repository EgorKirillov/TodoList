import {Dispatch} from 'redux'
import {setAppStatusAC, setIsInitializedAC} from "./app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../utils/error-utils";
import {authAPI} from '../api/00_auth-api';
import {setTodolistAC} from "./todolists-reducer";
import {removeAllTasksAC} from "./tasks-reducer";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {action} from "@storybook/addon-actions";
import {AxiosError} from "axios";
import {FieldErrorType} from "../api/00_todolist-api";

export const loginTC = createAsyncThunk<{ isLoggedIn: boolean }, LoginDataType, { rejectValue: { fieldsErrors?: FieldErrorType[] } }>(
  'auth/login',
  async (loginData: LoginDataType, thunkApi) => {
    try {
      thunkApi.dispatch(setAppStatusAC({status: "loading"}))
      const res = await authAPI.login(loginData)
      if (res.data.resultCode === 0) {
        thunkApi.dispatch(setAppStatusAC({status: "succeeded"}))
        // thunkApi.dispatch(setIsLoggedInAC({value: true}))
        return {isLoggedIn: true}
      } else {
        handleServerAppError(res.data, thunkApi.dispatch)
        return thunkApi.rejectWithValue({/*errors: res.data.messages,*/ fieldsErrors: res.data.fieldsErrors})
      }
      
    } catch (err) {
      const error: AxiosError = err as AxiosError
      handleServerNetworkError(error, thunkApi.dispatch)
      return thunkApi.rejectWithValue({/*errors: [error.message],*/ fieldsErrors: undefined})
    }
    //   "data": {},
    //   "messages": [
    //   "Enter valid Email"
    // ],
    //   "fieldsErrors": [
    //   {
    //     "field": "email",
    //     "error": "Enter valid Email"
    //   }
    // ],
    //   "resultCode": 1
    //}
    //
    // }
    
  })


const slice = createSlice({
  name: 'auth',
  initialState: {isLoggedIn: false},
  reducers: {
    setIsLoggedInAC(state, action: PayloadAction<{ isLoggedIn: boolean }>) {
      state.isLoggedIn = action.payload.isLoggedIn
    }
  },
  extraReducers: builder => {
    builder.addCase(loginTC.fulfilled, (state, action) => {
      if (action.payload) {
        state.isLoggedIn = action.payload.isLoggedIn
      }
    })
  }
  
})


export const {setIsLoggedInAC} = slice.actions

export const authReducer = slice.reducer
// export const authReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
//     switch (action.type) {
//         case 'login/SET-IS-LOGGED-IN':
//             return {...state, isLoggedIn: action.value}
//         default:
//             return state
//     }
// }
// actions
// export const setIsLoggedInAC = (value: boolean) =>
//     ({type: 'login/SET-IS-LOGGED-IN', value} as const)

// thunks
export const _loginTC = (loginData: LoginDataType) => async (dispatch: Dispatch) => {
  try {
    dispatch(setAppStatusAC({status: "loading"}))
    const res = await authAPI.login(loginData)
    if (res.data.resultCode === 0) {
      dispatch(setIsLoggedInAC({isLoggedIn: true}))
      dispatch(setAppStatusAC({status: "succeeded"}))
    } else {
      handleServerAppError(res.data, dispatch)
    }
  } catch (error) {
    handleServerNetworkError(error as { message: string }, dispatch)
  }
}

export const logoutTC = () => (dispatch: Dispatch) => {
  dispatch(setAppStatusAC({status: 'loading'}))
  authAPI.logout()
    .then(res => {
      if (res.data.resultCode === 0) {
        dispatch(setIsLoggedInAC({isLoggedIn: false}))
        dispatch(setTodolistAC({todolists: []}))
        dispatch(removeAllTasksAC({}))
        
        dispatch(setAppStatusAC({status: 'succeeded'}))
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
      dispatch(setIsLoggedInAC({isLoggedIn: true}));
      
    } else {
    
    }
  }).catch((err) => {
    console.log(err)
  }).finally(() => {
    dispatch(setIsInitializedAC({isInitialized: true}));
    //dispatch(setAppStatusAC("idle"))
    
  })
  
}


// types
//type ActionsType = ReturnType<typeof setIsLoggedInAC>

export type LoginDataType = {
  email: string
  password: string
  rememberMe: boolean
  captcha: boolean
}