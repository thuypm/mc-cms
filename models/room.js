const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  studentId: { type: String, required: true },
  name: { type: String },
  class: { type: String },
  email: { type: String },
});

const roomSchema = new mongoose.Schema({
  roomName: { type: String },
  exams: { type: Array, default: [] }, // bạn có thể định nghĩa tương tự nếu muốn
  students: { type: [studentSchema], default: [] },
});
module.exports = mongoose.model("Room", roomSchema);
