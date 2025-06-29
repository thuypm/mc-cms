import { Request, Response, Router } from "express";

import { getUserFromToken } from "../services/authService";

const router = Router();
router.get(
  "/data-registration",
  async (req: Request, res: Response): Promise<void> => {
    try {
      // res.json(user);
    } catch (err) {
      console.error(err);
      res.status(401).json({ message: "Failed to fetch user info" });
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
