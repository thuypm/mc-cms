import { Response, Router } from "express";
import * as yup from "yup";
import { AuthRequest } from "../middleware/authMiddleware";
import { dayBoardingService } from "../services/dayBoarding.service";
import { MC_SERVICE, USER_POSITION } from "../utils/enum";

const router = Router();
router.post(
  "/register",
  async (req: AuthRequest, res: Response): Promise<void> => {
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
      const data = await dayBoardingService.createDayBoardingAndRegistration({
        ...parsed,
        registedBy: req.user._id,
      });
      res.json(data);
      // res.json(user);
    } catch (err) {
      console.error(err);
      res.status(400).json({ message: err });
    }
  }
);
router.get(
  "/get-all-register",
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const classId =
        req.user.position === USER_POSITION.SUPER_ADMIN
          ? req.query.class
          : req.user.class;
      if (!classId) res.status(400).json({ message: "Class is required" });
      else {
        const data = await dayBoardingService.getDayBoardingAllRegistration({
          class: classId,
        });
        res.json({
          data: data,
        });
      }
    } catch (err) {
      console.error(err);
      res.status(400).json({ message: "Failed to fetch user info" });
    }
  }
);

export { router as dayBoardingRouter };
