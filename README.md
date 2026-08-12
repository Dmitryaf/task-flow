# TaskFlow

TaskFlow is a compact full-stack task manager built as a practical demonstration of authenticated frontend and backend workflows.

Users can register, sign in, and manage their own tasks on a three-column kanban board. The project is intentionally small and uses in-memory backend storage rather than presenting itself as a production service.

## Features

- registration and sign-in with JWT authentication;
- protected frontend routes and authenticated backend endpoints;
- task creation, editing, deletion, and status updates;
- `todo`, `in-progress`, and `done` columns;
- drag-and-drop status changes;
- per-user task isolation;
- runtime validation of authentication and task payloads.

## Engineering highlights

- Pinia stores keep authentication and task state separate from page components.
- A shared Axios client attaches authentication tokens to API requests.
- Express middleware protects task routes before domain operations run.
- Backend services and repositories separate HTTP handling, business rules, and storage.
- Runtime validators reject malformed registration, login, create-task, and update-task payloads.
- Backend integration tests cover authentication, ownership boundaries, validation, and task operations.
- Frontend tests cover the authentication and task stores, including error states.

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
