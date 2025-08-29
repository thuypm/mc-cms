const fs = require("fs");
const path = require("path");

// Đọc file student.json
const students = JSON.parse(fs.readFileSync("mccms.students.json", "utf8"));

// Map nhanh MCID -> VNEDUID
const mapping = {};
students.forEach((s) => {
  if (s.MCID && s.VNEDUID) {
    mapping[s.MCID] = s.VNEDUID;
  }
});

const imagesDir = '../public/images/';

fs.readdirSync(imagesDir).forEach((file) => {
  const ext = path.extname(file).toLowerCase();
  const base = path.basename(file, ext);

  if (mapping[base]) {
    const oldPath = path.join(imagesDir, file);
    const newPath = path.join(imagesDir, mapping[base] + ext);

    try {
      fs.renameSync(oldPath, newPath);
      console.log(`✅ ${file} → ${mapping[base]}${ext}`);
    } catch (err) {
      console.error(`❌ Lỗi đổi tên ${file}:`, err);
    }
  }
});
