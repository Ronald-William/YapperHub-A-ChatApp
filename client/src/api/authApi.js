import api from "../services/api";

export const login = (data) => {
  return api.post("users/login", data);
};

export const register = (data) => {
  return api.post("users/register", data);
};

export const logout = () => {
  return api.post("users/logout");
};

export const getMe = () => {
  return api.get("users/me");
};
