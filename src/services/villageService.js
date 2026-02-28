import api from './api';

export const villageService = {
    getVillages: async (params) => {
        const response = await api.get('/villages', { params });
        return response.data;
    },

    getVillageById: async (id) => {
        const response = await api.get(`/villages/${id}`);
        return response.data;
    },

    createVillage: async (data) => {
        const response = await api.post('/villages', data);
        return response.data;
    },

    updateVillage: async (id, data) => {
        const response = await api.put(`/villages/${id}`, data);
        return response.data;
    },

    deleteVillage: async (id) => {
        const response = await api.delete(`/villages/${id}`);
        return response.data;
    }
};
