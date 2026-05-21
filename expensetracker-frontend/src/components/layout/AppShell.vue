<template>
  <div class="shell">
    <top-nav-bar />
    <main class="shell__content">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import TopNavBar from "@/components/layout/TopNavBar.vue";
import { useAuthSession } from "@/composables/useAuthSession";

useAuthSession();
</script>

<style scoped>
.shell {
  min-height: 100vh;
}

.shell__content {
  max-width: 1240px;
  margin: 0 auto;
  padding: 1.5rem;
}

@media (max-width: 768px) {
  .shell__content {
    padding: 1rem;
  }
}
</style>
