import api from './api';

export const issueService = {
    getIssues: async (params) => {
        const response = await api.get('/issues', { params });
        return response.data;
    },

    getIssueById: async (id) => {
        const response = await api.get(`/issues/${id}`);
        return response.data;
    },

    createIssue: async (data) => {
        const response = await api.post('/issues', data);
        return response.data;
    },

    updateIssue: async (id, data) => {
        const response = await api.put(`/issues/${id}`, data);
        return response.data;
    }
};
