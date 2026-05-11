# 📚 Book Review Application

A secure, multi-user book review platform with JWT authentication, star ratings, and a fully normalized SQL Server database — built with ASP.NET Core Web API and Angular.

---

## 🚀 Features

- **Secure Authentication** — JWT-based login with role-based authorization
- **Book Reviews & Ratings** — Submit, edit, and delete reviews with 1–5 star ratings
- **Role-Based Access** — Only authenticated users can submit or manage reviews
- **Normalized Database** — Clean SQL Server schema designed for concurrent reads with zero data inconsistency
- **Clean Architecture** — Controller → Service → Repository with DTOs and service interfaces for easy testability

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Angular 14+, TypeScript, HTML/CSS |
| Backend | ASP.NET Core Web API, C# |
| Database | Microsoft SQL Server, Entity Framework Core |
| Auth | JWT (JSON Web Tokens), RBAC |
| ORM | Entity Framework Core, LINQ |
| Tools | Visual Studio, Postman |

---

## 🏗️ Architecture

```
Client (Angular)
    │
    ▼
ASP.NET Core Web API
    ├── Controllers       → HTTP request handling
    ├── Services          → Business logic layer
    ├── Repositories      → Data access via EF Core
    └── DTOs              → Decoupled data contracts
    │
    ▼
Microsoft SQL Server
```

---

## 🔐 Authentication & Authorization

- Users register and log in; JWT token returned on success
- Token must be included in `Authorization: Bearer <token>` header for protected endpoints
- Unauthorized users can browse books and reviews but cannot create, edit, or delete
- Angular route guards enforce role checks on the frontend

---

## 📋 Functional Modules

### Guest (Unauthenticated)
- Browse all books
- View reviews and ratings for any book

### Authenticated User
- Submit a review and star rating for any book
- Edit or delete their own reviews
- View their review history

### Admin
- Manage book listings (add, edit, remove)
- Moderate reviews

---

## ⭐ Review & Rating System

- Star ratings from 1 to 5 per book per user
- Aggregate average rating computed per book
- Normalized schema prevents duplicate reviews from the same user for the same book
- Concurrent read support — no data inconsistency under load

---

## 🗄️ Database Design

Normalized schema with key tables:

| Table | Purpose |
|---|---|
| `Users` | User accounts and roles |
| `Books` | Book catalog (title, author, genre) |
| `Reviews` | User reviews linked to books |
| `Ratings` | Star ratings per user per book |

- Entity Framework Core migrations for schema management
- Foreign key constraints and unique indexes enforce data integrity

---

## 🚦 Getting Started

### Prerequisites
- [.NET 6+ SDK](https://dotnet.microsoft.com/download)
- [Node.js & npm](https://nodejs.org/)
- [SQL Server](https://www.microsoft.com/en-us/sql-server)
- [Angular CLI](https://angular.io/cli) — `npm install -g @angular/cli`

### Backend Setup
```bash
# Clone the repo
git clone https://github.com/mohitnigam12/BookReview.git
cd BookReview/Backend

# Update connection string in appsettings.json
# "ConnectionStrings": { "DefaultConnection": "your-sql-server-connection-string" }

# Apply migrations and run
dotnet ef database update
dotnet run
# API runs at https://localhost:7000 (or as configured)
```

### Frontend Setup
```bash
cd BookReview/Frontend
npm install
ng serve
# App runs at http://localhost:4200
```

---

## 📁 Project Structure

```
BookReview/
├── Backend/
│   ├── Controllers/
│   ├── Services/
│   ├── Repositories/
│   ├── Models/
│   ├── DTOs/
│   └── appsettings.json
└── Frontend/
    ├── src/
    │   ├── app/
    │   │   ├── books/
    │   │   ├── reviews/
    │   │   ├── auth/
    │   │   └── shared/
    │   └── environments/
    └── angular.json
```

---

## 🔗 API Endpoints (Sample)

| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| POST | `/api/auth/register` | No | Register new user |
| POST | `/api/auth/login` | No | Login, returns JWT |
| GET | `/api/books` | No | List all books |
| GET | `/api/books/{id}/reviews` | No | Get reviews for a book |
| POST | `/api/reviews` | Yes | Submit a review |
| PUT | `/api/reviews/{id}` | Yes | Edit own review |
| DELETE | `/api/reviews/{id}` | Yes | Delete own review |

---

## 👤 Author

**Mohit Nigam** — Full Stack Developer (.NET Core | Angular | C# | SQL)

[GitHub](https://github.com/mohitnigam12) · [LinkedIn](https://linkedin.com/in/mohitnigam12) · mohitnigam1202@gmail.com
