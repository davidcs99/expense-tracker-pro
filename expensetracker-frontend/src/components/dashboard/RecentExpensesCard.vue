<template>
  <article class="recent-card">
    <div class="recent-card__header">
      <div>
        <p class="recent-card__eyebrow">Actividad reciente</p>
        <h2>Últimos gastos</h2>
      </div>
      <v-chip color="info" variant="tonal">{{ expenses.length }} items</v-chip>
    </div>

    <div class="recent-card__list">
      <div v-for="expense in expenses" :key="expense.id" class="recent-card__item">
        <div class="recent-card__meta">
          <span class="recent-card__swatch" :style="{ background: expense.categoryColor || '#8ac6ea' }"></span>
          <div>
            <strong>{{ expense.categoryName }}</strong>
            <small>{{ expense.description || "Sin descripción" }}</small>
          </div>
        </div>
        <div class="recent-card__amount">
          <strong>{{ expense.amount }}</strong>
          <small>{{ expense.date }}</small>
        </div>
      </div>

      <div v-if="!expenses.length" class="recent-card__empty">
        No hay gastos recientes para mostrar.
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
defineProps<{
  expenses: Array<{
    id: number;
    categoryName: string;
    categoryColor?: string;
    description: string;
    amount: string;
    date: string;
  }>;
}>();
</script>

<style scoped>
.recent-card {
  padding: 1.5rem;
  border-radius: 28px;
  border: 1px solid var(--expense-border);
  background: var(--expense-surface-strong);
}

.recent-card__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}

.recent-card__eyebrow,
.recent-card__meta small,
.recent-card__amount small,
.recent-card__empty {
  color: var(--expense-muted);
}

.recent-card__list {
  display: grid;
  gap: 0.85rem;
  margin-top: 1.2rem;
}

.recent-card__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.recent-card__meta {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.recent-card__swatch {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  flex-shrink: 0;
}

.recent-card__amount {
  text-align: right;
}

.recent-card__empty {
  padding: 1rem 0;
}
</style>
