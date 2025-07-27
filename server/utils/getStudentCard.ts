import bwipjs from "bwip-js";
import {
  CanvasRenderingContext2D,
  createCanvas,
  loadImage,
  registerFont,
} from "canvas";
import path from "path";
import { PDFDocument } from "pdf-lib";
import QRCode from "qrcode";

const CARD_WIDTH = 1015; // 8.6cm @300dpi
const CARD_HEIGHT = 638; // 5.4cm @300dpi
const GAP = 60; // 0.5cm @300dpi
const DPI = 300;

const A4_WIDTH = 2480; // 21cm @300dpi
const A4_HEIGHT = 3508; // 29.7cm @300dpi

// Load font nếu cần (nếu bạn có font Poppins hoặc Calibri.ttf)
registerFont("public/fonts/Poppins/Poppins-Bold.ttf", {
  family: "Poppins",
});
registerFont("public/fonts/Calibri/calibri-bold.ttf", {
  family: "Calibri",
});

function drawCenteredText(
  ctx: CanvasRenderingContext2D,
  text: string,
  { x, y, font, color }: { x: number; y: number; font: string; color: string }
) {
  ctx.font = font;
  ctx.fillStyle = color;

  // Căn giữa văn bản
  ctx.textAlign = "center"; // Căn giữa theo chiều ngang
  ctx.textBaseline = "middle"; // Căn giữa theo chiều dọc

  ctx.fillText(text, x, y);
}
const config = {
  name: { x: 666, y: 286, font: "40px Poppins", color: "#F45c5c" },
  dob: { x: 665, y: 359, font: "28px Poppins", color: "#1e74bb" },
  class: { x: 665, y: 407, font: "bold 28px Poppins", color: "#1e74bb" },
  mcid: { x: 171, y: 584, font: "28px Calibri", color: "#ffffff" },
  grade: { x: 665, y: 457, font: "bold 28px Poppins", color: "#1e74bb" },
  qr: { x: 850, y: 25, size: 94 },
  barcode: { x: 455, y: 539, width: 440, height: 71 },
  avatar: { x: 40, y: 192, width: 240, height: 320 },
};

function getSchoolYearsFromGrade(gradeStr: string): string {
  const grade = parseInt(gradeStr);

  if ([10, 11, 12].includes(grade)) {
    const gradYear = 2026;
    const startYear = gradYear + (9 - grade);
    const endYear = gradYear;
    return `${startYear}–${endYear}`;
  }
  if ([6, 7, 8, 9].includes(grade)) {
    const gradYear = 2026;
    const startYear = gradYear + (5 - grade);
    const endYear = gradYear;

    return `${startYear}–${endYear}`;
  }
  return "";
}

export const generateStudentCard = async (
  student: any,
  baseImage: any
): Promise<Buffer> => {
  const canvas = createCanvas(CARD_WIDTH, CARD_HEIGHT);
  const ctx = canvas.getContext("2d");

  ctx.drawImage(baseImage, 0, 0, CARD_WIDTH, CARD_HEIGHT);

  const drawText = (text: string, cfg: any) => {
    ctx.font = cfg.font;
    ctx.fillStyle = cfg.color;
    ctx.fillText(text, cfg.x, cfg.y);
  };
  // drawText(student.name.toUpperCase(), config.name);
  drawText(student.dateOfBirth, config.dob);
  drawText(student.class.name || student.class, config.class);

  drawText(getSchoolYearsFromGrade(student.class.grade), config.grade);

  drawCenteredText(ctx, `MCID: ${student.MCID}`, config.mcid);
  drawCenteredText(ctx, student.name.toUpperCase(), config.name);
  try {
    const avatarPath = path.join(
      process.cwd(),
      "public",
      "images",
      student.avatar
    );
    const avatarImg = await loadImage(avatarPath);
    ctx.drawImage(
      avatarImg,
      config.avatar.x,
      config.avatar.y,
      config.avatar.width,
      config.avatar.height
    );
  } catch (err) {
    console.warn(`⚠️ Không thể tải ảnh: ${student.avatar}`);
  }
  // QR code
  const qrData = await QRCode.toDataURL(student.MCID, {
    width: config.qr.size,
    margin: 0,
  });
  const qrImage = await loadImage(qrData);
  ctx.drawImage(
    qrImage,
    config.qr.x,
    config.qr.y,
    config.qr.size,
    config.qr.size
  );

  // Barcode
  const barcodePng = await bwipjs.toBuffer({
    bcid: "code128",
    text: student.MCID,
    scale: 3,
    height: 10,
    includetext: false,
    backgroundcolor: "FFFFFF",
  });
  const barcodeImg = await loadImage(barcodePng);
  ctx.drawImage(
    barcodeImg,
    config.barcode.x,
    config.barcode.y,
    config.barcode.width,
    config.barcode.height
  );

  return canvas.toBuffer("image/png");
};

export async function createStudentPDF(
  cards: Uint8Array[]
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  let page = pdfDoc.addPage([A4_WIDTH, A4_HEIGHT]);

  const cols = Math.floor((A4_WIDTH + GAP) / (CARD_WIDTH + GAP));
  const rows = Math.floor((A4_HEIGHT + GAP) / (CARD_HEIGHT + GAP));

  const positions: { x: number; y: number }[] = [];

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = GAP + col * (CARD_WIDTH + GAP);
      const y = A4_HEIGHT - (GAP + (row + 1) * (CARD_HEIGHT + GAP));
      positions.push({ x, y });
    }
  }

  for (let i = 0; i < cards.length; i++) {
    if (i > 0 && i % (rows * cols) === 0) {
      page = pdfDoc.addPage([A4_WIDTH, A4_HEIGHT]);
    }

    const png = await pdfDoc.embedPng(cards[i]);
    const { x, y } = positions[i % positions.length];
    page.drawImage(png, { x, y, width: CARD_WIDTH, height: CARD_HEIGHT });
  }

  return await pdfDoc.save();
}
