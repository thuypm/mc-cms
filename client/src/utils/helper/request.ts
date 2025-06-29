// utils/axiosInstance.ts
import axios from 'axios'
import { REACT_APP_SERVER_API } from 'utils/constants/environment'

const axiosInstance = axios.create({
  baseURL: REACT_APP_SERVER_API || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Gắn token trước mỗi request
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken')
  const branch = localStorage.getItem('branchId')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
    config.headers['x-branch-id'] = branch
  }
  return config
})

export { axiosInstance }
