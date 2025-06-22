const Assignment = require("../models/assignment.js");
const { spawn } = require("child_process");
const { ObjectId } = require("mongodb");
async function createAssignment(data) {
  const exam = new Assignment(data);
  return await Assignment.save();
}

async function getAssignmentById(id) {
  return await Assignment.findById(id);
}

async function getAllAssignmentByExam(examId) {
  return await Assignment.find({ examId: new ObjectId(examId) });
}
async function deleteAssignment(id) {
  return Assignment.deleteOne({ _id: new ObjectId(id) });
}
async function updateAssignmentById(id, updateData) {
  return await Assignment.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });
}
async function handleScoring(filePath, examId) {
  return new Promise((resolve, reject) => {
    const pythonProcess = spawn("python3", [
      "./python/index.py",
      filePath,
      examId,
    ]);
    pythonProcess.stdout.on("data", (data) => {
      console.log("Kết quả từ Python:", data.toString());
    });
    pythonProcess.on("close", (code) => {
      resolve(true);
    });
    pythonProcess.stderr.on("data", (data) => {
      console.log("has Error", data.toString());
    });
  });
}
module.exports = {
  createAssignment,
  getAssignmentById,
  getAllAssignmentByExam,
  updateAssignmentById,
  handleScoring,
  deleteAssignment,
};
