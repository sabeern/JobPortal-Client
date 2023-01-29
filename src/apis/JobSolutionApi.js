import axios from 'axios';

export const instance = axios.create({
  baseURL: 'http://localhost:8000'
  //https://job-solutions-server.onrender.com
});

export const url = 'http://localhost:3000';
//https://job-portal-gwu4.onrender.com
export const socketUrl = 'http://localhost:8800';
//https://job-solutions-socket.onrender.com