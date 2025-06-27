const Room = require("../models/room.js");
const { ObjectId } = require("mongodb");
const xlsx = require("xlsx");
async function createRoom(name, file) {
  if (!file) throw new Error("Không có file được cung cấp.");

  // Đọc file Excel
  const workbook = xlsx.readFile(file.path);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];

  // Chuyển sheet thành JSON
  const rows = xlsx.utils.sheet_to_json(sheet, { header: 1 });

  // Bỏ qua dòng tiêu đề
  const dataRows = rows.slice(1);

  // Parse từng dòng thành student
  const students = dataRows.map((row) => {
    const [studentId, name, className, email] = row;
    return {
      studentId: String(studentId).trim(),
      name: String(name).trim(),
      class: String(className).trim(),
      email: String(email).trim(),
    };
  });

  const room = new Room({
    roomName: name,
    exams: [],
    students,
  });

  return await room.save();
}

async function getRoomById(id) {
  return await Room.findById(id);
}

async function getAllRoom() {
  return await Room.find();
}
async function deleteRoom(id) {
  return Room.deleteOne({ _id: new ObjectId(id) });
}
async function updateRoomById(id, updateData) {
  return await Room.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });
}

module.exports = {
  createRoom,
  getRoomById,
  getAllRoom,
  updateRoomById,
  deleteRoom,
};
