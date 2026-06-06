import bcrypt from "bcryptjs";
import { Request, Response, Router } from "express";
import jwt from "jsonwebtoken";

import { BCRYPT_SALT_ROUNDS, JWT_EXPIRES_IN, JWT_SECRET } from "../config/auth";
import { HTTP_BAD_REQUEST, HTTP_OK } from "../constants/http";
import { type PublicUser, type User } from "../types/types";

const router = Router();

const users: User[] = [];

function createAuthResponse(user: PublicUser) {
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

router.post("/register", async (req: Request, res: Response) => {
  const { email, name, password } = req.body;

  if (!email || !name || !password) {
    return res
      .status(HTTP_BAD_REQUEST)
      .json({ error: "All fields are required" });
  }
  if (users.find((user) => user.email === email)) {
    return res.status(HTTP_BAD_REQUEST).json({ error: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
  const user: User = {
    id: users.length + 1,
    password: hashedPassword,
    email,
    name,
  };
  users.push(user);

  res.status(HTTP_OK).json(createAuthResponse(toPublicUser(user)));
});

router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(HTTP_BAD_REQUEST)
      .json({ error: "Email and password are required" });
  }
  const user = users.find((user) => user.email === email);
  if (!user) {
    return res
      .status(HTTP_BAD_REQUEST)
      .json({ error: "Invalid password or email" });
  }

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    return res.status(HTTP_BAD_REQUEST).json({ error: "Invalid password" });
  }

  res.json(createAuthResponse(toPublicUser(user)));
});

export default router;
