import axiosInstance from "@/services/axiosInstance";
import type { Category } from "@/types/api";
import { unwrapResponse } from "@/utils/apiResponse";

const fallbackColors = ["#5dade2", "#7fb3d5", "#85c1e9", "#76d7ea", "#a9cce3", "#aed6f1"];

export async function getCategories(): Promise<Category[]> {
  const { data } = await axiosInstance.get("/categories");
  const normalized = unwrapResponse(data);
  const source = Array.isArray(normalized)
    ? normalized
    : normalized?.content ?? normalized?.categories ?? normalized?.items ?? [];

  return source.map((item: any, index: number) => ({
    id: Number(item.id),
    name: String(item.name ?? item.categoryName ?? "Sin categoría"),
    icon: item.icon,
    color: String(item.color ?? fallbackColors[index % fallbackColors.length]),
    active: item.active,
  }));
}
