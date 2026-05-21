<template>
  <section class="home-view">
    <home-hero :is-authenticated="isAuthenticated" @login="login" />
    <home-feature-grid :features="features" />
    <home-plan-showcase :plans="plans" />
  </section>
</template>

<script setup lang="ts">
import { useAuth0 } from "@auth0/auth0-vue";
import HomeHero from "@/components/home/HomeHero.vue";
import HomeFeatureGrid from "@/components/home/HomeFeatureGrid.vue";
import HomePlanShowcase from "@/components/home/HomePlanShowcase.vue";

const auth0 = useAuth0();

const login = () => {
  auth0.loginWithRedirect();
};

const isAuthenticated = auth0.isAuthenticated;

const features = [
  {
    title: "Registro rápido y claro",
    description: "Agrega gastos con categoría, fecha, monto y descripción sin perder tiempo en formularios pesados.",
    icon: "mdi-notebook-plus-outline",
    accent: "rgba(74, 163, 223, 0.14)",
  },
  {
    title: "Alertas inteligentes",
    description: "Detecta cuándo un usuario FREE llega al 80% de su límite y actúa antes de perder control.",
    icon: "mdi-bell-ring-outline",
    accent: "rgba(138, 164, 191, 0.22)",
  },
  {
    title: "Reportes por suscripción",
    description: "Muestra valor real desde el plan FREE y eleva la experiencia PREMIUM con análisis más profundos.",
    icon: "mdi-chart-donut-variant",
    accent: "rgba(111, 128, 152, 0.18)",
  },
];

const plans = [
  {
    name: "FREE",
    highlight: "Ideal para comenzar",
    description: "Mantén ordenado tu mes, recibe alertas de límite y visualiza tus categorías principales.",
    items: ["Hasta 50 gastos por mes", "Resumen mensual", "Distribución básica por categoría"],
  },
  {
    name: "PREMIUM",
    highlight: "Pensado para análisis serio",
    description: "Profundiza en tendencias, compara períodos y descubre patrones con una experiencia más completa.",
    items: ["Gastos ilimitados", "Promedio diario y desglose mensual", "Reportes avanzados y comparativas"],
  },
];
</script>

<style scoped>
.home-view {
  display: grid;
  gap: 1.5rem;
  padding: 1.25rem 0 2.5rem;
}
</style>
