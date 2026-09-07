import api from './apiClient';

const patientService = {
  async list() {
    const { data } = await api.get('/patients');
    return data;
  },

  async getById(id) {
    const { data } = await api.get(`/patients/${id}`);
    return data;
  },

  async create(payload) {
    const { data } = await api.post('/patients', payload);
    return data;
  },

  async update(id, payload) {
    const { data } = await api.put(`/patients/${id}`, payload);
    return data;
  },

  async remove(id) {
    const { data } = await api.delete(`/patients/${id}`);
    return data;
  },
};

export default patientService;
