import { Request, Response, Router } from "express";

import {
  getUserFromToken,
  handleMicrosoftLogin,
} from "../services/authService";

const router = Router();

// Type cho user decode từ id_token

router.post(
  "/microsoft/callback",
  async (req: Request, res: Response): Promise<void> => {
    const { code } = req.body;
    if (!code) {
      res.status(400).json({ message: "Missing code" });
    }

    try {
      const accessToken = await handleMicrosoftLogin(code);
      res.json({ accessToken });
    } catch (err: any) {
      console.error(err?.response?.data || err);
      res.status(500).json({ message: "OAuth2 login failed" });
    }
  }
);

router.get("/me", async (req: Request, res: Response): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) res.status(401).json({ message: "Missing token" });
    const token = authHeader.replace("Bearer ", "");
    const user = await getUserFromToken(token);
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: "Failed to fetch user info" });
  }
});

export default router;
