<script setup lang="ts">
import TaskCard from '@/components/TaskCard.vue';
import { DRAG_DATA_MIME_TYPE } from '@/constants/tasks';
import { type Task, type TaskStatus } from '@/types/task';

const props = defineProps<{
  title: string;
  status: TaskStatus;
  tasks: Task[];
}>();

const emit = defineEmits<{
  (e: 'drop', taskId: number, newStatus: TaskStatus): void;
  (e: 'delete', taskId: number): void;
}>();

const onDrop = (event: DragEvent) => {
  const rawId = event.dataTransfer?.getData(DRAG_DATA_MIME_TYPE);
  if (!rawId) {
    return;
  }

  const taskId = parseInt(rawId, 10);
  if (!Number.isNaN(taskId)) {
    emit('drop', taskId, props.status);
  }
};

const onDeleteTask = (taskId: number) => {
  emit('delete', taskId);
};
</script>

<template>
  <div class="column" @dragover.prevent @drop="onDrop">
    <h3>{{ title }}</h3>
    <div class="tasks">
      <TaskCard v-for="task in tasks" :key="task.id" :task="task" @delete="onDeleteTask" />
    </div>
  </div>
</template>

<style scoped>
.column {
  background: #f4f5f7;
  border-radius: 8px;
  width: 300px;
  padding: 12px;
  min-height: 400px;
}
.column h3 {
  margin: 0 0 12px 0;
  font-size: 16px;
}
.tasks {
  min-height: 200px;
}
</style>
