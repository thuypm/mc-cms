const mongoose = require("mongoose");

const examSchema = new mongoose.Schema({
  name: String,
  room: { type: mongoose.Schema.Types.ObjectId, ref: "Room" },
  numOfPartOne: Number,
  scorePartOne: Number,
  numOfPartTwo: Number,
  scorePartTwo: Array,
  numOfPartThree: Number,
  scorePartThree: Number,
  assignments: Array,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

examSchema.virtual("answerList", {
  ref: "Answer",
  localField: "_id",
  foreignField: "examId",
});

examSchema.set("toObject", { virtuals: true });
examSchema.set("toJSON", { virtuals: true });
module.exports = mongoose.model("Exam", examSchema);
