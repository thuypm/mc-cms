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
      const dayBoardingArraySchema = yup
        .array()
        .of(
          yup.object({
            _id: yup.string().required("_id is required"),
            service: yup
              .string()
              .oneOf(
                [MC_SERVICE.DAY_BOARDING, MC_SERVICE.SHUTTLE_BUS],
                "Service must be a valid type"
              )
              .required("Service is required"),
            isActive: yup.boolean().required("isActive is required"),
          })
        )
        .min(1, "At least one registration is required")
        .required("This field is required");
      const parsed = await dayBoardingArraySchema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
      });

      const data = await dayBoardingService.createDayBoardingAndRegistration(
        parsed,
        req.user._id,
        req.user.branch
      );
      res.json(data);
      // res.json(user);
    } catch (err) {
      res.status(400).json({ message: `${err}` });
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
router.post(
  "/create-day-data",
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const data = await dayBoardingService.createDayData(
        req.body.dates,
        req.user._id,
        req.user.branch
      );
      res.json(data);
      // res.json(user);
    } catch (err) {
      res.status(400).json({ message: `${err}` });
    }
  }
);
router.get(
  "/get-day-data",
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const data = await dayBoardingService.getDayData({
        branch: req.user.branch,
      });
      res.json({
        data: data,
      });
    } catch (err) {
      console.error(err);
      res.status(400).json({ message: "Failed to fetch user info" });
    }
  }
);

export { router as dayBoardingRouter };
