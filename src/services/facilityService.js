import api from './api';

export const facilityService = {
    getFacilities: async (params) => {
        const response = await api.get('/facilities', { params });
        return response.data;
    },

    getFacilityById: async (id) => {
        const response = await api.get(`/facilities/${id}`);
        return response.data;
    },

    createFacility: async (data) => {
        const response = await api.post('/facilities', data);
        return response.data;
    },

    updateFacility: async (id, data) => {
        const response = await api.put(`/facilities/${id}`, data);
        return response.data;
    },

    deleteFacility: async (id) => {
        const response = await api.delete(`/facilities/${id}`);
        return response.data;
    },

    getPublicFacilities: async () => {
        const response = await api.get('/facilities');
        return response.data;
    }
};
