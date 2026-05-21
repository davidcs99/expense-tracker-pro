<template>
  <article class="chart-card">
    <div class="chart-card__header">
      <div>
        <p class="chart-card__eyebrow">{{ eyebrow }}</p>
        <h2>{{ title }}</h2>
      </div>
      <v-chip color="primary" variant="tonal">PREMIUM</v-chip>
    </div>

    <div class="chart-card__bars">
      <div v-for="item in bars" :key="item.label" class="chart-card__row">
        <div class="chart-card__labels">
          <strong>{{ item.label }}</strong>
          <small>{{ item.valueLabel }}</small>
        </div>
        <div class="chart-card__track">
          <span class="chart-card__fill" :style="{ width: `${item.percentage}%` }"></span>
        </div>
      </div>

      <div v-if="!bars.length" class="chart-card__empty">
        No hay datos suficientes para construir la visualización.
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
defineProps<{
  eyebrow: string;
  title: string;
  bars: Array<{
    label: string;
    valueLabel: string;
    percentage: number;
  }>;
}>();
</script>

<style scoped>
.chart-card {
  padding: 1.5rem;
  border-radius: 28px;
  border: 1px solid var(--expense-border);
  background: var(--expense-surface);
}

.chart-card__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}

.chart-card__eyebrow,
.chart-card__labels small,
.chart-card__empty {
  color: var(--expense-muted);
}

.chart-card__bars {
  display: grid;
  gap: 1rem;
  margin-top: 1.25rem;
}

.chart-card__row {
  display: grid;
  gap: 0.45rem;
}

.chart-card__labels {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.chart-card__track {
  width: 100%;
  height: 14px;
  border-radius: 999px;
  background: rgba(138, 164, 191, 0.16);
  overflow: hidden;
}

.chart-card__fill {
  display: block;
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, var(--expense-accent), var(--expense-primary));
}
</style>
