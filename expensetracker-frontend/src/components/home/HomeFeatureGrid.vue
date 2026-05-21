<template>
  <section class="feature-grid">
    <div class="feature-grid__intro">
      <span class="feature-grid__eyebrow">Pensado para generar confianza desde el primer vistazo</span>
      <h2>Una propuesta clara para usuarios que quieren orden financiero sin complejidad.</h2>
      <p>
        ExpenseTracker Pro no solo registra gastos. Ayuda a entender hábitos, visualizar prioridades
        y mostrar con claridad cuándo conviene dar el salto a una experiencia más completa.
      </p>
    </div>

    <div class="feature-grid__cards">
      <article v-for="feature in features" :key="feature.title" class="feature-card">
        <div class="feature-card__icon" :style="{ background: feature.accent }">
          <v-icon :icon="feature.icon" size="24" />
        </div>
        <h3>{{ feature.title }}</h3>
        <p>{{ feature.description }}</p>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  features: Array<{
    title: string;
    description: string;
    icon: string;
    accent: string;
  }>;
}>();
</script>

<style scoped>
.feature-grid {
  display: grid;
  grid-template-columns: 320px minmax(0, 1fr);
  gap: 1rem;
}

.feature-grid__intro,
.feature-card {
  border-radius: 30px;
  border: 1px solid var(--expense-border);
  background: var(--expense-surface);
}

.feature-grid__intro {
  padding: 1.8rem;
}

.feature-grid__eyebrow {
  color: var(--expense-primary-dark);
  font-weight: 700;
}

.feature-grid__intro h2 {
  margin: 0.6rem 0 0.85rem;
  font-size: clamp(1.35rem, 1.9vw, 1.8rem);
  line-height: 1.15;
}

.feature-grid__intro p,
.feature-card p {
  color: var(--expense-muted);
  line-height: 1.7;
  margin: 0;
}

.feature-grid__cards {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
}

.feature-card {
  padding: 1.35rem;
}

.feature-card__icon {
  width: 52px;
  height: 52px;
  display: grid;
  place-items: center;
  border-radius: 18px;
  margin-bottom: 1rem;
}

.feature-card h3 {
  margin: 0 0 0.7rem;
  font-size: 0.98rem;
  line-height: 1.35;
}

@media (max-width: 1080px) {
  .feature-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 820px) {
  .feature-grid__cards {
    grid-template-columns: 1fr;
  }
}
</style>
