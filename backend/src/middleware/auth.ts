import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";

import { AUTH_BEARER_PREFIX, JWT_SECRET } from "../config/auth";
import { HTTP_UNAUTHORIZED } from "../constants/http";
import { type AuthRequest } from "../types/types";

export type { AuthRequest };

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith(AUTH_BEARER_PREFIX)) {
    return res.status(HTTP_UNAUTHORIZED).json({ error: "Unauthorized" });
  }

  const token = authHeader.slice(AUTH_BEARER_PREFIX.length);

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number };
    req.userId = decoded.id;
    next();
  } catch {
    return res.status(HTTP_UNAUTHORIZED).json({ error: "Invalid token" });
  }
};
