<template>
  <section class="page-shell">
    <div>
      <p class="page-shell__eyebrow">Reportes y análisis</p>
      <h1>Una vista clara del comportamiento de tus gastos.</h1>
    </div>

    <v-alert
      v-if="errorMessage"
      type="warning"
      variant="tonal"
      rounded="xl"
      :text="errorMessage"
    />

    <div class="report-grid">
      <v-card class="report-card" elevation="0">
        <v-card-text>
          <h2 class="text-h6 font-weight-bold mb-2">Reporte del mes actual</h2>
          <p class="text-medium-emphasis mb-4">
            Consulta el total gastado, la cantidad de transacciones y la categoría más relevante del período.
          </p>
          <v-btn
            color="primary"
            class="text-none"
            rounded="pill"
            :loading="isLoading && selectedMode === 'current'"
            @click="loadCurrentMonthReport"
          >
            Consultar reporte
          </v-btn>

          <div v-if="report" class="report-summary">
            <div class="report-summary__item">
              <span>Total del período</span>
              <strong>{{ formatCurrency(report.totalAmount) }}</strong>
            </div>
            <div class="report-summary__item">
              <span>Transacciones</span>
              <strong>{{ report.transactionCount }}</strong>
            </div>
            <div class="report-summary__item">
              <span>Categoría principal</span>
              <strong>{{ report.topCategory }}</strong>
            </div>
          </div>
        </v-card-text>
      </v-card>

      <v-card class="report-card" elevation="0">
        <v-card-text>
          <h2 class="text-h6 font-weight-bold mb-2">Comparativa por rango</h2>
          <p class="text-medium-emphasis mb-4">
            Selecciona varios meses para construir una comparativa temporal en barras.
          </p>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="startDate"
                label="Desde"
                type="date"
                variant="outlined"
                hide-details
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="endDate"
                label="Hasta"
                type="date"
                variant="outlined"
                hide-details
              />
            </v-col>
          </v-row>
          <div class="report-card__presets">
            <v-btn variant="text" class="text-none" @click="applyPresetRange(3)">Últimos 3 meses</v-btn>
            <v-btn variant="text" class="text-none" @click="applyPresetRange(6)">Últimos 6 meses</v-btn>
            <v-btn variant="text" class="text-none" @click="applyPresetRange(12)">Últimos 12 meses</v-btn>
          </div>
          <div class="report-card__actions">
            <v-btn
              color="primary"
              class="text-none"
              rounded="pill"
              :disabled="!canCompareRange"
              :loading="isLoading && selectedMode === 'custom'"
              @click="loadCustomRangeReport"
            >
              Comparar meses
            </v-btn>
          </div>
          <p class="report-card__hint">
            Para visualizar varios meses, el backend debe devolver <code>monthlyBreakdown</code> con más de un elemento.
          </p>
        </v-card-text>
      </v-card>
    </div>

    <template v-if="report && isPremium">
      <div class="premium-grid">
        <v-card class="report-card" elevation="0">
          <v-card-text>
            <div class="report-card__header">
              <h2 class="text-h6 font-weight-bold">Insights premium</h2>
              <div class="report-card__export-actions">
                <v-btn color="primary" class="text-none" rounded="pill" @click="exportReportAsPdf">
                  Descargar PDF
                </v-btn>
                <v-btn variant="outlined" color="primary" class="text-none" rounded="pill" @click="exportReportAsExcelFile">
                  Descargar Excel
                </v-btn>
              </div>
            </div>
            <div class="report-summary">
              <div class="report-summary__item">
                <span>Promedio por día</span>
                <strong>{{ premiumAveragePerDay }}</strong>
              </div>
              <div class="report-summary__item">
                <span>Categoría más costosa</span>
                <strong>{{ report.topCategory }}</strong>
              </div>
              <div class="report-summary__item">
                <span>Monto de esa categoría</span>
                <strong>{{ formatCurrency(report.topCategoryAmount ?? 0) }}</strong>
              </div>
            </div>
          </v-card-text>
        </v-card>

        <v-card class="report-card" elevation="0">
          <v-card-text>
            <h2 class="text-h6 font-weight-bold mb-3">Desglose mensual</h2>
            <div class="report-summary">
              <div
                v-for="item in report.monthlyBreakdown"
                :key="item.month"
                class="report-summary__item"
              >
                <span>{{ item.month }}</span>
                <strong>{{ formatCurrency(item.total) }} · {{ item.count }} gastos</strong>
              </div>
              <div v-if="!report.monthlyBreakdown.length" class="report-card__hint">
                El backend no devolvió un desglose mensual adicional para este período.
              </div>
            </div>
          </v-card-text>
        </v-card>
      </div>

      <div class="premium-grid">
        <bar-comparison-chart
          eyebrow="Comparativa premium"
          title="Gasto por categoría"
          :bars="premiumCategoryBars"
        />
        <bar-comparison-chart
          eyebrow="Comparativa premium"
          title="Comparativa de gastos por mes"
          :bars="premiumMonthlyBars"
        />
      </div>

      <v-alert
        v-if="selectedMode === 'custom' && !hasMultiMonthComparison"
        type="info"
        variant="tonal"
        rounded="xl"
        text="El rango seleccionado no devolvió varios meses en monthlyBreakdown. Prueba un rango más amplio para comparar períodos."
      />
    </template>

    <v-card v-else class="report-card" elevation="0">
      <v-card-text>
        <h2 class="text-h6 font-weight-bold mb-2">Resumen FREE</h2>
        <p class="text-medium-emphasis">
          Tu plan actual muestra los datos esenciales del período. Con PREMIUM puedes visualizar tendencias
          por categoría, promedio diario, comparativas de gastos por mes y exportación del reporte.
        </p>
      </v-card-text>
    </v-card>
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useAuth0 } from "@auth0/auth0-vue";
import BarComparisonChart from "@/components/reports/BarComparisonChart.vue";
import { useReportsData } from "@/composables/useReportsData";
import { exportPremiumReportAsExcel, exportPremiumReportAsPdf } from "@/services/reportExportService";
import { formatCurrency, formatLongDate } from "@/utils/formatters";

const { user } = useAuth0();
const {
  isLoading,
  errorMessage,
  report,
  selectedMode,
  startDate,
  endDate,
  canCompareRange,
  applyPresetRange,
  loadCurrentMonthReport,
  loadCustomRangeReport,
} = useReportsData();

const roles = computed<string[]>(() => user.value?.["https://securityApp.com/roles"] || []);
const isPremium = computed(
  () => roles.value.some((role) => role.includes("Premium")) || report.value?.reportType === "PREMIUM"
);

const premiumAveragePerDay = computed(() => {
  const value = report.value?.averageExpensePerDay;
  return value === null || value === undefined ? "Sin dato" : formatCurrency(value);
});

const premiumCategoryBars = computed(() => {
  const distribution = report.value?.categoryDistribution ?? [];
  const maxAmount = Math.max(...distribution.map((item) => item.amount), 0);

  return distribution.slice(0, 6).map((item) => ({
    label: item.category,
    valueLabel: formatCurrency(item.amount),
    percentage: maxAmount ? Math.round((item.amount / maxAmount) * 100) : 0,
  }));
});

const premiumMonthlyBars = computed(() => {
  const monthlyBreakdown = report.value?.monthlyBreakdown ?? [];
  const maxAmount = Math.max(...monthlyBreakdown.map((item) => item.total), 0);

  return monthlyBreakdown.map((item) => ({
    label: item.month,
    valueLabel: `${formatCurrency(item.total)} · ${item.count} gastos`,
    percentage: maxAmount ? Math.round((item.total / maxAmount) * 100) : 0,
  }));
});

const hasMultiMonthComparison = computed(() => (report.value?.monthlyBreakdown?.length ?? 0) > 1);

const exportPayload = computed(() => {
  if (!report.value || !isPremium.value) {
    return null;
  }

  const generatedFor = user.value?.email || user.value?.name || "Usuario premium";
  const rangeLabel =
    selectedMode.value === "custom"
      ? `${formatLongDate(startDate.value)} al ${formatLongDate(endDate.value)}`
      : "Mes actual";

  return {
    report: report.value,
    title: "ExpenseTracker Pro - Reporte Premium",
    subtitle: "Resumen detallado de gastos y comparativas premium",
    generatedFor,
    rangeLabel,
    averagePerDayLabel: premiumAveragePerDay.value,
    topCategoryAmountLabel: formatCurrency(report.value.topCategoryAmount ?? 0),
    totalAmountLabel: formatCurrency(report.value.totalAmount),
    categoryRows: report.value.categoryDistribution.map((item) => ({
      category: item.category,
      amountLabel: formatCurrency(item.amount),
      percentage:
        premiumCategoryBars.value.find((bar) => bar.label === item.category)?.percentage ?? 0,
    })),
    monthlyRows: report.value.monthlyBreakdown.map((item) => ({
      month: item.month,
      totalLabel: formatCurrency(item.total),
      countLabel: String(item.count),
      percentage:
        premiumMonthlyBars.value.find((bar) => bar.label === item.month)?.percentage ?? 0,
    })),
  };
});

const exportReportAsPdf = () => {
  if (!exportPayload.value) {
    return;
  }

  exportPremiumReportAsPdf(exportPayload.value);
};

const exportReportAsExcelFile = () => {
  if (!exportPayload.value) {
    return;
  }

  exportPremiumReportAsExcel(exportPayload.value);
};
</script>

<style scoped>
.page-shell {
  display: grid;
  gap: 1rem;
}

.page-shell__eyebrow {
  color: var(--expense-primary-dark);
  font-weight: 700;
}

.report-grid,
.premium-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.report-card {
  border-radius: 28px;
  border: 1px solid var(--expense-border);
  background: var(--expense-surface);
}

.report-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.report-card__export-actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.report-summary {
  display: grid;
  gap: 0.75rem;
  margin-top: 1.25rem;
}

.report-summary__item {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.9rem 1rem;
  border-radius: 18px;
  background: rgba(74, 163, 223, 0.08);
}

.report-summary__item span,
.report-card__hint {
  color: var(--expense-muted);
}

.report-card__actions {
  margin-top: 1rem;
}

.report-card__presets {
  display: flex;
  gap: 0.25rem;
  margin-top: 0.75rem;
  flex-wrap: wrap;
}

.report-card__hint {
  margin-top: 1rem;
}

@media (max-width: 920px) {
  .report-grid,
  .premium-grid {
    grid-template-columns: 1fr;
  }

  .report-card__header {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
