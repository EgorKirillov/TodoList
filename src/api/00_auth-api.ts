import { instance } from "./00_api-data"
import {ResponseType} from "./00_todolist-api";
import {LoginDataType} from "../state/auth-reducer";

export const authAPI = {
    
    me() {
        return instance.get<ResponseType>('auth/me')
    },
    login(loginData:LoginDataType) {
        return instance.post<ResponseType<{ userId: number }>>('auth/login', loginData)
    },
    logout() {
        return instance.delete<ResponseType>('auth/login')
    },
}

