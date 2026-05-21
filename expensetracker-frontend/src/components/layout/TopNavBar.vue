<template>
  <header class="topbar">
    <div class="topbar__inner">
      <router-link class="brand" to="/">
        <div class="brand__badge">
          <v-icon icon="mdi-wallet-outline" size="24" />
        </div>
        <div>
          <div class="brand__title">ExpenseTracker Pro</div>
          <div class="brand__subtitle">Control elegante de tus finanzas</div>
        </div>
      </router-link>

      <button
        class="topbar__toggle"
        type="button"
        :aria-expanded="isMenuOpen"
        aria-label="Abrir menú"
        @click="isMenuOpen = !isMenuOpen"
      >
        <span></span>
        <span></span>
      </button>

      <div class="topbar__panel" :class="{ 'topbar__panel--open': isMenuOpen }">
        <nav class="topbar__nav">
          <router-link
            v-for="item in navigationItems"
            :key="item.to"
            :to="item.to"
            class="topbar__link"
            @click="closeMenu"
          >
            {{ item.label }}
          </router-link>
        </nav>

        <div class="topbar__actions">
          <v-btn
            v-if="!isAuthenticated && !isLoading"
            class="text-none"
            color="primary"
            rounded="pill"
            size="large"
            @click="login"
          >
            Iniciar sesión
          </v-btn>

          <profile-menu
            v-else-if="isAuthenticated && user"
            :user="user"
            :subscription-label="subscriptionLabel"
            @logout="logout"
            @navigate="closeMenu"
          />
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useAuth0 } from "@auth0/auth0-vue";
import ProfileMenu from "@/components/layout/ProfileMenu.vue";
import { decodeJwtPayload } from "@/utils/jwt";

type NavItem = {
  label: string;
  to: string;
};

const auth0 = useAuth0();
const isMenuOpen = ref(false);
const roles = ref<string[]>([]);

const closeMenu = () => {
  isMenuOpen.value = false;
};

const readRoles = async () => {
  try {
    const { id_token } = await auth0.getAccessTokenSilently({ detailedResponse: true });
    const payload = decodeJwtPayload(id_token);
    roles.value = payload.roles || payload["https://securityApp.com/roles"] || [];
  } catch (error) {
    console.error("No se pudieron cargar los roles del usuario.", error);
    roles.value = [];
  }
};

watch(
  auth0.isAuthenticated,
  async (value) => {
    if (value) {
      await readRoles();
    } else {
      roles.value = [];
    }
  },
  { immediate: true }
);

const isPremium = computed(() => roles.value.some((role) => role.includes("Premium")));

const navigationItems = computed<NavItem[]>(() => {
  const publicItems: NavItem[] = [{ label: "Inicio", to: "/" }];

  if (!auth0.isAuthenticated.value) {
    return publicItems;
  }

  return [
    ...publicItems,
    { label: "Dashboard", to: "/dashboard" },
    { label: "Gastos", to: "/expenses" },
    { label: "Reportes", to: "/reports" },
    { label: "Perfil", to: "/profile" },
    { label: "Configuración", to: "/settings" },
  ];
});

const subscriptionLabel = computed(() => (isPremium.value ? "PREMIUM" : "FREE"));

const login = () => {
  auth0.loginWithRedirect();
};

const logout = () => {
  closeMenu();
  auth0.logout({
    logoutParams: {
      returnTo: window.location.origin,
    },
  });
};

const isAuthenticated = auth0.isAuthenticated;
const isLoading = auth0.isLoading;
const user = computed(() => auth0.user.value ?? null);
</script>

<style scoped>
.topbar {
  position: sticky;
  top: 0;
  z-index: 20;
  padding: 1rem 1.5rem 0;
}

.topbar__inner {
  max-width: 1240px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.25rem;
  border: 1px solid var(--expense-border);
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(18px);
  border-radius: 24px;
  box-shadow: 0 18px 40px rgba(47, 127, 184, 0.08);
}

.brand {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  text-decoration: none;
  min-width: 0;
}

.brand__badge {
  width: 48px;
  height: 48px;
  border-radius: 16px;
  display: grid;
  place-items: center;
  color: white;
  background: linear-gradient(135deg, var(--expense-primary-dark), var(--expense-primary), var(--expense-accent));
  box-shadow: 0 12px 24px rgba(74, 163, 223, 0.24);
}

.brand__title {
  font-size: 1rem;
  font-weight: 700;
}

.brand__subtitle {
  color: var(--expense-muted);
  font-size: 0.82rem;
}

.topbar__toggle {
  display: none;
  margin-left: auto;
  width: 46px;
  height: 46px;
  border-radius: 14px;
  border: 1px solid var(--expense-border);
  background: white;
  cursor: pointer;
}

.topbar__toggle span {
  display: block;
  width: 18px;
  height: 2px;
  margin: 5px auto;
  background: var(--expense-text);
}

.topbar__panel {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex: 1;
}

.topbar__nav {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin-left: 1rem;
  flex-wrap: wrap;
}

.topbar__link {
  padding: 0.7rem 1rem;
  border-radius: 999px;
  color: var(--expense-muted);
  text-decoration: none;
  font-weight: 600;
  transition: 0.2s ease;
}

.topbar__link:hover,
.router-link-active.topbar__link {
  color: var(--expense-primary-dark);
  background: rgba(74, 163, 223, 0.1);
}

.topbar__actions {
  margin-left: auto;
}

@media (max-width: 920px) {
  .topbar {
    padding: 1rem 1rem 0;
  }

  .topbar__inner {
    flex-wrap: wrap;
  }

  .topbar__toggle {
    display: block;
  }

  .topbar__panel {
    display: none;
    width: 100%;
    flex-direction: column;
    align-items: stretch;
    padding-top: 0.5rem;
  }

  .topbar__panel--open {
    display: flex;
  }

  .topbar__nav {
    margin-left: 0;
    flex-direction: column;
    align-items: stretch;
  }

  .topbar__actions {
    margin-left: 0;
  }
}
</style>
