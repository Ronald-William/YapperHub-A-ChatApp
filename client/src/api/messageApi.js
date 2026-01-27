import api from "../services/api"

export const getMessages = (id) =>{
    api.get(`/api/messages/${id}`);
}
export const sendMessage = (data) =>{
    api.post("/api/messages",data);
}