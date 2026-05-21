<template>
  <article class="category-card">
    <div class="category-card__header">
      <div>
        <p class="category-card__eyebrow">Categorías más activas</p>
        <h2>Distribución rápida</h2>
      </div>
      <v-chip color="primary" variant="tonal">{{ categoryCount }} categorías</v-chip>
    </div>

    <div class="category-card__list">
      <div v-for="category in categories" :key="category.name" class="category-card__item">
        <div class="category-card__meta">
          <span class="category-card__swatch" :style="{ background: category.color }"></span>
          <div>
            <strong>{{ category.name }}</strong>
            <small>{{ category.caption }}</small>
          </div>
        </div>
        <span class="category-card__amount">{{ category.amount }}</span>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
defineProps<{
  categories: Array<{
    name: string;
    caption: string;
    amount: string;
    color: string;
  }>;
  categoryCount: number;
}>();
</script>

<style scoped>
.category-card {
  padding: 1.5rem;
  border-radius: 28px;
  border: 1px solid var(--expense-border);
  background: var(--expense-surface-strong);
}

.category-card__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}

.category-card__eyebrow,
.category-card__item small {
  color: var(--expense-muted);
}

.category-card__list {
  margin-top: 1.2rem;
  display: grid;
  gap: 0.85rem;
}

.category-card__item,
.category-card__meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.category-card__meta {
  gap: 0.75rem;
  justify-content: flex-start;
}

.category-card__swatch {
  width: 14px;
  height: 14px;
  border-radius: 50%;
}

.category-card__amount {
  font-weight: 700;
}
</style>
