import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const scheduleService = {
    getSchedules: async () => {
        const response = await axios.get(`${API_URL}/schedules`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        return response.data;
    },

    createSchedule: async (scheduleData) => {
        const response = await axios.post(`${API_URL}/schedules`, scheduleData, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        return response.data;
    },

    updateSchedule: async (id, scheduleData) => {
        const response = await axios.patch(`${API_URL}/schedules/${id}`, scheduleData, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        return response.data;
    },

    deleteSchedule: async (id) => {
        const response = await axios.delete(`${API_URL}/schedules/${id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        return response.data;
    }
};
