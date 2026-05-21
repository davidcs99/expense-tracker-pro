import { computed, onMounted, ref } from "vue";
import { getCategories } from "@/services/categoryService";
import { getUsageLimits } from "@/services/configService";
import { createExpense, deleteExpense, getExpenses, updateExpense } from "@/services/expenseService";
import type { Category, Expense, ExpensePayload, UsageLimits } from "@/types/api";

export function useExpensesData() {
  const isLoading = ref(true);
  const errorMessage = ref("");
  const categories = ref<Category[]>([]);
  const expenses = ref<Expense[]>([]);
  const startDate = ref("");
  const endDate = ref("");
  const selectedCategory = ref<string | null>(null);
  const isSaving = ref(false);
  const saveErrorMessage = ref("");
  const usageLimits = ref<UsageLimits | null>(null);
  const limitAlertMessage = ref("");

  const loadBaseData = async () => {
    isLoading.value = true;
    errorMessage.value = "";

    try {
      const [categoryData, expenseData, limitsData] = await Promise.all([
        getCategories(),
        getExpenses(),
        getUsageLimits(),
      ]);
      categories.value = categoryData;
      expenses.value = expenseData;
      usageLimits.value = limitsData;
      limitAlertMessage.value = limitsData.alertMessage ?? "";
    } catch (error) {
      console.error("Error al cargar gastos.", error);
      errorMessage.value = "No pudimos obtener los gastos del backend.";
    } finally {
      isLoading.value = false;
    }
  };

  const applyFilters = async () => {
    isLoading.value = true;
    errorMessage.value = "";

    try {
      const expenseData = await getExpenses({
        startDate: startDate.value || undefined,
        endDate: endDate.value || undefined,
      });

      expenses.value = expenseData;
    } catch (error) {
      console.error("Error al filtrar gastos.", error);
      errorMessage.value = "No pudimos aplicar los filtros en este momento.";
    } finally {
      isLoading.value = false;
    }
  };

  const createNewExpense = async (payload: ExpensePayload) => {
    isSaving.value = true;
    saveErrorMessage.value = "";

    try {
      const latestLimits = await getUsageLimits();
      usageLimits.value = latestLimits;

      if (latestLimits.subscription === "FREE" && !latestLimits.canCreateMore) {
        saveErrorMessage.value =
          latestLimits.alertMessage ?? "Ya alcanzaste el límite mensual de gastos para tu plan FREE.";
        throw new Error("FREE_LIMIT_REACHED");
      }

      await createExpense(payload);
      await loadBaseData();

      if (usageLimits.value?.subscription === "FREE") {
        if (usageLimits.value.alertMessage) {
          limitAlertMessage.value = usageLimits.value.alertMessage;
        } else if (usageLimits.value.usagePercentage >= usageLimits.value.alertThreshold) {
          limitAlertMessage.value = `Has usado ${usageLimits.value.usagePercentage}% de tu límite mensual. Considera actualizar a PREMIUM.`;
        } else {
          limitAlertMessage.value = "";
        }
      }
    } catch (error) {
      console.error("Error al crear gasto.", error);
      if (!saveErrorMessage.value) {
        saveErrorMessage.value = "No pudimos crear el gasto.";
      }
      throw error;
    } finally {
      isSaving.value = false;
    }
  };

  const editExpense = async (expenseId: number, payload: ExpensePayload) => {
    isSaving.value = true;
    saveErrorMessage.value = "";

    try {
      await updateExpense(expenseId, payload);
      await loadBaseData();
    } catch (error) {
      console.error("Error al actualizar gasto.", error);
      saveErrorMessage.value = "No pudimos actualizar el gasto.";
      throw error;
    } finally {
      isSaving.value = false;
    }
  };

  const removeExpense = async (expenseId: number) => {
    isSaving.value = true;
    saveErrorMessage.value = "";

    try {
      await deleteExpense(expenseId);
      await loadBaseData();
    } catch (error) {
      console.error("Error al eliminar gasto.", error);
      saveErrorMessage.value = "No pudimos eliminar el gasto.";
      throw error;
    } finally {
      isSaving.value = false;
    }
  };

  const filteredExpenses = computed(() =>
    expenses.value.filter((expense) =>
      selectedCategory.value ? expense.categoryName === selectedCategory.value : true
    )
  );

  onMounted(() => {
    void loadBaseData();
  });

  return {
    isLoading,
    errorMessage,
    categories,
    expenses: filteredExpenses,
    startDate,
    endDate,
    selectedCategory,
    isSaving,
    saveErrorMessage,
    usageLimits,
    limitAlertMessage,
    applyFilters,
    createNewExpense,
    editExpense,
    removeExpense,
    reload: loadBaseData,
  };
}
