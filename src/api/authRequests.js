import axios from "axios"

const ServerUrl = process.env.REACT_APP_SERVER_URL

const API = axios.create({baseURL: ServerUrl})

export const signup = (formData) => API.post('/api/auth/signup', formData)

export const login = (formData) => API.post('/api/auth/login', formData)