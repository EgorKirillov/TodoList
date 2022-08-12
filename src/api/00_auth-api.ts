import { instance } from "./00_api-data"
import {ResponseType} from "./00_todolist-api";

export const authAPI = {
    
    me() {
        return instance.get<ResponseType>('auth/me')
    },
    login(email: string, password: string, rememberMe: boolean, captcha: boolean) {
        return instance.post<ResponseType<{ userId: number }>>('auth/login', {email, password, rememberMe, captcha})
    },
    logout() {
        return instance.delete<ResponseType>('auth/login')
    },
}

