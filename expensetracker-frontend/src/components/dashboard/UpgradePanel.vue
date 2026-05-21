<template>
  <article class="upgrade-card">
    <p class="upgrade-card__eyebrow">Impulsa tu análisis</p>
    <h2>Desbloquea tendencias, promedios diarios y reportes premium.</h2>
    <p>
      El plan PREMIUM te permite profundizar en la evolución mensual, detectar tus categorías
      más costosas y tomar decisiones con mejores visualizaciones.
    </p>
    <v-btn color="primary" rounded="pill" class="text-none">Conocer beneficios</v-btn>
  </article>
</template>

<style scoped>
.upgrade-card {
  padding: 1.5rem;
  border-radius: 28px;
  background: linear-gradient(135deg, rgba(74, 163, 223, 0.08), #ffffff);
  border: 1px solid rgba(74, 163, 223, 0.24);
}

.upgrade-card__eyebrow {
  color: var(--expense-primary-dark);
  font-weight: 700;
}

.upgrade-card h2 {
  margin: 0.45rem 0 0.8rem;
  max-width: 18ch;
}

.upgrade-card p:last-of-type {
  color: var(--expense-muted);
  line-height: 1.7;
  margin-bottom: 1.25rem;
}
</style>
