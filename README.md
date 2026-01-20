# 💬 Real-Time Chat Application (MERN Stack)

A full-stack real-time chat application built using the MERN stack. The system follows a production-grade architecture with modular backend design, secure authentication, scalable real-time communication, and clean frontend integration.

This project is designed as a resume-grade engineering project that demonstrates real-world full-stack system design and implementation.

---

## 🚀 Features

### Core Features

* User authentication (JWT-based)
* One-to-one real-time messaging
* Chat creation and management
* Message persistence with MongoDB
* Online/offline presence
* Typing indicators
* Message delivery & seen status
* Message pagination
* Clean REST API architecture

### Advanced (Planned)

* Group chats
* Media sharing (images/files)
* Message search
* Message edit/delete
* Message reactions
* Push notifications
* Redis-based socket scaling

---

## 🏗 System Architecture

```
Frontend (React)
   |
   | REST APIs (Auth, Users, Chats, Messages)
   | WebSocket (Socket.IO)
   |
Backend (Node.js + Express)
   |
   | MongoDB (Primary Database)
   | Socket.IO (Realtime Layer)
```

---

## 🛠 Tech Stack

### Frontend

* React (Vite)
* Tailwind CSS
* React Router
* Axios

### Backend

* Node.js
* Express.js
* MongoDB (Mongoose)
* Socket.IO
* JWT Authentication
* bcrypt
* CORS & Cookie-based sessions

### Dev Tools

* Nodemon
* Morgan
* dotenv

---

## 📁 Project Structure

```
chat-app/
 ├── client/          # React frontend
 └── server/          # Node.js backend
```

### Backend Structure

```
server/
 ├── config/
 ├── controllers/
 ├── middleware/
 ├── models/
 ├── routes/
 ├── app.js
 └── server.js
```

### Frontend Structure

```
client/
 ├── src/
 │   ├── pages/
 │   ├── components/
 │   ├── services/
 │   ├── store/
 │   ├── App.jsx
 │   └── main.jsx
```

---

## 🔐 Authentication Flow

* Users authenticate using JWT (access + refresh tokens)
* Tokens are stored securely in HTTP-only cookies
* Protected routes are guarded by authentication middleware
* Socket connections are authenticated using JWT

---

## ⚡ Realtime Messaging Flow

1. User logs in and connects to Socket.IO
2. Server authenticates socket connection
3. User joins chat rooms
4. Messages are sent via socket
5. Server persists message to MongoDB
6. Server emits message to recipients in real-time

---

## 📦 Database Design

### User

```
{
  name,
  email,
  passwordHash,
  avatar,
  status,
  lastSeen
}
```

### Chat

```
{
  isGroup,
  members,
  lastMessage,
  updatedAt
}
```

### Message

```
{
  chatId,
  senderId,
  text,
  media,
  seenBy,
  createdAt
}
```

---

## 🧪 API Endpoints

### Auth

```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/me
```

### Users

```
GET    /api/users/search?q=
GET    /api/users/:id
```

### Chats

```
POST   /api/chats
GET    /api/chats
```

### Messages

```
GET    /api/messages/:chatId
POST   /api/messages
```

---

## 🏃 Getting Started

### Prerequisites

* Node.js
* MongoDB (local or Atlas)
* npm

---

### Backend Setup

```bash
cd server
npm install
```

Create `.env` file:

```
PORT=5000
MONGO_URI=your_mongodb_url
CLIENT_URL=http://localhost:5173
JWT_SECRET=your_secret
```

Run backend:

```bash
npm run dev
```

---

### Frontend Setup

```bash
cd client
npm install
npm run dev
```

Frontend runs at:

```
http://localhost:5173
```

Backend runs at:

```
http://localhost:5000
```

---

## 🔒 Security

* Password hashing with bcrypt
* JWT authentication
* HTTP-only cookies
* CORS protection
* Input validation
* Centralized error handling

---

## 📈 Scalability Design

* Modular backend architecture
* Socket room-based messaging
* MongoDB indexing for chat queries
* Pagination for large message histories
* Redis-ready socket scaling (future)

---

## 🧠 Engineering Principles Followed

* Separation of concerns
* Controller-service architecture
* Middleware-based security
* Stateless authentication
* RESTful API design
* Real-time event-driven architecture

---

## 📌 Future Improvements

* Redis for socket scaling
* Push notifications
* End-to-end encryption
* Message queue integration
* Microservices architecture

---

## 👨‍💻 Author

**Ronald Joseph**

---

## 📄 License

MIT License

