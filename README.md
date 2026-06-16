# TaskFlow

TaskFlow — небольшой fullstack task manager с авторизацией, CRUD задачами и kanban-доской.

## Возможности

- регистрация и логин пользователя;
- JWT-авторизация;
- приватные маршруты на frontend;
- protected routes на backend;
- создание и удаление задач;
- обновление статуса задач;
- статусы задач: `todo`, `in-progress`, `done`;
- kanban-доска с drag-and-drop сменой статуса.

## Стек

**Frontend**

- Vue 3
- TypeScript
- Pinia
- Vue Router
- Axios
- Vite
- Vitest

**Backend**

- Node.js
- Express
- TypeScript
- JWT
- bcryptjs
- Vitest
- Supertest

## Архитектура

Frontend разделён на несколько простых слоёв:

```text
src/
  api/          # axios client и API-методы
  components/   # UI-компоненты
  pages/        # страницы
  router/       # маршруты и guards
  stores/       # Pinia stores
  types/        # TypeScript-типы
  utils/        # вспомогательные функции
```

Backend устроен так:

```text
src/
  routes/        # HTTP routes
  services/      # бизнес-логика
  repositories/  # in-memory storage
  validators/    # runtime validation
  middleware/    # auth middleware
  config/        # конфигурация
  constants/     # константы
  types/         # TypeScript-типы
```

## Валидация

Backend валидирует входные данные в runtime:

- `register`: name, email, password;
- `login`: email, password;
- `create task`: title, optional status;
- `update task`: optional title, optional status.

## Тесты

В проекте есть базовые тесты.

Backend-тесты проверяют:

- регистрацию и логин;
- duplicate email;
- невалидные auth payload;
- доступ к задачам только с токеном;
- создание задач;
- получение только своих задач;
- запрет update/delete чужих задач;
- validation для update task.

Frontend-тесты проверяют Pinia stores:

- auth state;
- login/logout;
- состояние авторизации;
- загрузку, создание, обновление и удаление задач;
- фильтрацию задач по статусу.

## Запуск проекта

### Backend

```bash
cd backend
npm install
npm run dev
```

По умолчанию backend запускается на `http://localhost:5000`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Команды

### Backend

```bash
npm run dev
npm run build
npm run start
npm run test
```

### Frontend

```bash
npm run dev
npm run build
npm run preview
npm run lint
npm run format
npm run test
```

## Environment variables

В проекте есть `.env.example` файлы.

Backend:

```env
PORT=5000
JWT_SECRET=change-me-in-local-env
```

Frontend:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```
