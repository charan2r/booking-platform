# Booking Platform REST API

## Project Overview

This project is a RESTful Booking Platform API developed using NestJS and PostgreSQL. It provides secure JWT-based authentication, service management, and customer booking management. Authenticated users can manage services and bookings, while customers can create bookings without authentication.

## Features

- JWT Authentication
- User Registration & Login
- Service CRUD Operations
- Booking Management
- Booking Status Updates
- Booking Cancellation
- Pagination
- Search Bookings
- Filter Bookings by Status
- Swagger API Documentation
- Request Validation
- TypeORM Migrations

---

## Technology Stack

- NestJS
- TypeScript
- PostgreSQL (NeonDB)
- TypeORM
- JWT Authentication
- Swagger

---

## Installation Steps

```bash
git clone <repository-url>
cd booking-platform
npm install
```

---

## Environment Variables

Create a `.env` file.

```env
DB_URL=postgresql://username:password@hostname/database?sslmode=require
JWT_SECRET=your_secret_key
JWT_EXPIRY=1d
PORT=3000
```

---

## Database Setup

Run database migrations:

```bash
npm run migration:run
```

---

## Running the Application

Development:

```bash
npm run start:dev
```

Production:

```bash
npm run build
npm run start:prod
```

---

## Running Migrations

Generate a migration:

```bash
npm run migration:generate -- src/database/migrations/MigrationName
```

Run migrations:

```bash
npm run migration:run
```

---

## API Documentation

Swagger UI:

```
http://localhost:3000/api/docs
```

After deployment:

```
https://your-deployed-url/api/docs
```

---

## Assumptions Made

- Customers can create bookings without authentication.
- Authenticated users are responsible for managing services and bookings.
- One booking is allowed per service, date, and time slot.
- Services must exist before bookings can be created.

---

## Future Improvements

- Refresh Tokens
- Password Reset
- Email and SMS Notifications
- Docker Support
- CI/CD Pipeline

---
