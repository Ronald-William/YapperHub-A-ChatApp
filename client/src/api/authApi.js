import api from "../services/api";

export const login = (data)=>{
    api.post("/api/users/login",data);
}
export const register = (data)=>{
    api.post("/api/users/register",data);
}
export const logout =()=>{
    api.post("/api/users/logout");
}
