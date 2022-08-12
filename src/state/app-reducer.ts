

const initialState = {
    status: 'idle' as RequestStatusType,
    error: null as TextErrorType,
    isInitialized: false
}



export const appReducer = (state: InitialStateType = initialState, action: AppReducerActionsType): InitialStateType => {
    switch (action.type) {
        case 'APP/SET-STATUS':
            return {...state, status: action.status}
        case "APP/SET-ERROR" :
            return {...state, error: action.error}
        case "APP/SET-INITAILIZED" :
            return {...state, isInitialized: action.isInitialized}
        default:
            return state
    }
}

// action creators
export const setAppStatusAC  = (status: RequestStatusType) => {
    return {type: 'APP/SET-STATUS', status} as const
}
export const setAppErrorAC  = (error: TextErrorType) => {
    return {type: 'APP/SET-ERROR', error} as const
}
export const setIsInitializedAC  = (isInitialized: boolean) => {
    return {type: 'APP/SET-INITAILIZED', isInitialized} as const
}

// thunk

//types
export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
export type TextErrorType = string | null
type InitialStateType = typeof initialState

export type AppReducerActionsType =
     ReturnType<typeof setAppStatusAC>
    | ReturnType<typeof setAppErrorAC>
    | ReturnType<typeof setIsInitializedAC>
