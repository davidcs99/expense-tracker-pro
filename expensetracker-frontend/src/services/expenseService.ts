import axiosInstance from "@/services/axiosInstance";
import type { Expense, ExpensePayload } from "@/types/api";
import { unwrapResponse } from "@/utils/apiResponse";

type ExpenseFilters = {
  startDate?: string;
  endDate?: string;
};

function extractCategoryName(item: any) {
  return item?.categoryName ?? item?.category?.name ?? item?.categoryDto?.name ?? "Sin categoría";
}

function extractCategoryColor(item: any) {
  return item?.categoryColor ?? item?.category?.color ?? item?.categoryDto?.color ?? undefined;
}

function mapExpense(item: any): Expense {
  return {
    id: Number(item.id),
    amount: Number(item.amount ?? 0),
    date: String(item.date ?? item.expenseDate ?? item.createdAt ?? ""),
    description: String(item.description ?? ""),
    categoryId: item.categoryId ?? item.category?.id ?? item.categoryDto?.id,
    categoryName: extractCategoryName(item),
    categoryColor: extractCategoryColor(item),
  };
}

export async function getExpenses(filters: ExpenseFilters = {}): Promise<Expense[]> {
  const hasRange = Boolean(filters.startDate && filters.endDate);

  const { data } = hasRange
    ? await axiosInstance.get("/expenses", {
        params: {
          startDate: filters.startDate,
          endDate: filters.endDate,
        },
      })
    : await axiosInstance.get("/expenses");

  const normalized = unwrapResponse(data);
  const source = Array.isArray(normalized)
    ? normalized
    : normalized?.content ?? normalized?.expenses ?? normalized?.items ?? [];

  return source.map(mapExpense);
}

export async function createExpense(payload: ExpensePayload): Promise<Expense> {
  const { data } = await axiosInstance.post("/expenses", payload);
  return mapExpense(unwrapResponse(data));
}

export async function updateExpense(id: number, payload: ExpensePayload): Promise<Expense> {
  const { data } = await axiosInstance.put(`/expenses/${id}`, payload);
  return mapExpense(unwrapResponse(data));
}

export async function deleteExpense(id: number): Promise<void> {
  await axiosInstance.delete(`/expenses/${id}`);
}
