const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema({
  exactStudentId: String,
  exactKey: String,
  score: Number,
  studentName: String,
  emptyAnswers: Array,
  multiChoices: Array,
  key: Array,
  studentId: Array,
  partOne: Array,
  partTwo: Array,
  partThree: Array,
  examId: { type: mongoose.Schema.Types.ObjectId, ref: "Exam", required: true },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("assignment", assignmentSchema);
