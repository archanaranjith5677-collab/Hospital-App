/**
 * api.js — Centralized Axios HTTP client for the Hospital Booking API.
 *
 * All API calls go through the Vite proxy in development (see vite.config.js),
 * so the base URL is simply "/api" — no hard-coded localhost:8000 needed.
 */

import axios from 'axios';

// Create a pre-configured Axios instance pointing at the FastAPI backend
const api = axios.create({
  baseURL: '/api',            // proxied by Vite → http://localhost:8000/api
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,             // 10-second timeout
});

// ---------------------------------------------------------------------------
// Appointments CRUD helpers
// ---------------------------------------------------------------------------

/**
 * Book a new appointment.
 * @param {Object} data — { name, age, gender, phone, department, doctor, date, time, slot, symptoms }
 * @returns {Promise<Object>} created appointment with server-assigned id
 */
export const createAppointment = (data) => api.post('/appointments/', data);

/**
 * Fetch every appointment (newest first, sorted by backend).
 * @returns {Promise<Array>} list of appointment objects
 */
export const fetchAppointments = () => api.get('/appointments/');

/**
 * Fetch a single appointment by ID.
 * @param {number} id
 * @returns {Promise<Object>}
 */
export const fetchAppointment = (id) => api.get(`/appointments/${id}`);

/**
 * Partially update an appointment.
 * @param {number} id
 * @param {Object} data — only the fields to change
 * @returns {Promise<Object>} updated appointment
 */
export const updateAppointment = (id, data) => api.put(`/appointments/${id}`, data);

/**
 * Delete an appointment.
 * @param {number} id
 * @returns {Promise<void>}
 */
export const deleteAppointment = (id) => api.delete(`/appointments/${id}`);

export default api;
