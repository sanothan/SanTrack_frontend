import api from './api';

export const inspectionService = {
    getInspections: async (params) => {
        const response = await api.get('/inspections', { params });
        return response.data;
    },

    getInspectionById: async (id) => {
        const response = await api.get(`/inspections/${id}`);
        return response.data;
    },

    createInspection: async (data) => {
        const response = await api.post('/inspections', data);
        return response.data;
    },

    updateInspection: async (id, data) => {
        const response = await api.put(`/inspections/${id}`, data);
        return response.data;
    }
};
