import cors from "cors";
import express, { Application } from "express";
import path from "path";
import authRouter from "./routers/authRouter";
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
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// Mount routers
app.use("/api/auth", authRouter);

// Static images folder
const imagesPath = path.join(process.cwd(), "images");
app.use("/images", express.static(imagesPath));
console.log(process.env.APP_PORT);
app.listen(APP_PORT, () => {
  console.log("Server chạy tại http://localhost:5000");
});
