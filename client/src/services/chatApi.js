import api from "./api";

export const getConversations = () =>
  api.get("/conversations");

export const createConversation = (friendUsername) =>
  api.post("/conversations", { friendUsername });

export const getMessages = (convoId) =>
  api.get(`/messages/${convoId}`);

export const sendMessage = (data) =>
  api.post("/messages", data);