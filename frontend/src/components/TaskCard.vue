<script setup lang="ts">
import { DRAG_DATA_MIME_TYPE } from '@/constants/tasks';
import { type Task } from '@/types/task';

const props = defineProps<{
  task: Task;
}>();

const emit = defineEmits<{
  (e: 'delete', taskId: number): void;
}>();

const onDragStart = (event: DragEvent) => {
  event.dataTransfer?.setData(DRAG_DATA_MIME_TYPE, props.task.id.toString());
};

const onDelete = () => {
  emit('delete', props.task.id);
};
</script>

<template>
  <div class="task-card" draggable="true" @dragstart="onDragStart">
    <span class="task-title">{{ task.title }}</span>
    <button type="button" class="delete-btn" @click="onDelete">X</button>
  </div>
</template>

<style scoped>
.task-card {
  background: white;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  cursor: grab;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.task-card:active {
  cursor: grabbing;
}

.task-title {
  font-size: 14px;
}

.delete-btn {
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
  font-size: 18px;
}

.delete-btn:hover {
  color: red;
}
</style>
