import axios from 'axios';
import { store } from './store/store.js';
import { logout } from './store/authSlice.js';

// Add request interceptor to the default axios instance
axios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor to the default axios instance
axios.interceptors.response.use(
    (response) => response,
    async (error) => {
        // Check if there's a refresh token AND we got a 401 AND haven't retried yet
        const refreshToken = localStorage.getItem('refreshToken');
        if (error.response?.status === 401 && !error.config._retry && refreshToken) {
            error.config._retry = true;
            try {
                const response = await axios.post('/api/v1/hospitals/refresh-token', {
                    refreshToken
                });
                
                localStorage.setItem('accessToken', response.data.accessToken);
                error.config.headers.Authorization = `Bearer ${response.data.accessToken}`;
                return axios(error.config);
            } catch (refreshError) {
                store.dispatch(logout());
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default axios;