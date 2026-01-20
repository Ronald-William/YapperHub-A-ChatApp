import {BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Chat from "./pages/Chat";
import Chats from "./pages/Chats"
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path = "/" element={<Navigate to ="/login"/>}/>
          <Route path = "/login" element = {<Login/>}/>
          <Route path = "/register" element = {<Register/>}/>
          <Route path = "/chats" element = {<Chats/>}/>
          <Route path = "/chat/:id" element = {<Chat/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
