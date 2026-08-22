# 🏨 QuickStay - Hotel Booking Management System

QuickStay is a full-stack hotel booking management system that allows users to explore hotels, view available rooms, check room availability, make bookings, and manage their reservations.

The system also provides a hotel-owner dashboard where hotel owners can register their hotels, add rooms, manage room availability, and update room information.

The project is built using **React.js** for the frontend and **Spring Boot** for the backend, with **MySQL** for data persistence and **AWS S3** for image storage.

---

## 🚀 Features

### 👤 User Features

- User authentication with Clerk
- Browse available hotels and rooms
- View detailed room information
- View room images and amenities
- Select check-in and check-out dates
- Select number of guests
- Calculate total booking price
- Check room availability before booking
- Book available rooms
- View personal bookings
- View booking dates and total price
- View payment status
- Responsive UI for desktop and mobile devices

---

### 🏨 Hotel Owner Features

- Hotel owner dashboard
- Register a hotel
- Add new rooms
- Upload room images
- Edit existing rooms
- Update room details
- Manage room availability
- View listed rooms
- Manage hotel information

---

### 🔐 Authentication

Authentication is currently handled using **Clerk** on the frontend.

The application uses authentication to:

- Sign in users
- Identify the currently logged-in user
- Restrict booking functionality to authenticated users
- Provide user-specific booking information
- Provide access to user-related features

> Custom Spring Boot authentication is planned as a future improvement to understand and implement authentication and authorization directly in the backend.

---

## 🛠️ Tech Stack

### Frontend

- React.js
- React Router
- Tailwind CSS
- Vite
- JavaScript
- Clerk Authentication

### Backend

- Java
- Spring Boot
- Spring Web
- Spring Data JPA
- Hibernate
- REST APIs
- Maven

### Database

- MySQL

### Cloud / Storage

- AWS S3 for room and hotel image storage

### Development Tools

- Git
- GitHub
- VS Code
- Eclipse / IntelliJ IDEA
- Postman

---

## 🏗️ System Architecture

```text
                    ┌─────────────────────┐
                    │      User           │
                    │   Web Browser       │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   React Frontend    │
                    │                     │
                    │ React + Vite        │
                    │ Tailwind CSS         │
                    │ React Router         │
                    │ Clerk Authentication │
                    └──────────┬──────────┘
                               │
                         REST API Calls
                               │
                               ▼
                    ┌─────────────────────┐
                    │   Spring Boot       │
                    │      Backend        │
                    │                     │
                    │ Controllers         │
                    │ Services            │
                    │ JPA / Hibernate     │
                    └───────┬─────┬───────┘
                            │     │
                 ┌──────────┘     └──────────┐
                 ▼                           ▼
        ┌─────────────────┐        ┌─────────────────┐
        │     MySQL       │        │     AWS S3      │
        │                 │        │                 │
        │ Hotel Data      │        │ Room Images     │
        │ Room Data       │        │ Hotel Images    │
        │ Booking Data    │        │                 │
        └─────────────────┘        └─────────────────┘