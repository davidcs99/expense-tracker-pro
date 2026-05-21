<template>
  <article class="limit-card">
    <div class="limit-card__header">
      <div>
        <p class="limit-card__eyebrow">Uso del plan</p>
        <h2>{{ title }}</h2>
      </div>
      <v-chip :color="chipColor" variant="flat">{{ statusLabel }}</v-chip>
    </div>

    <div class="limit-card__progress">
      <div class="limit-card__progress-bar">
        <span :style="{ width: `${progress}%` }"></span>
      </div>
      <strong>{{ progress }}%</strong>
    </div>

    <p class="limit-card__copy">{{ description }}</p>
  </article>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  statusLabel: string;
  chipColor: string;
  progress: number;
  description: string;
}>();
</script>

<style scoped>
.limit-card {
  padding: 1.5rem;
  border-radius: 28px;
  border: 1px solid var(--expense-border);
  background: var(--expense-surface-strong);
}

.limit-card__header {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.limit-card__eyebrow,
.limit-card__copy {
  color: var(--expense-muted);
}

.limit-card__header h2 {
  margin: 0.2rem 0 0;
}

.limit-card__progress {
  display: flex;
  align-items: center;
  gap: 0.9rem;
  margin: 1.25rem 0 0.85rem;
}

.limit-card__progress-bar {
  flex: 1;
  height: 12px;
  border-radius: 999px;
  background: rgba(111, 128, 152, 0.16);
  overflow: hidden;
}

.limit-card__progress-bar span {
  display: block;
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, var(--expense-accent), var(--expense-primary));
}
</style>
