# Task Management System – Backend

This is the backend service for the **Task Management System**.  
It provides REST APIs for authentication and task management.

---

## 🛠 Tech Stack

- **Node.js**
- **TypeScript**
- **Express.js**
- **Prisma ORM**
- **PostgreSQL**
- **JWT Authentication**

---

## 📂 Project Structure

backend/
├─ src/
│ ├─ controllers/
│ ├─ routes/
│ ├─ middlewares/
│ ├─ services/
│ ├─ utils/
│ └─ index.ts
├─ prisma/
│ └─ schema.prisma
├─ prisma.config.ts
├─ package.json
├─ tsconfig.json
└─ README.md


---

## ⚙️ Prerequisites

- Node.js (v18+ recommended)
- PostgreSQL
- npm

---

### Database connection - update in env
```bash
DATABASE_URL=your_database_url
JWT_ACCESS_SECRET=your_secret
JWT_REFRESH_SECRET=your_secret

```

## 🚀 Setup & Run

### 1️⃣ Install dependencies
```bash
npm install

## prisma generate
npm run prisma:generate

## Run database migrations
npm run prisma:migrate

## Open Prisma Studio:
npm run prisma:studio

## Start the development server
npm run dev

## Server will start on:
`http://localhost:3001`

```

### Available Scripts
```bash
npm run dev – Start backend in development mode
npm run build – Build TypeScript code
npm run start – Run production build
npm run prisma:migrate – Run Prisma migrations
npm run prisma:studio – Open Prisma Studio

```

### Features
```bash
User Registration & Login
JWT-based Authentication
Access & Refresh Token handling
Task CRUD operations
Prisma ORM with PostgreSQL

```






