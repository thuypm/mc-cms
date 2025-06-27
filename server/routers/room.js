const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const {
  getAllRoom,
  createRoom,
  deleteRoom,
} = require("../services/roomServices");
const router = express.Router();

// Cấu hình multer để lưu file PDF vào thư mục 'uploads'
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "../uploads";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});
const upload = multer({
  storage: storage,
  // fileFilter: (req, file, cb) => {
  //   // Chỉ chấp nhận file PDF
  //   if (file.mimetype === "application/pdf") cb(null, true);
  //   else cb(new Error("Chỉ chấp nhận file PDF"));
  // },
});

router.delete("/:roomId", async (req, res) => {
  const { roomId } = req.params;
  const data = await deleteRoom(roomId);
  res.json(data);
});
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Missing Assignment ID in URL." });
    }

    const updatedAssignment = await updateAssignmentById(id, req.body);

    if (!updatedAssignment) {
      return res.status(404).json({ message: "Assignment not found." });
    }

    res.json(updatedAssignment);
  } catch (error) {
    console.error("Update Assignment error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});
// Route POST /exam
router.post("/", upload.single("file"), async (req, res) => {
  const { name } = req.body;
  const file = req.file;
  await createRoom(name, file);
  fs.unlinkSync(file.path);

  return res.json({ success: true });
});
router.get("/", async (req, res) => {
  const data = await getAllRoom();
  res.json(data);
});
module.exports = router;
