

const initialState = {
    status: 'loading' as RequestStatusType,
    error: "ERROR" as TextErrorType
}



export const appReducer = (state: InitialStateType = initialState, action: AppStatusActionsType): InitialStateType => {
    switch (action.type) {
        case 'APP/SET-STATUS':
            return {...state, status: action.status}
        case "APP/SET-ERROR" :
            return {...state, error: action.error}
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

//types
export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
export type TextErrorType = string | null
type InitialStateType = typeof initialState

export type AppStatusActionsType =
     ReturnType<typeof setAppStatusAC>
    | ReturnType<typeof setAppErrorAC>