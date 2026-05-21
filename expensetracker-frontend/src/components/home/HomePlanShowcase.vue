<template>
  <section class="plan-showcase">
    <div class="plan-showcase__header">
      <span class="plan-showcase__eyebrow">Planes que acompañan distintas etapas de uso</span>
      <h2>Desde el control esencial hasta el análisis profundo, cada plan comunica un beneficio claro.</h2>
    </div>

    <div class="plan-showcase__grid">
      <article
        v-for="plan in plans"
        :key="plan.name"
        class="plan-card"
        :class="{ 'plan-card--premium': plan.name === 'PREMIUM' }"
      >
        <div class="plan-card__top">
          <div>
            <span class="plan-card__name">{{ plan.name }}</span>
            <h3>{{ plan.highlight }}</h3>
          </div>
          <v-chip :color="plan.name === 'PREMIUM' ? 'info' : 'primary'" variant="flat">
            {{ plan.name }}
          </v-chip>
        </div>

        <p class="plan-card__description">{{ plan.description }}</p>

        <div class="plan-card__list">
          <div v-for="item in plan.items" :key="item" class="plan-card__item">
            <v-icon icon="mdi-check-circle-outline" size="18" />
            <span>{{ item }}</span>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  plans: Array<{
    name: string;
    highlight: string;
    description: string;
    items: string[];
  }>;
}>();
</script>

<style scoped>
.plan-showcase {
  display: grid;
  gap: 1rem;
}

.plan-showcase__header {
  max-width: 760px;
}

.plan-showcase__eyebrow {
  color: var(--expense-primary-dark);
  font-weight: 700;
}

.plan-showcase__header h2 {
  margin: 0.55rem 0 0;
  font-size: clamp(1.35rem, 1.9vw, 1.85rem);
  line-height: 1.15;
}

.plan-showcase__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.plan-card {
  padding: 1.45rem;
  border-radius: 30px;
  border: 1px solid var(--expense-border);
  background: var(--expense-surface);
}

.plan-card--premium {
  background: linear-gradient(145deg, rgba(74, 163, 223, 0.08), rgba(138, 164, 191, 0.1), rgba(255, 255, 255, 0.96));
  border-color: rgba(138, 164, 191, 0.3);
}

.plan-card__top {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: flex-start;
}

.plan-card__name {
  color: var(--expense-muted);
  font-weight: 700;
  letter-spacing: 0.08em;
}

.plan-card h3 {
  margin: 0.35rem 0 0;
  font-size: 1.15rem;
  line-height: 1.2;
}

.plan-card__description {
  margin: 1rem 0 1.25rem;
  color: var(--expense-muted);
  line-height: 1.7;
  font-size: 0.95rem;
}

.plan-card__list {
  display: grid;
  gap: 0.85rem;
}

.plan-card__item {
  display: flex;
  gap: 0.65rem;
  align-items: center;
}

@media (max-width: 920px) {
  .plan-showcase__grid {
    grid-template-columns: 1fr;
  }
}
</style>
