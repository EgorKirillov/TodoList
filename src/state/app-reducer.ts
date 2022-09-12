import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const slice = createSlice({

  name: 'auth',
  initialState: {
    status: 'idle' as RequestStatusType,
    error: null as TextErrorType,
    isInitialized: false
  },
  reducers: {
    setAppStatusAC(state, action: PayloadAction<{ status: RequestStatusType }>) {
      state.status = action.payload.status
    },

    setAppErrorAC(state, action: PayloadAction<{ error: TextErrorType }>) {
      state.error = action.payload.error
    },

    setIsInitializedAC(state, action: PayloadAction<{ isInitialized: boolean }>) {
      state.isInitialized = action.payload.isInitialized
      },

  }
})

export const {setAppStatusAC, setAppErrorAC, setIsInitializedAC} = slice.actions
export const appReducer = slice.reducer

//types
export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
export type TextErrorType = string | null

