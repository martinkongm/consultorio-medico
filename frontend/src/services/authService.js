import api from './apiClient';

const authService = {
  async login(credentials) {
    const { data } = await api.post('/login', credentials);
    return data;
  },
};

export default authService;
