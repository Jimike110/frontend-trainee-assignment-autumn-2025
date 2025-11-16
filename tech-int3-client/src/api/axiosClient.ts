import axios from 'axios';

const API_BASE_URL = 'http://192.168.1.241:3001/api/v1'; //import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api/v1';

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
});

export default axiosClient;
