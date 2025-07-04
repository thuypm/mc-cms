import { Request, Response, Router } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import { classRepository } from "../models/class.repository";
import { studentRepository } from "../models/student.repository";

const router = Router();

router.get("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const data = await studentRepository.paginate(req.params);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: "Failed to fetch user info" });
  }
});
router.get(
  "/get-all-class",
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const data = await classRepository.findAll({
        branch: req.user.branch,
      });
      res.json({ data });
    } catch (err) {
      console.error(err);
      res.status(400).json({ message: "Failed to fetch class" });
    }
  }
);
export { router as studentRouter };
