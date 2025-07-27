import { Response, Router } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import { classRepository } from "../models/class.repository";
import { studentService } from "../services/student.service";

const router = Router();

router.get("/", async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = req.user;
    const data = await studentService.getAllStudents(req.query, user);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: JSON.stringify(err) });
  }
});
router.post(
  "/create-student-card",
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const user = req.user;
      const data = await studentService.createStudentCard(req.body.mcids, user);
      res.json(data);
    } catch (err) {
      console.error(err);
      res.status(400).json({ message: JSON.stringify(err) });
    }
  }
);
router.get(
  "/get-all-class",
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const data = await classRepository.findAll({
        branch: req.user.branch,
      });
      res.json({ items: data });
    } catch (err) {
      console.error(err);
      res.status(400).json({ message: "Failed to fetch class" });
    }
  }
);
export { router as studentRouter };
