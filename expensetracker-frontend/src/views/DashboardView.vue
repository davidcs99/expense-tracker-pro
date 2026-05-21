<template>
  <section class="dashboard-view">
    <dashboard-hero :user-name="user?.name" :plan="subscriptionLabel" />

    <v-alert
      v-if="limitAlertMessage"
      type="warning"
      variant="tonal"
      rounded="xl"
      :text="limitAlertMessage"
    />

    <v-alert
      v-if="errorMessage"
      type="warning"
      variant="tonal"
      rounded="xl"
      :text="errorMessage"
    />

    <v-progress-linear
      v-if="isLoading"
      indeterminate
      color="primary"
      rounded
    />

    <template v-else>
      <metrics-overview :metrics="metrics" />

      <div class="dashboard-view__grid">
        <limit-status-card
          v-if="subscriptionLabel === 'FREE'"
          title="Límite mensual"
          :status-label="statusLabel"
          :chip-color="statusColor"
          :progress="limitProgress"
          :description="limitDescription"
        />
        <category-highlights
          :categories="categoryHighlights"
          :category-count="availableCategoryCount"
        />
        <recent-expenses-card :expenses="recentExpenses" />
        <upgrade-panel v-if="subscriptionLabel === 'FREE'" />
      </div>
    </template>
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useAuth0 } from "@auth0/auth0-vue";
import DashboardHero from "@/components/dashboard/DashboardHero.vue";
import MetricsOverview from "@/components/dashboard/MetricsOverview.vue";
import LimitStatusCard from "@/components/dashboard/LimitStatusCard.vue";
import CategoryHighlights from "@/components/dashboard/CategoryHighlights.vue";
import RecentExpensesCard from "@/components/dashboard/RecentExpensesCard.vue";
import UpgradePanel from "@/components/dashboard/UpgradePanel.vue";
import { useDashboardData } from "@/composables/useDashboardData";
import { formatCurrency } from "@/utils/formatters";

function getCategoryIcon(categoryName?: string) {
  const normalized = String(categoryName ?? "").toLowerCase();

  if (normalized.includes("aliment")) return "mdi-food";
  if (normalized.includes("transport")) return "mdi-car";
  if (normalized.includes("vivienda") || normalized.includes("hogar")) return "mdi-home";
  if (normalized.includes("entreten")) return "mdi-movie-open";
  if (normalized.includes("salud")) return "mdi-heart-pulse";
  if (normalized.includes("educ")) return "mdi-school";
  if (normalized.includes("ropa")) return "mdi-tshirt-crew";
  if (normalized.includes("tecnolog")) return "mdi-laptop";
  if (normalized.includes("deporte")) return "mdi-dumbbell";
  if (normalized.includes("mascota")) return "mdi-paw";
  if (normalized.includes("regalo")) return "mdi-gift-outline";

  return "mdi-shape-outline";
}

const { user } = useAuth0();
const { isLoading, errorMessage, expenses, limits, report, topCategories, recentExpenses } = useDashboardData();

const roles = computed<string[]>(() => user.value?.["https://securityApp.com/roles"] || []);
const subscriptionLabel = computed(() =>
  limits.value?.subscription ??
  (roles.value.some((role) => role.includes("Premium")) ? "PREMIUM" : "FREE")
);

const currentExpenses = computed(() => limits.value?.currentUsage ?? expenses.value.length);
const freeLimit = computed(() => limits.value?.monthlyLimit ?? 50);
const limitProgress = computed(() => limits.value?.usagePercentage ?? 0);

const metrics = computed(() => [
  {
    label: "Gastado este mes",
    value: formatCurrency(report.value?.totalAmount ?? 0),
    caption: "Total acumulado del mes actual",
    icon: "mdi-cash-multiple",
    iconBackground: "rgba(74, 163, 223, 0.14)",
  },
  {
    label: "Transacciones",
    value: String(report.value?.transactionCount ?? expenses.value.length),
    caption: "Movimientos detectados en el período",
    icon: "mdi-receipt-text-outline",
    iconBackground: "rgba(138, 164, 191, 0.18)",
  },
  {
    label: "Categoría principal",
    value: report.value?.topCategory ?? "Sin datos",
    caption: "Mayor peso dentro del mes",
    icon: getCategoryIcon(report.value?.topCategory),
    iconBackground: "rgba(111, 128, 152, 0.14)",
  },
  {
    label: "Promedio por gasto",
    value: formatCurrency(report.value?.averagePerTransaction ?? 0),
    caption: "Ideal para monitorear hábitos",
    icon: "mdi-chart-line",
    iconBackground: "rgba(138, 198, 234, 0.18)",
  },
]);

const categoryHighlights = computed(() => topCategories.value);
const availableCategoryCount = computed(() => categoryHighlights.value.length);

const statusLabel = computed(() => (subscriptionLabel.value === "PREMIUM" ? "Sin límite" : "En seguimiento"));
const statusColor = computed(() => (subscriptionLabel.value === "PREMIUM" ? "primary" : "info"));
const limitAlertMessage = computed(() => {
  if (subscriptionLabel.value === "PREMIUM") {
    return "";
  }

  if (limits.value?.alertMessage) {
    return limits.value.alertMessage;
  }

  if ((limits.value?.usagePercentage ?? 0) >= (limits.value?.alertThreshold ?? 80)) {
    return `Has usado ${limits.value?.usagePercentage ?? 0}% de tu límite mensual. Considera actualizar a PREMIUM.`;
  }

  return "";
});

const limitDescription = computed(() => {
  if (subscriptionLabel.value === "PREMIUM") {
    return "Tu plan actual no tiene restricciones en la cantidad de gastos registrados.";
  }

  return `Has registrado ${currentExpenses.value} de ${freeLimit.value} gastos disponibles. Te quedan ${limits.value?.remainingExpenses ?? 0} registros antes de alcanzar el límite mensual.`;
});
</script>

<style scoped>
.dashboard-view {
  display: grid;
  gap: 1.25rem;
}

.dashboard-view__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

@media (max-width: 920px) {
  .dashboard-view__grid {
    grid-template-columns: 1fr;
  }
}
</style>
