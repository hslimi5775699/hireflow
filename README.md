
# HireFlow — Recruitment Management Platform

A modern, full-stack recruitment management application built to simplify hiring workflows.

HireFlow helps recruiters manage job openings, organize candidates, track hiring stages, and monitor recruitment activity through a clean, responsive dashboard.

**Live Demo:** https://hireflow-ebon-gamma.vercel.app

**GitHub Repository:** https://github.com/hslimi5775699/hireflow

---

## Overview

HireFlow is a portfolio SaaS-style application designed to demonstrate full-stack web development skills.

It combines a modern user interface with secure authentication, database-backed workflows, and cloud deployment.

Users can create an account, manage their own job openings, add candidates, and update candidate statuses throughout the recruitment process.

## Features

### Authentication
- User registration and login
- Password hashing with bcryptjs
- Session management using signed JWTs
- Cookie-based authentication
- Protected dashboard and application routes

### Job Management
- Create new job openings
- View all jobs in a workspace
- Track active positions
- Display the number of candidates for each job

### Candidate Management
- Add candidates to job openings
- View candidate profiles and associated jobs
- Update candidate hiring statuses
- Track candidates through the recruitment pipeline

### Recruitment Dashboard
- Active job statistics
- Total candidate count
- Interview and hired candidate statistics
- Recent candidate activity
- Visual hiring pipeline overview

### Responsive Interface
- Modern dashboard layout
- Navy, indigo, and slate design system
- Responsive pages
- Clean and intuitive navigation

---

## Tech Stack

| Category | Technology |
| --- | --- |
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| UI | React 19 |
| Styling | Tailwind CSS 4 |
| Database | PostgreSQL (Neon) |
| ORM | Prisma 6 |
| Database Driver | Prisma PostgreSQL Adapter |
| Authentication | JWT, jose, bcryptjs |
| Deployment | Vercel |
| Version Control | Git and GitHub |

---

## Getting Started

### Prerequisites

Before running the project locally, install:

- Node.js
- npm
- Git
- A PostgreSQL database, such as Neon

### 1. Clone the Repository

```bash
git clone https://github.com/hslimi5775699/hireflow.git
cd hireflow
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the project root and configure the environment variables required by the application.

Example:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST/DATABASE?sslmode=require"
JWT_SECRET="replace-with-a-long-random-secret"
```

Replace these placeholders with your own secure values.

**Never commit real database credentials or authentication secrets to GitHub.**

### 4. Generate Prisma Client

```bash
npx prisma generate
```

### 5. Apply the Database Schema

For an initial development database, use:

```bash
npx prisma db push
```

### 6. Start the Development Server

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

---

## Main Application Routes

| Route | Description |
| --- | --- |
| `/` | Landing page |
| `/register` | Create an account |
| `/login` | Sign in |
| `/dashboard` | Recruitment overview |
| `/jobs` | View job openings |
| `/jobs/new` | Create a job |
| `/candidates` | Manage candidates |
| `/candidates/new` | Add a candidate |

---

## Deployment

HireFlow is deployed on Vercel and uses Neon PostgreSQL for persistent data storage.

To deploy your own instance:

1. Fork or clone the repository.
2. Create a PostgreSQL database.
3. Configure the required environment variables in Vercel.
4. Deploy the project.
5. Verify that authentication and database operations work.

**Production Application:**

https://hireflow-ebon-gamma.vercel.app

---

## Future Improvements

Potential enhancements include:

- Candidate search and advanced filtering
- Resume uploads
- Interview scheduling
- Email notifications
- Role-based access control
- Recruitment analytics
- Drag-and-drop Kanban pipeline

---

## Project Purpose

HireFlow was created as a full-stack portfolio project to demonstrate practical experience with:

- Modern React and Next.js development
- TypeScript
- Server-side rendering and API routes
- Relational database modeling
- Authentication and protected routes
- Full-stack CRUD workflows
- Responsive interface design
- Production deployment and debugging

---

## Author

Developed by **hslimi5775699**.

GitHub: https://github.com/hslimi5775699

---

## License

This project is currently presented as a portfolio application. No open-source license has been specified.
