const fs = require("fs");

// Đọc dữ liệu từ file
const data = JSON.parse(fs.readFileSync("./dataC3.1.json", "utf8"));

// Hàm tạo email từ name + dateOfBirth
function generateEmail(name, dob) {
  if (!name || !dob) return "";

  const parts = name.trim().split(/\s+/);
  const lastName = parts[parts.length - 1].toLowerCase();
  const initials = parts
    .slice(0, -1)
    .map((word) => word[0].toLowerCase())
    .join("");
  const [day, month] = dob.split("/");

  return `${lastName}${initials}${day}${month}@smmc.edu.vn`;
}

// Thêm email vào từng học sinh
const updated = data.map((student) => ({
  ...student,
  email: generateEmail(student.name, student.dateOfBirth),
}));

// Ghi ra file mới
fs.writeFileSync(
  "./dataC3.1.updated.json",
  JSON.stringify(updated, null, 2),
  "utf8"
);

console.log("✅ Email fields added and saved to dataC3.1.updated.json");
