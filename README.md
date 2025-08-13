

#  WhatsApp-Style Chat Application

A real-time chat application inspired by WhatsApp, built with **React** for the frontend and **Node.js + Express + MongoDB** for the backend.
It supports live messaging, user presence status, and smooth UI interactions.

---

## 🚀 Live Demo

* **Frontend**: [Frontend](https://whatsapp-style-chat.vercel.app/)
* **Backend API**: [Backend](https://whatsapp-backend-rimjhim.vercel.app/)

---

## ✨ Features

* **User Authentication** (login/logout)
* **Real-time Messaging** (WebSocket / Socket.IO)
* **Online/Offline Status**
* **Chat List** with latest message preview
* **Message Timestamps**
* **Typing Indicators** (optional)
* **Responsive Design** (mobile-first UI)
* **Loading Indicators** for chats

---

## 🛠 Tech Stack

**Frontend**:

* React (Hooks)
* React Router
* CSS 
* Axios

**Backend**:

* Node.js
* Express.js
* MongoDB (via Mongoose)
* CORS, dotenv

---

## 📂 Project Structure

```
whatsapp-chat-app/
│
├── backend/
│   ├── src/
│   │   ├── index.js        # Entry point
│   │   ├── routes/         # API routes
│   │   ├── models/         # Mongoose schemas
│   │   └── controllers/    # Logic handlers
│   ├── package.json
│   └── vercel.json         # Backend deployment config
│
└── frontend/
    ├── src/
    │   ├── components/     # UI components
    │   ├── pages/          # Page views
    │   ├── App.jsx
    │   └── index.jsx
    ├── package.json
    └── public/
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/whatsapp-chat-app.git
cd whatsapp-chat-app
```

### 2️⃣ Backend Setup

```bash
cd backend
npm install
```

**Create `.env` file in `backend/`**:

```
MONGO_URI=your-mongodb-connection-string
PORT=5000
```

**Run locally**:

```bash
npm start
```

---

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
```

**Create `.env` file in `frontend/`**:

```
VITE_API_URL=https://your-backend-url.vercel.app
```

**Run locally**:

```bash
npm run dev
```

---

## 📡 Deployment

* **Frontend**: Hosted on **Vercel**
* **Backend**: Hosted on **Vercel** with `vercel.json`:

```json
{
  "version": 2,
  "builds": [
    { "src": "src/index.js", "use": "@vercel/node" }
  ],
  "routes": [
    { "src": "/(.*)", "dest": "src/index.js" }
  ]
}
```
---


---

## 🧑‍💻 Author

**Rimjhim Agrawal**
💼 [LinkedIn](https://www.linkedin.com/in/rimjhim-agrawal23000/)
📂 [Portfolio](https://portfolio-rimjhim.vercel.app/)


