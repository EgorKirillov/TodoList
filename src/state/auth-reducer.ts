import {Dispatch} from 'redux'
import {setAppStatusAC, setIsInitializedAC} from "./app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../utils/error-utils";
// import {AppThunk} from "./store";
import {authAPI} from '../api/00_auth-api';
import {setTodolistAC} from "./todolists-reducer";
import {removeAllTasksAC} from "./tasks-reducer";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState = {
  isLoggedIn: false
}
const slice = createSlice({
  name: 'auth',
  initialState: initialState,
  reducers: {
    setIsLoggedInAC(state, action: PayloadAction<{ value: boolean }>) {
      state.isLoggedIn = action.payload.value
    }
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
export const loginTC = (email: string, password: string, rememberMe: boolean, captcha: boolean) => async (dispatch: Dispatch) => {
  try {
    dispatch(setAppStatusAC({status: "loading"}))
    const res = await authAPI.login(email, password, rememberMe, captcha)
    if (res.data.resultCode === 0) {
      dispatch(setIsLoggedInAC({value: true}))
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
        dispatch(setIsLoggedInAC({value: false}))
        dispatch(setTodolistAC([]))
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
      dispatch(setIsLoggedInAC({value: true}));

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