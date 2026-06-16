import {
  getTrimmedString,
  isRecord,
  type ValidationResult,
} from "./common";

const MIN_PASSWORD_LENGTH = 6;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface RegisterInput {
  email: string;
  name: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

function getEmail(data: Record<string, unknown>): string | null {
  const email = getTrimmedString(data, "email");
  if (!email || !EMAIL_PATTERN.test(email)) {
    return null;
  }

  return email;
}

export function validateRegisterPayload(
  payload: unknown,
): ValidationResult<RegisterInput> {
  if (!isRecord(payload)) {
    return { ok: false, error: "Invalid request body" };
  }

  const name = getTrimmedString(payload, "name");
  if (!name) {
    return { ok: false, error: "Name is required" };
  }

  const email = getEmail(payload);
  if (!email) {
    return { ok: false, error: "Valid email is required" };
  }

  const password = getTrimmedString(payload, "password");
  if (!password || password.length < MIN_PASSWORD_LENGTH) {
    return {
      ok: false,
      error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters`,
    };
  }

  return { ok: true, data: { email, name, password } };
}

export function validateLoginPayload(
  payload: unknown,
): ValidationResult<LoginInput> {
  if (!isRecord(payload)) {
    return { ok: false, error: "Invalid request body" };
  }

  const email = getEmail(payload);
  if (!email) {
    return { ok: false, error: "Valid email is required" };
  }

  const password = getTrimmedString(payload, "password");
  if (!password) {
    return { ok: false, error: "Password is required" };
  }

  return { ok: true, data: { email, password } };
}
