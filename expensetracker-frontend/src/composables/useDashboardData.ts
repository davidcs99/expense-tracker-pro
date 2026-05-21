import { computed, onMounted, ref } from "vue";
import { getCategories } from "@/services/categoryService";
import { getUsageLimits } from "@/services/configService";
import { getExpenses } from "@/services/expenseService";
import { getCurrentMonthReport } from "@/services/reportService";
import type { Category, CurrentMonthReport, Expense, UsageLimits } from "@/types/api";
import { formatCurrency, formatShortDate } from "@/utils/formatters";

function buildFallbackReport(expenses: Expense[]): CurrentMonthReport {
  const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const transactionCount = expenses.length;
  const averagePerTransaction = transactionCount ? totalAmount / transactionCount : 0;

  const grouped = expenses.reduce<Record<string, number>>((accumulator, expense) => {
    accumulator[expense.categoryName] = (accumulator[expense.categoryName] ?? 0) + expense.amount;
    return accumulator;
  }, {});

  const categoryDistribution = Object.entries(grouped)
    .map(([category, amount]) => ({ category, amount }))
    .sort((left, right) => right.amount - left.amount);

  return {
    reportType: "FREE",
    totalAmount,
    transactionCount,
    averagePerTransaction,
    averageExpensePerDay: null,
    topCategory: categoryDistribution[0]?.category ?? "Sin datos",
    topCategoryAmount: categoryDistribution[0]?.amount ?? null,
    categoryDistribution,
    expenseCountByCategory: {},
    monthlyBreakdown: [],
  };
}

export function useDashboardData() {
  const isLoading = ref(true);
  const errorMessage = ref("");
  const categories = ref<Category[]>([]);
  const expenses = ref<Expense[]>([]);
  const limits = ref<UsageLimits | null>(null);
  const report = ref<CurrentMonthReport | null>(null);

  const loadDashboardData = async () => {
    isLoading.value = true;
    errorMessage.value = "";

    const results = await Promise.allSettled([
      getCategories(),
      getExpenses(),
      getUsageLimits(),
      getCurrentMonthReport(),
    ]);

    const [categoriesResult, expensesResult, limitsResult, reportResult] = results;

    if (categoriesResult.status === "fulfilled") {
      categories.value = categoriesResult.value;
    }

    if (expensesResult.status === "fulfilled") {
      expenses.value = expensesResult.value;
    }

    if (limitsResult.status === "fulfilled") {
      limits.value = limitsResult.value;
    }

    if (reportResult.status === "fulfilled") {
      report.value = reportResult.value;
    } else if (expenses.value.length) {
      report.value = buildFallbackReport(expenses.value);
    }

    const failedRequests = results.filter((result) => result.status === "rejected");

    if (failedRequests.length) {
      console.error("Carga parcial del dashboard.", failedRequests);
      errorMessage.value =
        failedRequests.length === results.length
          ? "No pudimos cargar el dashboard con datos reales."
          : "Algunos datos del dashboard no se pudieron cargar, pero mostramos lo disponible.";
    }

    isLoading.value = false;
  };

  onMounted(() => {
    void loadDashboardData();
  });

  const topCategories = computed(() => {
    const distribution = report.value?.categoryDistribution ?? [];

    return distribution.slice(0, 4).map((item, index) => ({
      name: item.category,
      caption: "Resumen del mes actual",
      amount: formatCurrency(item.amount),
      color:
        categories.value.find((category) => category.name === item.category)?.color ??
        ["#5dade2", "#7fb3d5", "#85c1e9", "#76d7ea"][index % 4],
    }));
  });

  const recentExpenses = computed(() =>
    [...expenses.value]
      .sort((left, right) => new Date(right.date).getTime() - new Date(left.date).getTime())
      .slice(0, 5)
      .map((expense) => ({
        id: expense.id,
        categoryName: expense.categoryName,
        categoryColor: expense.categoryColor,
        description: expense.description,
        amount: formatCurrency(expense.amount),
        date: formatShortDate(expense.date),
      }))
  );

  return {
    isLoading,
    errorMessage,
    categories,
    expenses,
    limits,
    report,
    topCategories,
    recentExpenses,
    reload: loadDashboardData,
  };
}
