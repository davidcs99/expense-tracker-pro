<template>
  <section class="hero-section">
    <div class="hero-section__copy">
      <span class="hero-section__eyebrow">Control financiero personal, claro y moderno</span>
      <h1 class="hero-section__title">
        ExpenseTracker Pro te ayuda a registrar, entender y mejorar tus gastos sin fricción.
      </h1>
      <p class="hero-section__description">
        Diseñado para usuarios que quieren orden, claridad y una experiencia visual elegante.
        Registra movimientos en segundos, monitorea tu progreso mensual y descubre patrones útiles
        con reportes pensados para acompañar tu crecimiento financiero.
      </p>

      <div class="hero-section__actions">
        <v-btn
          v-if="!isAuthenticated"
          color="primary"
          size="x-large"
          rounded="pill"
          class="text-none"
          @click="$emit('login')"
        >
          Entrar con Auth0
        </v-btn>
        <v-btn
          v-else
          to="/dashboard"
          variant="outlined"
          size="x-large"
          rounded="pill"
          class="text-none"
        >
          Ir al dashboard
        </v-btn>
        <v-btn
          to="/reports"
          variant="text"
          size="large"
          class="text-none hero-section__ghost"
        >
          Ver cómo se siente la experiencia
        </v-btn>
      </div>

      <div class="hero-section__trust">
        <div class="hero-section__trust-item">
          <strong>Acceso seguro</strong>
          <span>Auth0 y JWT para una sesión confiable</span>
        </div>
        <div class="hero-section__trust-item">
          <strong>Planes con propósito</strong>
          <span>FREE para empezar, PREMIUM para profundizar</span>
        </div>
        <div class="hero-section__trust-item">
          <strong>Visualización clara</strong>
          <span>Resumen, categorías y análisis en una sola experiencia</span>
        </div>
      </div>
    </div>

    <div class="hero-section__visual">
      <div class="hero-mockup hero-mockup--primary">
        <div class="hero-mockup__header">
          <span class="hero-mockup__tag">Resumen del mes</span>
          <span class="hero-mockup__trend">Balance estable</span>
        </div>
        <div class="hero-mockup__amount">$1,284.50</div>
        <div class="hero-mockup__progress">
          <span class="hero-mockup__progress-bar"></span>
        </div>
        <div class="hero-mockup__footer">35 movimientos registrados con seguimiento del límite FREE</div>
      </div>

      <div class="hero-insights">
        <div class="hero-insights__card">
          <span class="hero-insights__label">Categoría dominante</span>
          <strong>Alimentación</strong>
          <small>32% del gasto total</small>
        </div>
        <div class="hero-insights__card">
          <span class="hero-insights__label">Alerta preventiva</span>
          <strong>80% del límite</strong>
          <small>Observer listo para notificar</small>
        </div>
        <div class="hero-insights__card hero-insights__card--accent">
          <span class="hero-insights__label">Experiencia PREMIUM</span>
          <strong>Tendencias y comparativas</strong>
          <small>Más contexto para decidir mejor</small>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  isAuthenticated: boolean;
}>();

defineEmits<{
  (event: "login"): void;
}>();
</script>

<style scoped>
.hero-section {
  display: grid;
  grid-template-columns: minmax(640px, 1.35fr) minmax(420px, 0.9fr);
  gap: 1.25rem;
  align-items: stretch;
  min-height: 620px;
}

.hero-section__copy,
.hero-section__visual {
  position: relative;
  overflow: hidden;
  border-radius: 34px;
  border: 1px solid var(--expense-border);
  background: var(--expense-surface);
  backdrop-filter: blur(16px);
}

.hero-section__copy {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 2.6rem 2.8rem;
}

.hero-section__copy::before {
  content: "";
  position: absolute;
  inset: auto auto -80px -60px;
  width: 220px;
  height: 220px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(138, 164, 191, 0.2), transparent 70%);
}

.hero-section__eyebrow {
  display: inline-block;
  margin-bottom: 1rem;
  padding: 0.5rem 0.9rem;
  border-radius: 999px;
  background: rgba(52, 152, 219, 0.12);
  color: var(--expense-primary-dark);
  font-weight: 700;
  font-size: 0.82rem;
}

.hero-section__title {
  margin: 0 0 1rem;
  max-width: 14ch;
  font-size: clamp(1.9rem, 2.6vw, 3rem);
  line-height: 1.08;
}

.hero-section__description {
  max-width: 60ch;
  margin: 0;
  color: var(--expense-muted);
  font-size: 0.97rem;
  line-height: 1.72;
}

.hero-section__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.85rem;
  margin-top: 1.8rem;
}

.hero-section__ghost {
  color: var(--expense-primary-dark);
}

.hero-section__trust {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.85rem;
  margin-top: 2.2rem;
}

.hero-section__trust-item {
  padding: 1rem;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid var(--expense-border);
}

.hero-section__trust-item strong {
  display: block;
  margin-bottom: 0.25rem;
}

.hero-section__trust-item span {
  color: var(--expense-muted);
  font-size: 0.9rem;
  line-height: 1.5;
}

.hero-section__visual {
  display: grid;
  align-content: space-between;
  gap: 1rem;
  padding: 1.35rem 1.35rem 1.5rem;
  background:
    radial-gradient(circle at top right, rgba(74, 163, 223, 0.14), transparent 32%),
    radial-gradient(circle at bottom left, rgba(138, 164, 191, 0.18), transparent 28%),
    rgba(255, 255, 255, 0.72);
}

.hero-mockup {
  border-radius: 30px;
  padding: 1.5rem;
}

.hero-mockup--primary {
  color: white;
  background: linear-gradient(155deg, #2f7fb8, #4aa3df 58%, #8aa4bf);
  box-shadow: 0 22px 40px rgba(74, 163, 223, 0.24);
}

.hero-mockup__header,
.hero-insights__card {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.hero-mockup__tag,
.hero-mockup__footer,
.hero-insights__label,
.hero-insights__card small {
  opacity: 0.85;
}

.hero-mockup__amount {
  font-size: 2.05rem;
  font-weight: 800;
  margin: 0.75rem 0;
}

.hero-mockup__progress {
  height: 12px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.2);
  overflow: hidden;
}

.hero-mockup__progress-bar {
  display: block;
  width: 72%;
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, #d6ecfb, #edf4f9);
}

.hero-mockup__footer {
  margin-top: 0.8rem;
  line-height: 1.5;
  font-size: 0.92rem;
}

.hero-insights {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.85rem;
}

.hero-insights__card {
  align-items: center;
  padding: 0.95rem 1.05rem;
  border-radius: 22px;
  background: white;
  border: 1px solid var(--expense-border);
}

.hero-insights__card strong {
  display: block;
  font-size: 0.96rem;
}

.hero-insights__card small {
  color: var(--expense-muted);
  line-height: 1.45;
  font-size: 0.86rem;
}

.hero-insights__card--accent {
  background: linear-gradient(135deg, rgba(74, 163, 223, 0.08), rgba(138, 164, 191, 0.1), #ffffff);
}

@media (max-width: 1080px) {
  .hero-section {
    grid-template-columns: 1fr;
    min-height: auto;
  }
}

@media (max-width: 760px) {
  .hero-section__copy {
    padding: 2rem;
  }

  .hero-section__trust {
    grid-template-columns: 1fr;
  }

  .hero-section__title {
    font-size: clamp(1.7rem, 7vw, 2.3rem);
  }
}
</style>
