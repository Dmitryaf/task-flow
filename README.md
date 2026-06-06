# TaskFlow — менеджер задач

## 🚀 Стек

**Фронтенд:**

- Vue 3 + Composition API + TypeScript
- Pinia
- Vue Router
- Axios

**Бэкенд:**

- Node.js + Express + TypeScript
- JWT
- bcryptjs

---

## 🏗️ Архитектура

| Слой          | Описание                              |
| ------------- | ------------------------------------- |
| `api/`        | Axios-клиент, интерсепторы, эндпоинты |
| `stores/`     | Pinia-хранилища                       |
| `pages/`      | Страницы приложения                   |
| `components/` | Переиспользуемые UI-компоненты        |
| `types/`      | TypeScript-интерфейсы                 |

---

## 🎯 Возможности

- ✅ Регистрация и авторизация (JWT)
- ✅ Создание, редактирование, удаление задач
- ✅ Drag-and-drop между статусами
- ✅ Приватные роуты (guards)
- ✅ Автоматическая подстановка токена в заголовки

---

## 🛠️ Запуск проекта

### Backend

```bash
cd backend
npm install
npm run dev


cd frontend
npm install
npm run dev
```
