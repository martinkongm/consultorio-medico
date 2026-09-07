import api from './apiClient';

const recordService = {
  async list() {
    const { data } = await api.get('/records');
    return data;
  },

  async listByPatient(patientId) {
    const { data } = await api.get(`/records/patient/${patientId}`);
    return data;
  },

  async getById(id) {
    const { data } = await api.get(`/records/${id}`);
    return data;
  },

  async create(payload) {
    const { data } = await api.post('/records', payload);
    return data;
  },

  async update(id, payload) {
    const { data } = await api.put(`/records/${id}`, payload);
    return data;
  },

  async remove(id) {
    const { data } = await api.delete(`/records/${id}`);
    return data;
  },

  async listFiles(recordId) {
    const { data } = await api.get(`/records/${recordId}/files`);
    return data;
  },

  async uploadFile(recordId, file) {
    const formData = new FormData();
    formData.append('file', file);
    const { data } = await api.post(`/records/${recordId}/upload`, formData);
    return data;
  },
};

export default recordService;
