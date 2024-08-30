import axios from "axios"

const ServerUrl = process.env.REACT_APP_SERVER_URL

const API = axios.create({baseURL: ServerUrl})

export const getUserMessages = (id) => {
    const token = JSON.parse(localStorage.getItem('token'))
    return API.get(`/api/message/${id}`, {headers: {token}})
}

export const addMessage = (formData) => {
    const token = JSON.parse(localStorage.getItem('token'))
    return API.post(`/api/message`, formData, {headers: {token}})
}

export const deleteMessage = (messageId) => {
    const token = JSON.parse(localStorage.getItem('token'))
    return API.delete(`/api/message/${messageId}`, {headers: {token}})
}

export const updateMessage = (messageId, formData) => {
    const token = JSON.parse(localStorage.getItem('token'))
    return API.put(`/api/message/${messageId}`, formData, {headers: {token}})
}