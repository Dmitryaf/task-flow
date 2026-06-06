<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import TaskColumn from '@/components/TaskColumn.vue';
import { useTasksStore } from '@/stores/tasks';
import { type TaskStatus } from '@/types/task';

const router = useRouter();
const authStore = useAuthStore();
const tasksStore = useTasksStore();
const newTaskTitle = ref('');

onMounted(() => {
  tasksStore.fetchTasks();
});

const createTask = async () => {
  if (!newTaskTitle.value.trim()) return;

  const success = await tasksStore.addTask({ title: newTaskTitle.value });

  if (success) {
    newTaskTitle.value = '';
  }
};

const moveTask = async (taskId: number, newStatus: TaskStatus) => {
  await tasksStore.updateTask(taskId, { status: newStatus });
};

const deleteTask = async (taskId: number) => {
  await tasksStore.deleteTask(taskId);
};

const handleLogout = () => {
  authStore.logout();
  router.push('/login');
};
</script>

<template>
  <div class="board-page">
    <div class="header">
      <h1>TaskFlow</h1>
      <div class="user-info">
        <span>Welcome, {{ authStore.user?.name }}!</span>
        <button @click="handleLogout">Logout</button>
      </div>
    </div>

    <div class="add-task">
      <input
        v-model="newTaskTitle"
        placeholder="Add a new task"
        type="text"
        @keyup.enter="createTask"
      />

      <button :disabled="!newTaskTitle.trim()" @click="createTask">Add</button>
    </div>

    <div v-if="!tasksStore.loading" class="columns">
      <TaskColumn
        title="To Do"
        status="todo"
        :tasks="tasksStore.getTaskByStatus('todo')"
        @drop="moveTask"
        @delete="deleteTask"
      />
      <TaskColumn
        title="In Progress"
        status="in-progress"
        :tasks="tasksStore.getTaskByStatus('in-progress')"
        @drop="moveTask"
        @delete="deleteTask"
      />
      <TaskColumn
        title="Done"
        status="done"
        :tasks="tasksStore.getTaskByStatus('done')"
        @drop="moveTask"
        @delete="deleteTask"
      />

      <div v-if="tasksStore.loading" class="loading">Loading tasks...</div>
      <div v-if="tasksStore.error" class="error">{{ tasksStore.error }}</div>
    </div>
  </div>
</template>

<style scoped>
.board-page {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}
.user-info {
  display: flex;
  gap: 16px;
  align-items: center;
}
.add-task {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
}
.add-task input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}
.add-task button {
  padding: 10px 20px;
  background: #42b883;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.add-task button:disabled {
  background: #ccc;
  cursor: not-allowed;
}
.columns {
  display: flex;
  gap: 24px;
  overflow-x: auto;
}
.loading,
.error {
  text-align: center;
  padding: 40px;
}
.error {
  color: red;
}
</style>
