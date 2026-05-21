<template>
  <v-menu location="bottom end" offset="14">
    <template #activator="{ props }">
      <button class="profile-trigger" type="button" v-bind="props">
        <img :src="user.picture" :alt="user.name" class="profile-trigger__avatar" />
        <div class="profile-trigger__meta">
          <span class="profile-trigger__name">{{ user.name }}</span>
          <span class="profile-trigger__plan">{{ subscriptionLabel }}</span>
        </div>
        <v-icon icon="mdi-chevron-down" size="18" />
      </button>
    </template>

    <v-card min-width="260" rounded="xl" class="profile-card">
      <div class="profile-card__header">
        <img :src="user.picture" :alt="user.name" class="profile-card__avatar" />
        <div>
          <div class="profile-card__name">{{ user.name }}</div>
          <div class="profile-card__email">{{ user.email }}</div>
        </div>
      </div>

      <div class="profile-card__content">
        <router-link class="profile-card__link" to="/profile" @click="$emit('navigate')">
          <v-icon icon="mdi-account-outline" size="18" />
          Ver perfil
        </router-link>
        <router-link class="profile-card__link" to="/settings" @click="$emit('navigate')">
          <v-icon icon="mdi-cog-outline" size="18" />
          Configuración
        </router-link>
        <button class="profile-card__logout" type="button" @click="$emit('logout')">
          <v-icon icon="mdi-logout" size="18" />
          Cerrar sesión
        </button>
      </div>
    </v-card>
  </v-menu>
</template>

<script setup lang="ts">
defineProps<{
  user: {
    name?: string;
    email?: string;
    picture?: string;
  };
  subscriptionLabel: string;
}>();

defineEmits<{
  (event: "logout"): void;
  (event: "navigate"): void;
}>();
</script>

<style scoped>
.profile-trigger {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.35rem 0.5rem 0.35rem 0.35rem;
  border: 1px solid var(--expense-border);
  border-radius: 999px;
  background: white;
  cursor: pointer;
}

.profile-trigger__avatar,
.profile-card__avatar {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  object-fit: cover;
}

.profile-trigger__meta {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  line-height: 1.1;
}

.profile-trigger__name,
.profile-card__name {
  font-weight: 700;
}

.profile-trigger__plan {
  color: var(--expense-primary);
  font-size: 0.76rem;
  font-weight: 700;
}

.profile-card {
  border: 1px solid var(--expense-border);
}

.profile-card__header {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding: 1rem;
  border-bottom: 1px solid var(--expense-border);
}

.profile-card__email {
  color: var(--expense-muted);
  font-size: 0.84rem;
}

.profile-card__content {
  display: grid;
  gap: 0.35rem;
  padding: 0.75rem;
}

.profile-card__link,
.profile-card__logout {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  width: 100%;
  border: none;
  background: transparent;
  padding: 0.85rem 0.9rem;
  border-radius: 14px;
  color: var(--expense-text);
  text-decoration: none;
  text-align: left;
  cursor: pointer;
}

.profile-card__link:hover,
.profile-card__logout:hover {
  background: rgba(74, 163, 223, 0.08);
}
</style>
