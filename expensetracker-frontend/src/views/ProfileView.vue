<template>
  <section class="profile-view">
    <v-row>
      <v-col cols="12" md="4">
        <v-card class="profile-card rounded-xl" elevation="0">
          <v-card-text class="text-center pa-8">
            <v-avatar size="120" class="mb-4">
              <v-img :src="user?.picture" :alt="user?.name" cover />
            </v-avatar>
            <h1 class="text-h4 font-weight-bold">{{ user?.name }}</h1>
            <p class="text-medium-emphasis mb-6">{{ user?.email }}</p>
            <v-chip color="primary" variant="flat">{{ subscriptionLabel }}</v-chip>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="8">
        <v-card class="rounded-xl" elevation="0">
          <v-card-text class="pa-8">
            <h2 class="text-h5 font-weight-bold mb-4">Información de usuario</h2>
            <v-list lines="two">
              <v-list-item title="Nombre" :subtitle="user?.name || 'Sin dato'" />
              <v-list-item title="Correo" :subtitle="user?.email || 'Sin dato'" />
              <v-list-item title="Usuario" :subtitle="user?.nickname || 'Sin dato'" />
              <v-list-item title="Última actualización" :subtitle="formattedUpdatedAt" />
              <v-list-item title="ID Auth0" :subtitle="user?.sub || 'Sin dato'" />
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useAuth0 } from "@auth0/auth0-vue";

const { user } = useAuth0();

const roles = computed<string[]>(() => user.value?.["https://securityApp.com/roles"] || []);
const subscriptionLabel = computed(() => roles.value.some((role) => role.includes("Premium")) ? "PREMIUM" : "FREE");

const formattedUpdatedAt = computed(() => {
  const updatedAt = user.value?.updated_at;

  if (!updatedAt) {
    return "Sin dato";
  }

  return new Intl.DateTimeFormat("es-EC", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(new Date(updatedAt));
});
</script>

<style scoped>
.profile-view .v-card {
  border: 1px solid var(--expense-border);
  background: var(--expense-surface);
}

.profile-card {
  min-height: 100%;
}
</style>
