import cors from "cors";
import express, { Application } from "express";
import path from "path";
import { authenticateToken } from "./middleware/authMiddleware";
import { attachBranchId } from "./middleware/branch.middleware";
import authRouter from "./routers/authRouter";
import { dayBoardingRouter } from "./routers/dayBoardingRouter";
import { studentRouter } from "./routers/student.router";
import connectDB from "./services/db";
import { APP_PORT } from "./utils/environment";

// Kết nối DB
connectDB();

const app: Application = express();

// CORS config
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-branch-id"],
  })
);

app.use(express.json());
const publicPath = path.join(process.cwd(), "public");
app.use(express.static(publicPath));
// Mount routers
app.use("/api/auth", authRouter);
app.use("/api/student", authenticateToken, attachBranchId, studentRouter);
app.use(
  "/api/day-boarding",
  authenticateToken,
  attachBranchId,
  dayBoardingRouter
);

// Static images folder
const imagesPath = path.join(process.cwd(), "images");
app.use("/images", express.static(imagesPath));
console.log(process.env.APP_PORT);
app.listen(APP_PORT, () => {
  console.log("Server chạy tại http://localhost:5000");
});
// studentService.createStudentCard(["108016", "108028", "108026"], {
// branch: "MC1",
// });
