# TaskFlow

TaskFlow is a small full-stack task manager. It demonstrates registration, sign-in, protected API requests, and task management in one project.

Users can create an account, sign in, and manage their own tasks on a three-column kanban board. The backend keeps data in memory, so the project is a demo rather than a production service.

## Features

- registration and sign-in with JWT authentication;
- protected frontend routes and authenticated backend endpoints;
- task creation, editing, deletion, and status updates;
- `todo`, `in-progress`, and `done` columns;
- drag-and-drop status changes;
- per-user task isolation;
- validation of account and task data while the server is running.

## Engineering highlights

- Pinia stores keep account and task state outside page components.
- A shared Axios client adds the authentication token to API requests.
- Express middleware checks the user before protected task operations run.
- Backend modules keep HTTP handling, task rules, and storage separate.
- Runtime validators reject invalid registration, sign-in, and task data.
- Backend tests cover authentication, access to another user's tasks, validation, and task operations.
- Frontend tests cover account and task stores, including errors.

## Stack

**Frontend:** Vue 3, TypeScript, Pinia, Vue Router, Axios, Vite, Vitest

**Backend:** Node.js, Express, TypeScript, JWT, bcryptjs, Vitest, Supertest

## Architecture

```text
frontend/src/
  api/          API client and endpoint modules
  components/   reusable UI components
  pages/        route-level screens
  router/       routes and navigation guards
  stores/       Pinia state and async workflows
  types/        TypeScript contracts
  utils/        shared helpers

backend/src/
  routes/        HTTP endpoints
  middleware/    authentication boundary
  services/      business logic
  repositories/  in-memory persistence
  validators/    runtime payload validation
  config/        server and authentication settings
  types/         backend contracts
```

## Tests

Backend tests cover registration, login, invalid payloads, authenticated access, task ownership, and CRUD operations. Frontend tests cover the Pinia authentication and task stores.

```bash
cd backend
npm install
npm test

cd ../frontend
npm install
npm test
```

## Local setup

Start the backend:

```bash
cd backend
npm install
copy .env.example .env
npm run dev
```

The default backend URL is `http://localhost:5000`.

Start the frontend in another terminal:

```bash
cd frontend
npm install
copy .env.example .env
npm run dev
```

The example environment files define `PORT`, `JWT_SECRET`, and `VITE_API_BASE_URL`. Replace the example JWT secret for local use.
