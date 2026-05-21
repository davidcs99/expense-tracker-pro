import axiosInstance from "@/services/axiosInstance";
import type { CategorySummary, CurrentMonthReport, MonthlyBreakdownItem, SubscriptionPlan } from "@/types/api";
import { unwrapResponse } from "@/utils/apiResponse";

function normalizeReportType(value: unknown): SubscriptionPlan {
  return String(value).toUpperCase().includes("PREMIUM") ? "PREMIUM" : "FREE";
}

function mapCategoryDistribution(value: any): CategorySummary[] {
  const distributionSource =
    value?.categoryDistribution ??
    value?.categories ??
    value?.expensesByCategory ??
    value?.amountByCategory ??
    [];

  const source = Array.isArray(distributionSource)
    ? distributionSource
    : Object.entries(distributionSource).map(([category, amount]) => ({ category, amount }));

  return source
    .map((item: any) => ({
      category: String(item.category ?? item.name ?? item.categoryName ?? "Sin categoría"),
      amount: Number(item.amount ?? item.total ?? item.totalAmount ?? item[1] ?? 0),
    }))
    .sort((left, right) => right.amount - left.amount);
}

function mapExpenseCountByCategory(value: any): Record<string, number> {
  const source = value?.expenseCountByCategory ?? {};

  if (Array.isArray(source)) {
    return source.reduce<Record<string, number>>((accumulator, item: any) => {
      const category = String(item.category ?? item.name ?? item.categoryName ?? "Sin categoría");
      accumulator[category] = Number(item.count ?? item.total ?? 0);
      return accumulator;
    }, {});
  }

  return Object.entries(source).reduce<Record<string, number>>((accumulator, [category, count]) => {
    accumulator[category] = Number(count ?? 0);
    return accumulator;
  }, {});
}

function mapMonthlyBreakdown(value: any): MonthlyBreakdownItem[] {
  const source = Array.isArray(value?.monthlyBreakdown) ? value.monthlyBreakdown : [];

  return source.map((item: any) => ({
    month: String(item.month ?? ""),
    total: Number(item.total ?? 0),
    count: Number(item.count ?? 0),
  }));
}

function mapReport(normalized: any): CurrentMonthReport {
  const categoryDistribution = mapCategoryDistribution(normalized);
  const expenseCountByCategory = mapExpenseCountByCategory(normalized);

  const totalAmount = Number(
    normalized?.totalAmount ??
      normalized?.totalExpensesAmount ??
      normalized?.totalSpent ??
      normalized?.monthlyTotal ??
      0
  );
  const transactionCount = Number(
    normalized?.transactionCount ??
      normalized?.expenseCount ??
      normalized?.totalTransactions ??
      normalized?.totalExpenses ??
      normalized?.count ??
      0
  );
  const averageExpensePerDay =
    normalized?.averageExpensePerDay === null || normalized?.averageExpensePerDay === undefined
      ? null
      : Number(normalized.averageExpensePerDay);
  const averagePerTransaction = Number(
    normalized?.averagePerTransaction ??
      normalized?.averageExpense ??
      averageExpensePerDay ??
      (transactionCount ? totalAmount / transactionCount : 0)
  );

  const derivedTopCategory = categoryDistribution[0];
  const topCategory = String(
    normalized?.mostExpensiveCategory ??
      normalized?.topCategory ??
      normalized?.mostUsedCategory ??
      normalized?.highestCategory ??
      normalized?.topSpendingCategory ??
      derivedTopCategory?.category ??
      "Sin datos"
  );
  const topCategoryAmount =
    normalized?.mostExpensiveCategoryAmount === null || normalized?.mostExpensiveCategoryAmount === undefined
      ? derivedTopCategory?.amount ?? null
      : Number(normalized.mostExpensiveCategoryAmount);

  return {
    reportType: normalizeReportType(normalized?.reportType),
    totalAmount,
    transactionCount,
    averagePerTransaction,
    averageExpensePerDay,
    topCategory,
    topCategoryAmount,
    categoryDistribution,
    expenseCountByCategory,
    monthlyBreakdown: mapMonthlyBreakdown(normalized),
  };
}

export async function getCurrentMonthReport(): Promise<CurrentMonthReport> {
  const { data } = await axiosInstance.get("/reports/current-month");
  return mapReport(unwrapResponse(data));
}

export async function getCustomReport(startDate: string, endDate: string): Promise<CurrentMonthReport> {
  const { data } = await axiosInstance.get("/reports/custom", {
    params: {
      startDate,
      endDate,
    },
  });

  return mapReport(unwrapResponse(data));
}
