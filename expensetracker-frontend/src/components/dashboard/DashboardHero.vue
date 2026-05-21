<template>
  <section class="dashboard-hero">
    <div class="dashboard-hero__copy">
      <p class="dashboard-hero__eyebrow">Tu centro financiero personal</p>
      <h1>Hola, {{ firstName }}. Hoy tus gastos están bajo control.</h1>
      <p>
        Monitorea tus transacciones, revisa el avance de tu límite y descubre oportunidades
        para optimizar tu presupuesto mensual desde una sola vista.
      </p>
    </div>

    <div class="dashboard-hero__spotlight">
      <div class="dashboard-hero__spotlight-label">Suscripción actual</div>
      <div class="dashboard-hero__spotlight-value">{{ plan }}</div>
      <div class="dashboard-hero__spotlight-note">
        {{ plan === "PREMIUM" ? "Acceso completo a reportes avanzados." : "Te acompañamos a usar mejor tu límite mensual." }}
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  userName?: string;
  plan: string;
}>();

const firstName = computed(() => props.userName?.split(" ")[0] || "usuario");
</script>

<style scoped>
.dashboard-hero {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 280px;
  gap: 1.25rem;
}

.dashboard-hero__copy,
.dashboard-hero__spotlight {
  border-radius: 28px;
  border: 1px solid var(--expense-border);
  background: var(--expense-surface);
  padding: 1.75rem;
}

.dashboard-hero__eyebrow {
  color: var(--expense-primary-dark);
  font-weight: 700;
  margin-bottom: 0.75rem;
}

.dashboard-hero__copy h1 {
  font-size: clamp(2rem, 4vw, 3rem);
  line-height: 1;
  margin: 0 0 0.85rem;
}

.dashboard-hero__copy p:last-child {
  color: var(--expense-muted);
  line-height: 1.7;
  margin: 0;
}

.dashboard-hero__spotlight {
  background: linear-gradient(180deg, rgba(74, 163, 223, 0.12), rgba(138, 164, 191, 0.18));
}

.dashboard-hero__spotlight-label {
  color: var(--expense-muted);
}

.dashboard-hero__spotlight-value {
  font-size: 2rem;
  font-weight: 800;
  margin: 0.35rem 0;
}

.dashboard-hero__spotlight-note {
  color: var(--expense-muted);
}

@media (max-width: 920px) {
  .dashboard-hero {
    grid-template-columns: 1fr;
  }
}
</style>
