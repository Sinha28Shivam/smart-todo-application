# 🧠 Smart Todo Application with AI Assistance

A full-stack **Smart Todo Application** that enhances traditional task management using **AI-powered suggestions**.  
The application intelligently suggests **task priority** and provides **context-aware insights** based on task **description, due date, and status**.

The AI engine runs using **Ollama (LLaMA 3.2)** inside **Docker**, ensuring a clean, portable, and system-independent setup.

---

## 🚀 Features

### ✅ Core Features
- User authentication (Signup / Login using JWT)
- Create, edit, and delete tasks
- Task status management:
  - Pending
  - In Progress
  - Completed
- Dashboard with task statistics

### 🤖 AI-Powered Features
- **AI Priority Suggestion** while creating a task
- **AI Status Suggestions** while editing a task:
  - Pending → deadline reminder
  - In Progress → urgency & remaining time advice
  - Completed → early or late completion feedback
- AI provides **suggestions only** (does not auto-modify task data)

### 🐳 AI Infrastructure
- Ollama runs inside Docker
- No AI model installed on the host system
- Backend communicates with Ollama via HTTP API

---

## 📐 System Architecture

/docs/aSmart-todo-application.drawio.png


### Architecture Flow
1. The frontend (Next.js) sends authenticated requests using JWT.
2. The backend (Fastify) handles business logic and authentication.
3. Task data is stored in MongoDB.
4. AI-related requests are forwarded to Ollama running inside Docker.
5. Ollama processes the prompt using the LLaMA 3.2 model and returns structured responses.

## 🛠️ Tech Stack

### Frontend
- Next.js (App Router)
- React
- Tailwind CSS
- Lucide Icons

### Backend
- Node.js
- Fastify
- MongoDB
- JWT Authentication

### AI & DevOps
- Ollama (LLaMA 3.2)
- Docker & Docker Volumes

---



