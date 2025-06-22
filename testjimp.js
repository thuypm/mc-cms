const { Jimp } = require("jimp");
const path = require("path");
const { rgbaToInt } = require("@jimp/utils");
const IMAGE_PATH = path.join(__dirname, "images", "aligned.jpg");

// Cấu hình vùng SBD
const SBD_START_X = 636;
const SBD_START_Y = 69;
const BOX_WIDTH = 228;
const BOX_HEIGHT = 320;
const BOX_GAP_X = 0;
const BOX_GAP_Y = 0;
const NUM_DIGITS = 6;

(async () => {
  try {
    // Đọc ảnh và tạo bản sao để đánh dấu
    const image = await Jimp.read(IMAGE_PATH);
    const debugImage = image.clone(); // Ảnh để đánh dấu vùng
    const gray = image.clone().greyscale();

    gray.threshold({ max: 150, autoGreyscale: false });

    const sbd = [];
    const red = rgbaToInt(255, 0, 0, 255); // Màu đỏ để đánh dấu

    for (let col = 0; col < NUM_DIGITS; col++) {
      const digitValues = [];

      for (let row = 0; row < 10; row++) {
        const x = SBD_START_X + col * BOX_GAP_X;
        const y = SBD_START_Y + row * BOX_GAP_Y;

        // Kiểm tra vùng ROI
        if (
          x + BOX_WIDTH > image.bitmap.width ||
          y + BOX_HEIGHT > image.bitmap.height
        ) {
          console.error(`Vùng ROI (${x},${y}) vượt quá kích thước ảnh`);
          continue;
        }

        // Đánh dấu vùng đang xử lý bằng khung đỏ
        debugImage.scan(x, y, BOX_WIDTH, 2, (x, y, idx) => {
          // Khung trên
          debugImage.bitmap.data.writeUInt32BE(red, idx);
        });
        debugImage.scan(x, y, 2, BOX_HEIGHT, (x, y, idx) => {
          // Khung trái
          debugImage.bitmap.data.writeUInt32BE(red, idx);
        });
        debugImage.scan(x + BOX_WIDTH - 2, y, 2, BOX_HEIGHT, (x, y, idx) => {
          // Khung phải
          debugImage.bitmap.data.writeUInt32BE(red, idx);
        });
        debugImage.scan(x, y + BOX_HEIGHT - 2, BOX_WIDTH, 2, (x, y, idx) => {
          // Khung dưới
          debugImage.bitmap.data.writeUInt32BE(red, idx);
        });

        const roi = gray.clone().crop({
          x,
          y,
          w: BOX_WIDTH,
          h: BOX_HEIGHT,
        });

        let blackPixels = 0;
        roi.scan(
          0,
          0,
          roi.bitmap.width,
          roi.bitmap.height,
          function (x, y, idx) {
            const val = this.bitmap.data[idx];
            if (val < 50) blackPixels++;
          }
        );
        digitValues.push({ digit: row, value: blackPixels });
      }

      if (digitValues.length === 0) {
        console.error(`Không tìm thấy giá trị cho cột ${col}`);
        sbd.push("?");
        continue;
      }

      const best = digitValues.reduce((a, b) => (a.value > b.value ? a : b));
      sbd.push(best.digit);

      // Đánh dấu số được chọn bằng khung màu xanh
      const bestY = SBD_START_Y + best.digit * BOX_GAP_Y;
      const green = rgbaToInt(0, 255, 0, 255);
      debugImage.scan(
        SBD_START_X + col * BOX_GAP_X,
        bestY,
        BOX_WIDTH,
        5,
        (x, y, idx) => {
          debugImage.bitmap.data.writeUInt32BE(green, idx);
        }
      );
    }

    console.log("📌 Số báo danh:", sbd.join(""));

    // Lưu các ảnh debug
    // await gray.write(path.join(__dirname, "debug_gray.jpg"));
    await debugImage.write(path.join(__dirname, "debug_marked.jpg"));

    console.log("✅ Đã lưu ảnh đánh dấu tại: debug_marked.jpg");
  } catch (error) {
    console.error("❌ Lỗi khi xử lý ảnh:", error);
  }
})();
