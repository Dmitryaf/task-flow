<script setup lang="ts">
import TaskCard from '@/components/TaskCard.vue';
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

const onDragStart = (taskId: number) => {
  return taskId;
};

const onDrop = (event: DragEvent) => {
  const taskId = parseInt(event.dataTransfer?.getData('text/plain') || '0');
  if (taskId) {
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
      <TaskCard
        v-for="task in tasks"
        :key="task.id"
        :task="task"
        @dragstart="onDragStart"
        @delete="onDeleteTask"
      />
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
