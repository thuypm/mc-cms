const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema({
  examId: { type: mongoose.Schema.Types.ObjectId, ref: "Exam", required: true },
  key: String,
  partOne: { type: [[String]], default: [] }, // mảng các mảng string
  partTwo: { type: [[String]], default: [] },
  partThree: { type: [[String]], default: [] },
});

module.exports = mongoose.model("Answer", answerSchema);
