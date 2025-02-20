import axios from 'axios';
import { API_BASE_URL } from './config/BaseUrlApi';

const niubizApi = {
  generateSessionToken: async (amount) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/generate-session-token`, { amount });
      return response.data;
    } catch (error) {
      console.error('Error al generar el token de sesión:', error);
      throw error.response?.data || error.message;
    }
  },

  handleFormResponse: async (formData) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/response-form`,
        new URLSearchParams(formData),
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error al manejar la respuesta del formulario:', error);
      throw error.response?.data || error.message;
    }
  },

  generateAuthorizationToken: async (purchaseNumber) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/generate-authorization-token`,
        null,
        {
          params: { purchaseNumber },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error al generar el token de autorización:', error);
      throw error.response?.data || error.message;
    }
  },

  handleTimeout: async (purchaseNumber) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/timeout`, {
        params: { id: purchaseNumber },
      });
      return response.data;
    } catch (error) {
      console.error('Error al manejar el tiempo de espera:', error);
      throw error.response?.data || error.message;
    }
  },
};

export default niubizApi;
