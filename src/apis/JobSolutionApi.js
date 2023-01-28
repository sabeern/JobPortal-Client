import axios from 'axios';

export const instance = axios.create({
  baseURL: 'https://job-solutions-server.onrender.com'
});

export const url = 'https://job-portal-gwu4.onrender.com';
