export type SubscriptionPlan = "FREE" | "PREMIUM";

export type Category = {
  id: number;
  name: string;
  icon?: string;
  color: string;
  active?: boolean;
};

export type Expense = {
  id: number;
  amount: number;
  date: string;
  description: string;
  categoryId?: number;
  categoryName: string;
  categoryColor?: string;
};

export type ExpensePayload = {
  categoryId: number;
  amount: number;
  date: string;
  description: string;
};

export type UsageLimits = {
  subscription: SubscriptionPlan;
  monthlyLimit: number | null;
  currentUsage: number;
  usagePercentage: number;
  alertThreshold: number;
  remainingExpenses: number | null;
  canCreateMore: boolean;
  alertMessage: string | null;
};

export type CategorySummary = {
  category: string;
  amount: number;
};

export type MonthlyBreakdownItem = {
  month: string;
  total: number;
  count: number;
};

export type CurrentMonthReport = {
  reportType: SubscriptionPlan;
  totalAmount: number;
  transactionCount: number;
  averagePerTransaction: number;
  averageExpensePerDay: number | null;
  topCategory: string;
  topCategoryAmount: number | null;
  categoryDistribution: CategorySummary[];
  expenseCountByCategory: Record<string, number>;
  monthlyBreakdown: MonthlyBreakdownItem[];
};
