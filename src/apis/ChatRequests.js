import { instance } from './JobSolutionApi';
export const createChat = (senderId, receiverId, headers) => instance.post('/chat', { senderId, receiverId }, { headers });
export const userChats = (userId, headers) => instance.get(`/chat/${userId}`, { headers });
export const getUser = (userId, headers) => instance.get(`/chat/user/${userId}`, { headers });
export const getMessages = (Id, headers) => instance.get(`/message/${Id}`, { headers });
export const addMessage = (data, headers) => instance.post('/message/', data, { headers });
