const answer = require("../models/answer.js");
const Exam = require("../models/exam.js");
const Assignment = require("../models/assignment.js");
const xlsx = require("xlsx");
const { ObjectId } = require("mongodb");
const fs = require("fs");
async function createExam(data) {
  const exam = await Exam.create(data);
  return exam;
}
async function updateExamById(id, updateData) {
  const updatedExam = await Exam.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });
  return updatedExam;
}
async function getExamById(id) {
  return await Exam.findById(id).populate("answerList").populate("room");
}

async function getAllExams() {
  const counts = await Assignment.aggregate([
    {
      $group: {
        _id: "$examId",
        count: { $sum: 1 },
      },
    },
  ]);
  const countMap = new Map(
    counts.map((item) => [item._id.toString(), item.count])
  );

  // 2. Lấy tất cả exams và populate room
  const exams = await Exam.find().populate("room");

  // 3. Gắn countAssignment vào từng exam
  return exams.map((exam) => {
    const examObj = exam.toObject();
    examObj.countAssignment = countMap.get(exam._id.toString()) || 0;
    return examObj;
  });
}

async function readExcelFile(filePath, examId) {
  const workbook = xlsx.readFile(filePath);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const range = xlsx.utils.decode_range(sheet["!ref"]);

  const startCol = 2; // Cột C => index = 2 (A=0, B=1, C=2)

  const answers = [];

  for (let col = startCol; col <= range.e.c; col++) {
    const colLetter = xlsx.utils.encode_col(col); // chuyển index -> A, B, C...
    const keyCell = sheet[`${colLetter}1`];
    if (!keyCell || !keyCell.v || keyCell.v.toString().trim() === "") {
      continue; // bỏ qua cột không có tiêu đề
    }
    const key = keyCell.v.toString().trim();

    const getAnswer = (rowIndex) => {
      const cell = sheet[`${colLetter}${rowIndex}`];
      if (
        !cell ||
        cell.v === undefined ||
        cell.v === null ||
        cell.v.toString().trim() === ""
      ) {
        return [];
      }

      const raw = cell.v.toString().trim();
      return raw.includes("/") ? raw.split("/").map((v) => v.trim()) : [raw];
    };

    const buildPart = (fromRow, toRow) => {
      const result = [];
      for (let row = fromRow; row <= toRow; row++) {
        result.push(getAnswer(row));
      }
      return result;
    };

    answers.push({
      key,
      examId,

      partOne: buildPart(2, 41),
      partTwo: buildPart(42, 73),
      partThree: buildPart(74, 85),
    });
  }

  await answer.insertMany(answers);
  return answers;
}
async function deleteExam(id) {
  await fs.rmSync(`../images/${id}}`, { recursive: true, force: true });
  return await Exam.deleteOne({ _id: new ObjectId(id) });
}
module.exports = {
  createExam,
  getExamById,
  getAllExams,
  readExcelFile,
  updateExamById,
  deleteExam,
};
