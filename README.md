# 🧠 Shebeka Backend

A modern **Job Portal Backend** built with **Node.js, Express, PostgreSQL, and Prisma ORM**, designed to power the **Shebeka Job Platform** — connecting recruiters and job seekers efficiently and securely.

---

## 🚀 Features

✅ **User Authentication**

- Register and login with JWT-based authentication
- Password encryption using bcrypt
- Role-based access control (`ADMIN`, `RECRUITER`, `JOB_SEEKER`)

✅ **User Management**

- Fetch current user profile
- Update personal details

✅ **Job Management (Recruiter Only)**

- Create, update, delete, and view job postings
- Associate jobs with the recruiter who created them

✅ **Job Applications (Job Seeker Only)**

- Apply for available jobs
- View own applications
- Recruiters can view all applicants for their jobs

✅ **Email Notifications**

- Integrated with [Resend API](https://resend.com/) for sending emails (optional setup)

✅ **Secure & Scalable**

- Environment variables with `.env`
- Helmet for security headers
- Centralized error handling
- CORS-enabled for frontend integration

---

## 🛠️ Tech Stack

| Layer             | Technology                    |
| ----------------- | ----------------------------- |
| Backend Framework | Node.js + Express.js          |
| Database          | PostgreSQL                    |
| ORM               | Prisma                        |
| Authentication    | JWT + bcrypt                  |
| Email Service     | Resend API                    |
| Development Tools | Nodemon, dotenv, Helmet, CORS |

---

## 📁 Project Structure

```
backend/
│
├── controllers/        # Business logic for each route
│   ├── auth.controller.js
│   ├── job.controller.js
│   ├── user.controller.js
│   └── application.controller.js
│
├── middlewares/        # Custom middleware for auth, error handling, etc.
│   ├── authMiddleware.js
│   ├── errorMiddleware.js
│   └── roleMiddleware.js
│
├── routes/             # API endpoints
│   ├── auth.routes.js
│   ├── job.routes.js
│   ├── user.routes.js
│   └── application.routes.js
│
├── prisma/             # Prisma ORM configuration
│   ├── schema.prisma
│
├── config/             # Config files (e.g. DB, Resend)
│   ├── db.js
│   └── resend.js
│
├── .env                # Environment variables
├── server.js           # Entry point
└── package.json
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/yourusername/shebeka-backend.git
cd shebeka-backend
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Configure Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3001

DB_USER=postgres
DB_HOST=localhost
DB_DATABASE=shebeka
DB_PASSWORD=5432
DB_PORT=5432

JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d

DATABASE_URL="postgresql://postgres:5432@localhost:5432/shebeka?schema=public"
```

### 4️⃣ Setup Prisma

```bash
npx prisma generate
npx prisma migrate dev --name init
```

### 5️⃣ Run the Server

```bash
npm run dev
```

If successful:

```
Server listening on port 3001
```

---

## 🧩 API Endpoints

### 🔐 Auth Routes

| Method | Endpoint             | Description            |
| ------ | -------------------- | ---------------------- |
| POST   | `/api/auth/register` | Register a new user    |
| POST   | `/api/auth/login`    | Login user and get JWT |

### 👤 User Routes

| Method | Endpoint            | Description                |
| ------ | ------------------- | -------------------------- |
| GET    | `/api/users/me`     | Get logged-in user profile |
| PUT    | `/api/users/update` | Update user details        |

### 💼 Job Routes

| Method | Endpoint        | Description                     |
| ------ | --------------- | ------------------------------- |
| POST   | `/api/jobs`     | Create new job (Recruiter only) |
| GET    | `/api/jobs`     | Get all jobs                    |
| GET    | `/api/jobs/:id` | Get job by ID                   |
| PUT    | `/api/jobs/:id` | Update job (Recruiter only)     |
| DELETE | `/api/jobs/:id` | Delete job (Recruiter only)     |

### 📝 Application Routes

| Method | Endpoint                   | Description                       |
| ------ | -------------------------- | --------------------------------- |
| POST   | `/api/applications/:jobId` | Apply for a job                   |
| GET    | `/api/applications/my`     | Get logged-in user’s applications |
| GET    | `/api/applications/:jobId` | Recruiter views all applicants    |

---

## 🧠 Future Improvements

- 🌍 Add file uploads for resumes
- 📨 Add email notifications for job applications
- 🔍 Advanced job search and filters
- 📊 Admin dashboard analytics

---

## 🤝 Contributing

Contributions are welcome!  
Feel free to fork, create a branch, and open a pull request.

---

## 🧑‍💻 Author

**Abdulselam Taye**  
🚀 Passionate Electrical & Computer Engineer | Full-Stack Developer  
📧 abdulselam.taye-ug@aau.edu.et

---

## 🪪 License

This project is licensed under the **MIT License**.  
Feel free to use, modify, and distribute as you like.

---

⭐ **If you find this project helpful, give it a star on GitHub!**
