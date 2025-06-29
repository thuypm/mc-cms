import { Request, Response, Router } from "express";
import * as yup from "yup";
import { AuthRequest } from "../middleware/authMiddleware";
import { classRepository } from "../models/class.repository";
import { studentRepository } from "../models/student.repository";
import { dayBoardingService } from "../services/dayBoarding.service";
import { MC_SERVICE, USER_POSITION } from "../utils/enum";

const router = Router();
router.post("/register", async (req: Request, res: Response): Promise<void> => {
  try {
    const dayBoardingYup = yup.object({
      studentIds: yup
        .array()
        .of(yup.string().required())
        .min(1, "At least one studentId is required")
        .required("Student ids is required"),

      service: yup
        .string()
        .oneOf([MC_SERVICE.DAY_BOARDING, MC_SERVICE.SHUTTLE_BUS]) // thay bằng các giá trị thực trong enum MC_SERVICE
        .required("Service is required"),
    });
    const parsed = await dayBoardingYup.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });
    const data = await dayBoardingService.createDayBoardingAndRegistration(
      parsed
    );
    res.json(data);
    // res.json(user);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err });
  }
});

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
      const data = await classRepository.findAll(
        req.user.position === USER_POSITION.SUPER_ADMIN
          ? null
          : {
              _id: req.user.class,
            }
      );
      res.json({ data });
    } catch (err) {
      console.error(err);
      res.status(400).json({ message: "Failed to fetch class" });
    }
  }
);
export { router as studentRouter };
