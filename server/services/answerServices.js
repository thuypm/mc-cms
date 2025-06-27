const Answer = require("../models/answer.js");
const { ObjectId } = require("mongodb");
async function createAnswer(data) {
  const exam = new Answer(data);
  return await Answer.save();
}

async function getAnswerById(id) {
  return await Answer.findById(id);
}

async function getAllAnswerByExam(examId) {
  return await Answer.find({ examId: new ObjectId(examId) });
}
async function deleteAnswer(id) {
  return Answer.deleteOne({ _id: new ObjectId(id) });
}
async function updateAnswerById(id, updateData) {
  return await Answer.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });
}

module.exports = {
  createAnswer,
  getAnswerById,
  getAllAnswerByExam,
  updateAnswerById,
  deleteAnswer,
};
