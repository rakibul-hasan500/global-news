# Global News & Media Platform

A modern, full-stack news and media publishing platform built with the MERN stack, TypeScript, Next.js, Redis, and Socket.IO.

Global News is designed to provide a complete digital news publishing and management experience, allowing readers to explore news articles while journalists, editors, and administrators manage content through a role-based editorial workflow.

The platform focuses on secure authentication, structured content management, real-time notifications, media handling, and scalable backend architecture.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [User Roles & Permissions](#user-roles--permissions)
- [Article Publishing Workflow](#article-publishing-workflow)
- [Authentication & Security](#authentication--security)
- [Real-Time Communication](#real-time-communication)
- [Technology Stack](#technology-stack)
- [Project Architecture](#project-architecture)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [API Overview](#api-overview)
- [Database & Caching](#database--caching)
- [Frontend Structure](#frontend-structure)
- [Backend Structure](#backend-structure)
- [Production Build](#production-build)
- [Security Considerations](#security-considerations)
- [Future Improvements](#future-improvements)
- [License](#license)

---

## Overview

Global News is a full-stack digital news and media platform that provides an organized environment for publishing, managing, and consuming news content.

The platform includes a public-facing news portal and a role-based content management system.

Readers can explore published articles, browse news by category, and interact with the platform. Authorized users can manage articles and perform editorial operations according to their assigned permissions.

The backend follows a modular architecture using Express.js and TypeScript, while the frontend is built with Next.js and React.

Redis is integrated for caching and temporary data management, and Socket.IO provides real-time communication capabilities.

---

## Features

### 1. News & Article Management

- Dynamic news article listing.
- Article details with SEO-friendly slugs.
- Featured news section.
- Breaking news section.
- Category-based news browsing.
- Homepage news sections.
- Article cover image management.
- Rich-text article content editor.
- Article publishing and editorial workflow.
- Article status management.
- Pagination and structured content retrieval.

### 2. User Management

- User registration.
- User login and logout.
- User profile management.
- Profile information updates.
- Profile image management.
- Password change functionality.
- Forgot password functionality.
- Email verification.
- Account verification.
- User account management.
- Role-based access control.

### 3. Authentication

- JWT-based authentication.
- Access token and refresh token system.
- Secure HTTP-only cookie support.
- Email verification using JWT.
- Login verification through email OTP.
- Google OAuth authentication.
- Credential-based authentication.
- Protected routes and API endpoints.
- Session and token management.

### 4. Role-Based Access Control (RBAC)

The platform supports multiple user roles with different access permissions.

- USER
- JOURNALIST
- EDITOR
- MODERATOR
- ADMIN
- SUPER_ADMIN

Each role has specific permissions for accessing and managing platform resources.

### 5. Real-Time Notifications

- Real-time notification delivery using Socket.IO.
- User-specific notifications.
- Notification management.
- Article-related notifications.
- Comment-related notifications.
- Contact message notifications.
- Real-time client-server communication.

### 6. Media Management

- Cloudinary integration.
- Article cover image uploads.
- User profile image management.
- Image storage and delivery through Cloudinary.
- Multipart file upload handling.

### 7. Contact Management

- Contact message submission.
- Contact message management.
- Contact-related notifications.
- Structured contact message storage.

### 8. State Management

- Redux Toolkit.
- Centralized application state.
- Authentication state management.
- RTK Query-based API integration where applicable.
- Real-time client-side communication.

---

## User Roles & Permissions

Global News uses role-based access control to organize platform permissions.

| Role | Description |
|---|---|
| USER | Regular platform user |
| JOURNALIST | Creates and submits news articles |
| EDITOR | Reviews and manages submitted articles |
| MODERATOR | Performs moderation-related operations |
| ADMIN | Manages platform users and resources |
| SUPER_ADMIN | Highest-level administrative access |

Permissions are enforced on the backend to prevent unauthorized access to protected resources.

---

## Article Publishing Workflow

The article management system follows a structured editorial workflow.

### Article Statuses

| Status | Description |
|---|---|
| DRAFT | Article is being created or edited |
| SUBMITTED | Article has been submitted for editorial review |
| REJECTED | Article has been rejected by the editorial team |
| PUBLISHED | Article is publicly available |

### Publishing Process

1. A journalist creates an article.
2. The article is saved as a draft.
3. The journalist submits the article for review.
4. An authorized editor reviews the submission.
5. The article can be rejected or approved for publication.
6. Published articles become available on the public news portal.

This workflow helps maintain content quality and editorial control.

---

## Authentication & Security

Security is an important part of the Global News architecture.

The platform implements several authentication and security mechanisms:

- JWT-based authentication.
- Separate access and refresh token secrets.
- HTTP-only cookie-based token handling.
- Email verification.
- Login OTP verification.
- Google OAuth integration.
- Password hashing with bcrypt.
- Request validation using Zod.
- MongoDB query sanitization.
- CORS configuration.
- Role-based authorization.
- Protected API routes.

Sensitive configuration values are managed through environment variables.

---

## Real-Time Communication

Socket.IO is used to establish real-time communication between the backend and frontend.

The notification system supports event-based communication without requiring users to refresh the page to receive new notifications.

The backend manages notification events, while the frontend uses Socket.IO Client to receive updates.

---

## Technology Stack

### Frontend

| Technology | Purpose |
|---|---|
| Next.js 16 | React framework |
| React 19 | User interface |
| JavaScript / TypeScript | Frontend development |
| Redux Toolkit | State management |
| React Redux | Redux integration |
| RTK Query | API data fetching where applicable |
| Tailwind CSS 4 | Styling |
| React Icons | Icon library |
| Jodit React | Rich-text article editor |
| React Hot Toast | Notifications and feedback |
| React Share | Social media sharing |
| Socket.IO Client | Real-time communication |
| Google OAuth | Google authentication integration |

### Backend

| Technology | Purpose |
|---|---|
| Node.js | JavaScript runtime |
| Express.js 5 | Backend framework |
| TypeScript | Type-safe backend development |
| MongoDB | NoSQL database |
| Mongoose | MongoDB object modeling |
| Redis | Caching and temporary data storage |
| Socket.IO | Real-time communication |
| JSON Web Token | Authentication |
| bcrypt | Password hashing |
| Zod | Request validation |
| Cloudinary | Media storage |
| Nodemailer | Email delivery |
| Google Auth Library | Google OAuth verification |
| Multer | File upload handling |
| Formidable | Multipart form processing |
| Cookie Parser | Cookie handling |
| CORS | Cross-origin resource sharing |
| mongo-sanitize | MongoDB query sanitization |

---

## Project Architecture

The project is organized into two main applications:

```text
global-news/
│
├── backend/
│   ├── src/
│   ├── package.json
│   ├── tsconfig.json
│   └── .env
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── .env.local
│
├── .gitignore
└── README.md
```

The backend and frontend operate independently and communicate through REST APIs and Socket.IO.

### Application Architecture

```text
                 Global News Platform
                          |
             +------------+------------+
             |                         |
          Frontend                  Backend
          Next.js                   Express.js
          React                     TypeScript
             |                         |
             |       REST API          |
             +-------------------------+
             |                         |
        Redux Toolkit              Services
        RTK Query                   Controllers
        Socket.IO Client           Middleware
             |                         |
             |                +--------+--------+
             |                |        |        |
             |             MongoDB   Redis   Cloudinary
             |                |
             |             Mongoose
             |
             +---------- Socket.IO
                        Real-time
                        Notifications
```

---

## Getting Started

Follow these instructions to set up the project locally.

### Prerequisites

Make sure the following tools are installed:

- Node.js (LTS recommended)
- npm
- MongoDB
- Redis
- Git

Optional services:

- Cloudinary account
- Google Cloud OAuth credentials
- SMTP email service

### 1. Clone the Repository

```bash
git clone https://github.com/rakibul-hasan500/global-news.git
```

Navigate to the project directory:

```bash
cd global-news
```

### 2. Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file in the backend root directory.

Configure the environment variables as described in the [Environment Variables](#environment-variables) section.

### 3. Frontend Setup

Open another terminal and navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create a `.env.local` file in the frontend root directory.

Configure the frontend environment variables.

---

## Environment Variables

Environment variables are used to manage application configuration and external service credentials.

**Important:** The following values are examples. Replace them with your own configuration before running the application.

### Backend `.env`

Create `backend/.env`:

```env
# Environment
NODE_ENV=development

# Server
PORT=5000

# Application
APP_NAME=Global News

# Client URL
CLIENT_URL=http://localhost:3000

# MongoDB
MONGODB_URI=mongodb://localhost:27017/global_news

# Redis
REDIS_URI=redis://localhost:6379

# JWT Secrets
JWT_VERIFY_SECRET=YOUR_VERIFY_SECRET
JWT_ACCESS_SECRET=YOUR_ACCESS_SECRET
JWT_REFRESH_SECRET=YOUR_REFRESH_SECRET

# Cookie Configuration
COOKIE_SAME_SITE=lax

# SMTP Configuration
SMTP_HOST=
SMTP_PORT=
SMTP_SECURE=true
SMTP_USER=
SMTP_PASSWORD=

# Google OAuth
GOOGLE_AUTH_WEB_CLIENT_ID=
GOOGLE_AUTH_ANDROID_CLIENT_ID=
GOOGLE_AUTH_IOS_CLIENT_ID=

# Cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

### Frontend `.env.local`

Create `frontend/.env.local`:

```env
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1

# Backend Server URL
NEXT_PUBLIC_SERVER_URL=http://localhost:5000

# Frontend URL
NEXT_PUBLIC_FRONTEND_URL=http://localhost:3000

# Google OAuth
NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID=
```

**Security Notes:**

- Never commit real `.env` or `.env.local` files.
- Never expose JWT secrets or private API credentials.
- Never expose Cloudinary API secrets.
- Only expose environment variables prefixed with `NEXT_PUBLIC_` when they are safe for browser access.
- Use strong, unique secrets in production.

---

## Running the Application

Both applications must be running for the complete platform experience.

### Start the Backend

From the `backend` directory:

```bash
npm run dev
```

Backend server:

```text
http://localhost:5000
```

API base URL:

```text
http://localhost:5000/api/v1
```

Health check:

```text
http://localhost:5000/api/v1/health
```

### Start the Frontend

From the `frontend` directory:

```bash
npm run dev
```

Frontend application:

```text
http://localhost:3000
```

---

## API Overview

The backend exposes RESTful API endpoints under the following base URL:

```text
/api/v1
```

Example:

```text
http://localhost:5000/api/v1
```

### Main API Modules

| Module | Description |
|---|---|
| Authentication | Registration, login, verification and token management |
| Users | User profiles and account management |
| Articles | News article management and publishing |
| Categories | News category management |
| Comments | Article comment management |
| Notifications | User notification management |
| Contacts | Contact message management |

The exact available endpoints and permissions depend on the implemented backend routes.

---

## Database & Caching

### MongoDB

MongoDB is the primary database.

Mongoose is used for:

- Schema definition.
- Data modeling.
- Database queries.
- Document validation.
- Relationships through references.
- Data management.

### Redis

Redis is integrated for temporary data storage and caching-related operations.

It is used for application features such as:

- Temporary verification data.
- OTP management.
- Login verification cooldowns.
- Application settings.
- Caching-related operations.

---

## Frontend Structure

The frontend is developed using Next.js App Router and React.

Its main responsibilities include:

- Rendering the public news portal.
- Displaying article listings and article details.
- Managing authentication interfaces.
- Handling user profile interfaces.
- Providing role-specific management interfaces.
- Managing global application state.
- Communicating with backend APIs.
- Receiving real-time notifications.

---

## Backend Structure

The backend follows a modular Express.js architecture using TypeScript.

Its responsibilities include:

- REST API development.
- Authentication and authorization.
- User management.
- Article management.
- Editorial workflow.
- Database operations.
- Redis integration.
- Email delivery.
- Media upload management.
- Real-time notifications.
- Request validation and error handling.

---

## Production Build

### Backend

From the backend directory:

```bash
npm run build
```

Start the compiled application:

```bash
npm start
```

### Frontend

From the frontend directory:

```bash
npm run build
```

Start the production application:

```bash
npm start
```

Before deployment, configure production environment variables, database connections, Redis, OAuth credentials, SMTP settings, and Cloudinary credentials.

---

## Security Considerations

The project follows several security practices:

- Password hashing using bcrypt.
- JWT-based authentication.
- Secure cookie configuration.
- Role-based access control.
- Input validation using Zod.
- MongoDB query sanitization.
- Environment-based secret management.
- CORS configuration.
- Protected backend routes.
- Separation of authentication and authorization responsibilities.

Security configurations should be reviewed and adjusted according to the production deployment environment.

---

## Future Improvements

Planned areas for further development and architectural improvements include:

- Advanced Redis caching strategies.
- API rate limiting.
- Background job processing.
- Improved search functionality.
- Advanced analytics and reporting.
- Infrastructure scalability and reliability improvements.

---

## License

This project is currently available as a public GitHub repository.

See the repository's license information for usage and distribution permissions.

---

## Author

**Syed Rakibul Hasan**

---

**Built with passion for modern web development.**