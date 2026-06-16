export type ValidationResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function getTrimmedString(
  data: Record<string, unknown>,
  field: string,
): string | null {
  const value = data[field];
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}
