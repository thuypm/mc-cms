// utils/studentCards.ts
import JsBarcode from 'jsbarcode'
import { PDFDocument } from 'pdf-lib'
import QRCode from 'qrcode'
import { REACT_APP_SERVER_API } from 'utils/constants/environment'

const CARD_WIDTH = 1015
const CARD_HEIGHT = 638
const GAP = 30

const A4_WIDTH = 2480
const A4_HEIGHT = 3508

type Student = {
  MCID: string
  name: string
  dateOfBirth: string
  class: { name: string; grade: number } | string
  avatar: string
}

const cfg = {
  name: {
    x: 666,
    y: 286,
    font: '900 44px Poppins, Montserrat',
    color: '#F45c5c',
    center: true,
  },
  dob: {
    x: 665,
    y: 360,
    font: '700 30px Poppins, Montserrat',
    color: '#1e74bb',
    center: true,
  },
  class: {
    x: 665,
    y: 408,
    font: '700 30px Poppins, Montserrat',
    color: '#1e74bb',
    center: true,
  },
  grade: {
    x: 665,
    y: 458,
    font: '700 30px Poppins, Montserrat',
    color: '#1e74bb',
    center: true,
  },
  mcid: {
    x: 170,
    y: 582,
    font: '600 30px Calibri, system-ui, Montserrat',
    color: '#ffffff',
    center: true,
  },
  qr: { x: 860, y: 25, size: 94 },
  barcode: { x: 455, y: 539, width: 440, height: 71 },
  avatar: { x: 40, y: 192, width: 240, height: 320 },
}

function getSchoolYearsFromGrade(gradeStr: string | number): string {
  const g =
    typeof gradeStr === 'number' ? gradeStr : parseInt(String(gradeStr), 10)
  // Tuỳ trường – ví dụ tốt nghiệp 2026
  if ([10, 11, 12].includes(g)) {
    const gradYear = 2026
    const startYear = gradYear + (9 - g)
    const endYear = gradYear
    return `${startYear}–${endYear}`
  }
  if ([6, 7, 8, 9].includes(g)) {
    const gradYear = 2026
    const startYear = gradYear + (5 - g)
    const endYear = gradYear
    return `${startYear}–${endYear}`
  }
  return ''
}

function loadImage(urlOrDataUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = urlOrDataUrl
  })
}

function drawCenteredText(
  ctx: CanvasRenderingContext2D,
  text: string,
  opts: { x: number; y: number; font: string; color: string; center?: boolean }
) {
  ctx.font = opts.font
  ctx.fillStyle = opts.color
  ctx.textAlign = opts.center ? 'center' : 'left'
  ctx.textBaseline = 'middle'
  ctx.fillText(text, opts.x, opts.y)
}

async function drawAvatarCropped3x4(
  ctx: CanvasRenderingContext2D,
  avatarUrl: string,
  box = cfg.avatar
) {
  try {
    const img = await loadImage(`${REACT_APP_SERVER_API}/images/${avatarUrl}`)
    const width = img.naturalWidth || img.width
    const height = img.naturalHeight || img.height
    const targetRatio = 3 / 4
    const actualRatio = width / height
    let sx = 0,
      sy = 0,
      sw = width,
      sh = height
    if (actualRatio < targetRatio) {
      sh = width / targetRatio
      sy = (height - sh) / 2
    } else if (actualRatio > targetRatio) {
      sw = height * targetRatio
      sx = (width - sw) / 2
    }
    ctx.drawImage(img, sx, sy, sw, sh, box.x, box.y, box.width, box.height)
  } catch (e) {
    // bỏ qua nếu lỗi ảnh
  }
}

async function makeQRCodeDataUrl(text: string, size: number) {
  return QRCode.toDataURL(text, { width: size, margin: 0 })
}

function makeBarcodeDataUrl(
  text: string,
  width: number,
  height: number
): string {
  const cvs = document.createElement('canvas')
  JsBarcode(cvs, text, {
    format: 'CODE128',
    displayValue: false,
    margin: 0,
    width: Math.max(1, Math.floor(width / (text.length * 6))), // module width ước lượng
    height,
  })
  return cvs.toDataURL('image/png')
}

/**
 * Vẽ 1 thẻ học sinh ra canvas (trả về HTMLCanvasElement).
 * @param student
 * @param baseImage Ảnh nền đã load sẵn (HTMLImageElement)
 */
export async function renderStudentCardCanvas(
  student: Student,
  baseImage: HTMLImageElement
): Promise<HTMLCanvasElement> {
  const canvas = document.createElement('canvas')
  canvas.width = CARD_WIDTH
  canvas.height = CARD_HEIGHT
  const ctx = canvas.getContext('2d')!

  // Nền
  ctx.drawImage(baseImage, 0, 0, CARD_WIDTH, CARD_HEIGHT)
  const drawText = (text: string, cfg: any) => {
    ctx.font = cfg.font
    ctx.fillStyle = cfg.color
    ctx.fillText(text, cfg.x, cfg.y)
  }
  // Text
  const className =
    typeof student.class === 'string' ? student.class : student.class.name
  const grade = typeof student.class === 'string' ? '' : student.class.grade
  drawText(student.dateOfBirth, cfg.dob)
  drawText(className, cfg.class)
  drawText(getSchoolYearsFromGrade(grade), cfg.grade)
  drawCenteredText(
    ctx,
    `MCID: ${student.MCID.slice(0, 3)} ${student.MCID.slice(3)}`,
    cfg.mcid
  )
  drawCenteredText(ctx, student.name.toUpperCase(), cfg.name)

  // Avatar (crop 3x4)
  await drawAvatarCropped3x4(ctx, student.avatar, cfg.avatar)

  // QR
  const qrUrl = await makeQRCodeDataUrl(student.MCID, cfg.qr.size)
  const qrImg = await loadImage(qrUrl)
  ctx.drawImage(qrImg, cfg.qr.x, cfg.qr.y, cfg.qr.size, cfg.qr.size)

  // Barcode
  const barcodeUrl = makeBarcodeDataUrl(
    student.MCID,
    cfg.barcode.width,
    cfg.barcode.height
  )
  const barcodeImg = await loadImage(barcodeUrl)
  ctx.drawImage(
    barcodeImg,
    cfg.barcode.x,
    cfg.barcode.y,
    cfg.barcode.width,
    cfg.barcode.height
  )

  return canvas
}

/**
 * Tạo PDF A4 từ danh sách học sinh và tự tải xuống.
 * @param students
 * @param baseImageUrl đường dẫn ảnh nền (Root-<branch>.png)
 * @param filename tên file tải xuống (mặc định 'student-cards.pdf')
 */
export async function exportStudentCardsPdf(
  students: Student[],
  baseImageUrl: string = REACT_APP_SERVER_API + '/base/Root-MC1.png',
  filename = 'student-cards.pdf'
) {
  // Load base image 1 lần
  const baseImg = await loadImage(baseImageUrl)

  // Vẽ từng thẻ → lấy PNG bytes
  const cardPngs: Uint8Array[] = []
  for (const s of students) {
    const cardCanvas = await renderStudentCardCanvas(s, baseImg)
    const blob = await new Promise<Blob>((res) =>
      cardCanvas.toBlob((b) => res(b!), 'image/png')
    )
    const arrayBuf = await blob.arrayBuffer()
    cardPngs.push(new Uint8Array(arrayBuf))
  }

  // Ghép PDF
  const pdf = await PDFDocument.create()
  let page = pdf.addPage([A4_WIDTH, A4_HEIGHT])

  const cols = Math.floor((A4_WIDTH + GAP) / (CARD_WIDTH + GAP))
  const rows = Math.floor((A4_HEIGHT + GAP) / (CARD_HEIGHT + GAP))
  const perPage = rows * cols

  const positions: { x: number; y: number }[] = []
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = GAP + c * (CARD_WIDTH + GAP)
      const y = A4_HEIGHT - (GAP + (r + 1) * (CARD_HEIGHT + GAP))
      positions.push({ x, y })
    }
  }

  for (let i = 0; i < cardPngs.length; i++) {
    if (i > 0 && i % perPage === 0) {
      page = pdf.addPage([A4_WIDTH, A4_HEIGHT])
    }
    const png = await pdf.embedPng(cardPngs[i])
    const { x, y } = positions[i % perPage]
    page.drawImage(png, { x, y, width: CARD_WIDTH, height: CARD_HEIGHT })
  }

  const pdfBytes = await pdf.save()
  // Tải xuống
  const blob = new Blob([new Uint8Array(pdfBytes).buffer], {
    type: 'application/pdf',
  })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}
