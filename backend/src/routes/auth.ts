import { Request, Response, Router } from "express";

import { HTTP_BAD_REQUEST } from "../constants/http";
import * as authService from "../services/authService";
import {
  validateLoginPayload,
  validateRegisterPayload,
} from "../validators/authValidators";

const router = Router();

router.post("/register", async (req: Request, res: Response) => {
  const validation = validateRegisterPayload(req.body);
  if (!validation.ok) {
    return res.status(HTTP_BAD_REQUEST).json({ error: validation.error });
  }

  const result = await authService.register(validation.data);

  if (!result.ok) {
    return res.status(result.status).json({ error: result.error });
  }

  res.status(result.status).json(result.data);
});

router.post("/login", async (req: Request, res: Response) => {
  const validation = validateLoginPayload(req.body);
  if (!validation.ok) {
    return res.status(HTTP_BAD_REQUEST).json({ error: validation.error });
  }

  const result = await authService.login(validation.data);

  if (!result.ok) {
    return res.status(result.status).json({ error: result.error });
  }

  res.json(result.data);
});

export default router;
