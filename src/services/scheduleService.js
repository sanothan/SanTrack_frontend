import api from './api';

export const scheduleService = {
    getSchedules: async () => {
        const response = await api.get('/schedules');
        return response.data;
    },

    createSchedule: async (scheduleData) => {
        const response = await api.post('/schedules', scheduleData);
        return response.data;
    },

    updateSchedule: async (id, scheduleData) => {
        const response = await api.patch(`/schedules/${id}`, scheduleData);
        return response.data;
    },

    deleteSchedule: async (id) => {
        const response = await api.delete(`/schedules/${id}`);
        return response.data;
    }
};
