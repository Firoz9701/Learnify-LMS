# Learnify LMS

Learnify LMS is a full-stack Learning Management System built with Spring Boot and React.
It supports Admin, Instructor, and Student workflows including course publishing,
enrollment, lesson tracking, quiz attempts, and certificate generation.

## Highlights

- Role-based authentication with JWT (Admin, Instructor, Student)
- Course and lesson management
- Student enrollment and learning progress tracking
- Course quiz attempts with score tracking
- Certificate download for eligible students
- Thumbnail and video upload support
- Profile management and password reset request workflow

## Tech Stack

### Backend

- Java 21
- Spring Boot
- Spring Security + JWT
- Spring Data JPA + Hibernate
- MySQL
- OpenPDF (certificate generation)
- Maven

### Frontend

- React 19
- React Router
- Axios
- Bootstrap 5
- Vite

## Project Structure

```
Learnify-LMS/
	backend/                # Spring Boot API
		src/main/java/...     # Controllers, services, entities, security
		src/main/resources/   # application.properties
	frontend/               # React application (Vite)
		src/components/       # Reusable UI components
		src/pages/            # Route pages by role
		src/services/         # API service layer
	docs/
		Learnify.postman_collection.json
```

## Core Features

### Authentication and User Management

- Sign up and login with JWT-based authentication
- Role-based route and endpoint authorization
- Current user profile view and update
- Forgot-password request flow with admin resolution

### Instructor Features

- Create, update, and delete courses
- Create, update, and delete lessons
- Upload course thumbnails and lesson videos

### Student Features

- Browse and search courses
- Enroll in courses
- View ordered lessons with lock/unlock progression
- Mark lesson completion and track progress
- Take quizzes and view attempt history
- Download certificates after meeting completion criteria

### Admin Features

- View users
- Create users
- Update user role and status
- Resolve password reset requests

## API Coverage

Main endpoint groups:

- `/api/auth/*`
- `/api/courses/*`
- `/api/lessons/*`
- `/api/enrollments/*`
- `/api/progress/*`
- `/api/quizzes/*`
- `/api/certificates/*`
- `/api/admin/*`
- `/api/upload/*`
- `/api/test`

Postman collection is available at:

- `docs/Learnify.postman_collection.json`

## Getting Started

### Prerequisites

- Java 21+
- Maven (or use Maven wrapper included in backend)
- Node.js 18+ and npm
- MySQL 8+

### 1) Clone and enter project

```bash
git clone <your-repo-url>
cd Learnify-LMS
```

### 2) Configure database and backend properties

Create a MySQL database:

```sql
CREATE DATABASE learnify_db;
```

Update backend config in `backend/src/main/resources/application.properties`:

- `spring.datasource.url`
- `spring.datasource.username`
- `spring.datasource.password`
- `jwt.secret`

### 3) Run backend

Windows:

```bash
cd backend
mvnw.cmd spring-boot:run
```

Mac/Linux:

```bash
cd backend
./mvnw spring-boot:run
```

Backend runs at `http://localhost:8080`.

### 4) Run frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`.

## Build and Test Commands

### Backend

```bash
cd backend
mvnw.cmd test
mvnw.cmd clean package
```

### Frontend

```bash
cd frontend
npm run build
npm run lint
```

## Postman Quick Start

1. Import `docs/Learnify.postman_collection.json`.
2. Set `baseUrl` to `http://localhost:8080`.
3. Run `Auth -> Login` to auto-save JWT token in collection variable.
4. Run protected endpoints with the saved token.

