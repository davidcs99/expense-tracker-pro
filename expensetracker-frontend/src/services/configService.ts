import axiosInstance from "@/services/axiosInstance";
import type { SubscriptionPlan, UsageLimits } from "@/types/api";
import { unwrapResponse } from "@/utils/apiResponse";

function normalizeSubscription(value: unknown): SubscriptionPlan {
  return String(value).toUpperCase().includes("PREMIUM") ? "PREMIUM" : "FREE";
}

function parseNumericValue(value: unknown): number {
  if (typeof value === "number") {
    return value;
  }

  if (typeof value === "string") {
    const normalized = value.replace("%", "").replace(",", ".").trim();
    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  return 0;
}

export async function getUsageLimits(): Promise<UsageLimits> {
  const { data } = await axiosInstance.get("/config/limits");
  const normalized = unwrapResponse(data);

  const currentUsage = Number(
    normalized?.currentUsage ??
      normalized?.currentExpenses ??
      normalized?.usedExpenses ??
      normalized?.usage ??
      normalized?.currentCount ??
      normalized?.expensesThisMonth ??
      normalized?.used ??
      0
  );

  const monthlyLimitRaw =
    normalized?.monthlyLimit ??
    normalized?.limit ??
    normalized?.maxExpenses ??
    normalized?.expenseLimit ??
    normalized?.monthlyExpenseLimit ??
    null;

  const monthlyLimitValue =
    typeof monthlyLimitRaw === "string" && monthlyLimitRaw.toUpperCase().includes("UNLIMITED")
      ? null
      : monthlyLimitRaw;

  const subscription = normalizeSubscription(
    normalized?.subscription ?? normalized?.subscriptionType ?? normalized?.plan ?? "FREE"
  );

  const monthlyLimit =
    monthlyLimitValue === null || monthlyLimitValue === undefined || Number(monthlyLimitValue) <= 0
      ? subscription === "PREMIUM"
        ? null
        : 50
      : Number(monthlyLimitValue);

  const usagePercentage =
    parseNumericValue(
      normalized?.usagePercentage ??
        normalized?.percentageUsed ??
        normalized?.usedPercentage ??
        normalized?.progress ??
        (monthlyLimit ? (currentUsage / monthlyLimit) * 100 : 0)
    ) || 0;

  const remainingExpensesRaw = normalized?.remainingExpenses ?? null;
  const remainingExpenses =
    typeof remainingExpensesRaw === "string" && remainingExpensesRaw.toUpperCase().includes("UNLIMITED")
      ? null
      : remainingExpensesRaw === null || remainingExpensesRaw === undefined
        ? monthlyLimit === null
          ? null
          : Math.max(monthlyLimit - currentUsage, 0)
        : Number(remainingExpensesRaw);

  return {
    subscription,
    monthlyLimit,
    currentUsage,
    usagePercentage: Math.min(Math.max(Math.round(usagePercentage), 0), 100),
    alertThreshold: Number(normalized?.alertThreshold ?? normalized?.warningThreshold ?? 80),
    remainingExpenses,
    canCreateMore: Boolean(normalized?.canCreateMore ?? true),
    alertMessage: normalized?.alert ? String(normalized.alert) : null,
  };
}
