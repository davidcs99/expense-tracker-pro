export function unwrapResponse<T = any>(payload: any): T {
  return payload?.data ?? payload?.result ?? payload?.content ?? payload;
}
