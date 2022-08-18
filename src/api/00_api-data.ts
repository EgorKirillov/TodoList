import axios from 'axios'

export const instance = axios.create({
    baseURL: 'https://social-network.samuraijs.com/api/1.1/',
    withCredentials: true,
    // headers: {
    //     'API-KEY': '4f6e1a9b-a442-4dac-9b05-ef297eadf4f8'
    // }
})

