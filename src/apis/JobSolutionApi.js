import axios from 'axios';

export const instance = axios.create({
  baseURL: 'https://job-solutions-server.onrender.com/'
});
