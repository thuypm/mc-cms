const express = require("express");
const app = express();
const examRouter = require("./routers/exam");
const answerRouter = require("./routers/answer");
const assignmentRouter = require("./routers/assigment");
const roomRouter = require("./routers/room");
const cors = require("cors");
const connectDB = require("./services/db");
const path = require("path");
connectDB();

// CORS config
app.use(
  cors({
    origin: "*", // hoặc origin: 'http://localhost:3000' nếu bạn muốn giới hạn
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json()); // để đọc req.body dạng JSON

// Mount router
app.use("/api/answer", answerRouter);
app.use("/api/exam", examRouter);
app.use("/api/room", roomRouter);
app.use("/api/assignment", assignmentRouter);
const imagesPath = path.join(process.cwd(), "images");
// Cấu hình route /images/* trỏ đến thư mục images
app.use("/images", express.static(imagesPath));
app.listen(5000, () => {
  console.log("Server chạy tại http://localhost:5000");
});
