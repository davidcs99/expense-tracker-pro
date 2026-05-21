import { computed, onMounted, ref } from "vue";
import { getCurrentMonthReport, getCustomReport } from "@/services/reportService";
import type { CurrentMonthReport } from "@/types/api";

function formatDateInput(date: Date) {
  return date.toISOString().slice(0, 10);
}

function getInitialRange() {
  const today = new Date();
  const endDate = formatDateInput(today);
  const start = new Date(today.getFullYear(), today.getMonth() - 5, 1);
  return {
    startDate: formatDateInput(start),
    endDate,
  };
}

function buildRangeFromMonths(months: number) {
  const today = new Date();
  const endDate = formatDateInput(today);
  const start = new Date(today.getFullYear(), today.getMonth() - (months - 1), 1);

  return {
    startDate: formatDateInput(start),
    endDate,
  };
}

export function useReportsData() {
  const isLoading = ref(false);
  const errorMessage = ref("");
  const report = ref<CurrentMonthReport | null>(null);
  const selectedMode = ref<"current" | "custom">("current");
  const initialRange = getInitialRange();
  const startDate = ref(initialRange.startDate);
  const endDate = ref(initialRange.endDate);

  const loadCurrentMonthReport = async () => {
    isLoading.value = true;
    errorMessage.value = "";

    try {
      report.value = await getCurrentMonthReport();
      selectedMode.value = "current";
    } catch (error) {
      console.error("Error al cargar el reporte mensual.", error);
      errorMessage.value = "No pudimos consultar el reporte del mes actual.";
    } finally {
      isLoading.value = false;
    }
  };

  const loadCustomRangeReport = async () => {
    if (!canCompareRange.value) {
      errorMessage.value = "Selecciona un rango válido para comparar varios meses.";
      return;
    }

    isLoading.value = true;
    errorMessage.value = "";

    try {
      report.value = await getCustomReport(startDate.value, endDate.value);
      selectedMode.value = "custom";
    } catch (error) {
      console.error("Error al cargar el reporte personalizado.", error);
      errorMessage.value = "No pudimos consultar el reporte para el rango seleccionado.";
    } finally {
      isLoading.value = false;
    }
  };

  const canCompareRange = computed(
    () => Boolean(startDate.value && endDate.value) && new Date(startDate.value) <= new Date(endDate.value)
  );

  const applyPresetRange = (months: number) => {
    const range = buildRangeFromMonths(months);
    startDate.value = range.startDate;
    endDate.value = range.endDate;
  };

  onMounted(() => {
    void loadCurrentMonthReport();
  });

  return {
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
  };
}
