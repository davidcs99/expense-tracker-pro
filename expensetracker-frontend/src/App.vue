<template>
  <v-app class="app-shell">
    <app-shell />
  </v-app>
</template>

<script setup lang="ts">
import AppShell from "@/components/layout/AppShell.vue";
</script>

<style>
:root {
  --expense-bg: #f5f7fc;
  --expense-surface: rgba(255, 255, 255, 0.9);
  --expense-surface-strong: #ffffff;
  --expense-border: rgba(90, 119, 158, 0.14);
  --expense-text: #1c2a3d;
  --expense-muted: #6f8098;
  --expense-primary: #4aa3df;
  --expense-primary-dark: #2f7fb8;
  --expense-accent: #8aa4bf;
  --expense-info: #8ac6ea;
  --expense-danger: #7f95ab;
  --expense-heading-font: "Palatino Linotype", "Book Antiqua", Palatino, Georgia, serif;
  --expense-body-font: "Aptos", "Segoe UI", "Helvetica Neue", Arial, sans-serif;
}

html,
body,
#app {
  min-height: 100%;
  margin: 0;
  background:
    radial-gradient(circle at top left, rgba(74, 163, 223, 0.16), transparent 28%),
    radial-gradient(circle at top right, rgba(138, 164, 191, 0.18), transparent 32%),
    linear-gradient(180deg, #f8fbff 0%, #edf3f8 100%);
  color: var(--expense-text);
  font-family: var(--expense-body-font);
  letter-spacing: 0.01em;
}

a {
  color: inherit;
}

h1,
h2,
h3,
h4,
.brand__title,
.hero-section__title,
.hero__title,
.dashboard-hero__copy h1 {
  font-family: var(--expense-heading-font);
  letter-spacing: -0.02em;
  font-weight: 700;
}

button,
.v-btn,
.v-chip,
.topbar__link {
  letter-spacing: 0.01em;
}

.v-btn {
  text-transform: none;
}

.app-shell {
  background: transparent;
}
</style>
