<template>
  <section class="metrics-grid">
    <article v-for="metric in metrics" :key="metric.label" class="metric-card">
      <div class="metric-card__icon" :style="{ background: metric.iconBackground }">
        <v-icon :icon="metric.icon" size="20" />
      </div>
      <div class="metric-card__content">
        <span>{{ metric.label }}</span>
        <strong>{{ metric.value }}</strong>
        <small>{{ metric.caption }}</small>
      </div>
    </article>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  metrics: Array<{
    label: string;
    value: string;
    caption: string;
    icon: string;
    iconBackground: string;
  }>;
}>();
</script>

<style scoped>
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1rem;
}

.metric-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.2rem;
  border-radius: 24px;
  border: 1px solid var(--expense-border);
  background: var(--expense-surface-strong);
  box-shadow: 0 12px 28px rgba(47, 127, 184, 0.06);
}

.metric-card__icon {
  width: 46px;
  height: 46px;
  border-radius: 16px;
  display: grid;
  place-items: center;
}

.metric-card__content {
  display: grid;
  gap: 0.15rem;
}

.metric-card__content span,
.metric-card__content small {
  color: var(--expense-muted);
}

.metric-card__content strong {
  font-size: 1.4rem;
}

@media (max-width: 1080px) {
  .metrics-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 620px) {
  .metrics-grid {
    grid-template-columns: 1fr;
  }
}
</style>
