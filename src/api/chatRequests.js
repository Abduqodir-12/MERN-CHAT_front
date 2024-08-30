import axios from "axios"

const ServerUrl = process.env.REACT_APP_SERVER_URL

const API = axios.create({baseURL: ServerUrl})

export const getUserChats = () => {
    const token = JSON.parse(localStorage.getItem('token'))
    return API.get(`/api/chat`, {headers: {token}})
}

export const createChat = (firstId, secondId) => {
    const token = JSON.parse(localStorage.getItem('token'))
    return API.get(`/api/chat/${firstId}/${secondId}`, {headers: {token}})
}

export const deleteChat = (chatId) => {
    const token = JSON.parse(localStorage.getItem('token'))
    return API.delete(`/api/chat/${chatId}`, {headers: {token}})
}