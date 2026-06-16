import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { BCRYPT_SALT_ROUNDS, JWT_EXPIRES_IN, JWT_SECRET } from "../config/auth";
import { HTTP_BAD_REQUEST, HTTP_OK } from "../constants/http";
import {
  createUser,
  findUserByEmail,
  userExistsByEmail,
} from "../repositories/userRepository";
import { type PublicUser, type User } from "../types/types";
import { type LoginInput, type RegisterInput } from "../validators/authValidators";

interface AuthResponse {
  token: string;
  user: PublicUser;
}

type AuthServiceResult =
  | { ok: true; status: typeof HTTP_OK; data: AuthResponse }
  | { ok: false; status: typeof HTTP_BAD_REQUEST; error: string };

function createAuthResponse(user: PublicUser): AuthResponse {
  const token = jwt.sign(
    { id: user.id, email: user.email, name: user.name },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN },
  );

  return { token, user };
}

function toPublicUser(user: User): PublicUser {
  return { id: user.id, email: user.email, name: user.name };
}

export async function register(data: RegisterInput): Promise<AuthServiceResult> {
  const { email, name, password } = data;

  if (userExistsByEmail(email)) {
    return {
      ok: false,
      status: HTTP_BAD_REQUEST,
      error: "User already exists",
    };
  }

  const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
  const user = createUser({
    email,
    name,
    password: hashedPassword,
  });

  return {
    ok: true,
    status: HTTP_OK,
    data: createAuthResponse(toPublicUser(user)),
  };
}

export async function login(data: LoginInput): Promise<AuthServiceResult> {
  const { email, password } = data;

  const user = findUserByEmail(email);
  if (!user) {
    return {
      ok: false,
      status: HTTP_BAD_REQUEST,
      error: "Invalid password or email",
    };
  }

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    return {
      ok: false,
      status: HTTP_BAD_REQUEST,
      error: "Invalid password",
    };
  }

  return {
    ok: true,
    status: HTTP_OK,
    data: createAuthResponse(toPublicUser(user)),
  };
}
