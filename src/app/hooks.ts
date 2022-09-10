import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import {AppDispatchType, AppRootStateType} from '../state/store'
//import type { RootState, AppDispatch } from './store'


// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatchType>()
export const useAppSelector: TypedUseSelectorHook<AppRootStateType> = useSelector