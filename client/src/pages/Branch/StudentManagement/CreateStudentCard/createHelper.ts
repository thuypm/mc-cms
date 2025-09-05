// utils/studentCards.ts
import JsBarcode from 'jsbarcode'
import { PDFDocument } from 'pdf-lib'
import QRCodeStyling from 'qr-code-styling'
import { REACT_APP_SERVER_API } from 'utils/constants/environment'
type Student = {
  VNEDUID: string
  name: string
  dateOfBirth: string
  class: { name: string; grade: number } | string
  image: string
  grade: string
  branch: string
}
const SCALE = 2

const CARD_WIDTH = 1015 * SCALE
const CARD_HEIGHT = 638 * SCALE
const GAP = 20 * SCALE

const A4_WIDTH = 2480 * SCALE
const A4_HEIGHT = 3508 * SCALE

const cfg = {
  name: {
    x: 635 * SCALE,
    y: 311 * SCALE,
    font: `900 82px Paytone One, Poppins, Montserrat`, // font-size vẫn px, nhưng nếu muốn nét hơn bạn có thể giữ nguyên và rely vào 2x canvas
    color: '#F45c5c',
    center: true,
  },
  dob: {
    x: 662 * SCALE,
    y: 377 * SCALE,
    font: `700 ${28 * SCALE}px Poppins, Montserrat`,
    color: '#1e74bb',
    center: false,
  },
  class: {
    x: 662 * SCALE,
    y: 420 * SCALE,
    font: `700 ${28 * SCALE}px Poppins, Montserrat`,
    color: '#1e74bb',
    center: false,
  },
  grade: {
    x: 662 * SCALE,
    y: 465 * SCALE,
    font: `700 ${28 * SCALE}px Poppins, Montserrat`,
    color: '#1e74bb',
    center: false,
  },
  VNEDUID: {
    x: 662 * SCALE,
    y: 500 * SCALE,
    font: `600 ${28 * SCALE}px Poppins, Montserrat`,
    color: '#1e74bb',
    center: false,
  },
  qr: { x: 876 * SCALE, y: 504 * SCALE, size: 112 * SCALE },
  barcode: {
    x: 455 * SCALE,
    y: 539 * SCALE,
    width: 440 * SCALE,
    height: 71 * SCALE,
  },
  image: {
    x: 44 * SCALE,
    y: 182 * SCALE,
    width: 281 * SCALE,
    height: ((281 * 4) / 3) * SCALE,
  },
  seal: {
    x: 170 * SCALE, // vị trí x (ví dụ góc dưới phải thẻ)
    y: 354 * SCALE, // vị trí y
    width: 320 * SCALE, // kích thước dấu
    height: 320 * SCALE,
    opacity: 0.8,
  },
}

function getSchoolYearsFromGrade(gradeStr: string | number): string {
  const g =
    typeof gradeStr === 'number' ? gradeStr : parseInt(String(gradeStr), 10)
  if (isNaN(g)) return ''

  const currentYear = new Date().getFullYear()

  if (g >= 10 && g <= 12) {
    // mốc khối 10
    const startYear = currentYear - (g - 10)
    const endYear = startYear + 3
    return `${startYear}–${endYear}`
  }

  if (g >= 6 && g <= 9) {
    // mốc khối 6
    const startYear = currentYear - (g - 6)
    const endYear = startYear + 4
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

async function drawSeal(
  ctx: CanvasRenderingContext2D,
  branch: string,
  cfgSeal: {
    x: number
    y: number
    width: number
    height: number
    opacity?: number
  }
) {
  try {
    const sealUrl = `${REACT_APP_SERVER_API}/base/dau ${branch}.png`
    const sealImg = await loadImage(sealUrl)

    ctx.save()
    if (cfgSeal.opacity !== undefined) {
      ctx.globalAlpha = cfgSeal.opacity
    }
    ctx.drawImage(sealImg, cfgSeal.x, cfgSeal.y, cfgSeal.width, cfgSeal.height)
    ctx.restore()
  } catch (e) {
    console.warn('Không load được con dấu:', e)
  }
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
  box = cfg.image
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
      // Ảnh quá cao, cắt bớt chiều cao -> cắt từ trên xuống
      sh = width / targetRatio
      sy = (height - sh) / 2
      // sy = 0
    } else if (actualRatio > targetRatio) {
      // Ảnh quá rộng, cắt ngang ở giữa
      sw = height * targetRatio
      sx = (width - sw) / 2
    }

    ctx.drawImage(img, sx, sy, sw, sh, box.x, box.y, box.width, box.height)
  } catch (e) {
    // bỏ qua nếu lỗi ảnh
  }
}

// async function makeQRCodeDataUrl(text: string, size: number) {
//   return QRCode.toDataURL(text, { width: size, margin: 0 })
// }
async function makeStyledQRCodeDataUrl(text: string, size: number) {
  const qr = new QRCodeStyling({
    width: size,
    height: size,

    type: 'canvas',
    data: text,
    qrOptions: {
      errorCorrectionLevel: 'H', // vừa đủ, dễ quét
    },
    cornersSquareOptions: {
      type: 'extra-rounded',
      color: 'black',
    },
    dotsOptions: {
      type: 'extra-rounded', // bo tròn
      color: 'black',
      // đen
    },
    backgroundOptions: {
      color: '#ffffff', // nền trắng
    },
    margin: 4,
  })

  return new Promise<string>((resolve) => {
    qr.getRawData('png').then((blob) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.readAsDataURL(blob as Blob)
    })
  })
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
  drawText(
    `${className.replace(student.grade, '')} - ${Number(student.grade) > 9 ? 'THPT' : 'THCS'}`,
    cfg.class
  )
  drawText(getSchoolYearsFromGrade(grade), cfg.grade)
  drawCenteredText(
    ctx,
    `${student.VNEDUID.slice(0, 4)} ${student.VNEDUID.slice(4, 7)} ${student.VNEDUID.slice(7, 10)}`,
    cfg.VNEDUID
  )
  drawCenteredText(ctx, student.name.toUpperCase(), cfg.name)

  // Avatar (crop 3x4)
  await drawAvatarCropped3x4(ctx, student.image, cfg.image)
  await drawSeal(ctx, `MC${student.branch}`, cfg.seal)
  // QR
  const qrUrl = await makeStyledQRCodeDataUrl(student.VNEDUID, cfg.qr.size)
  const qrImg = await loadImage(qrUrl)
  ctx.drawImage(qrImg, cfg.qr.x, cfg.qr.y, cfg.qr.size, cfg.qr.size)

  // Barcode
  // const barcodeUrl = makeBarcodeDataUrl(
  //   student.VNEDUID,
  //   cfg.barcode.width,
  //   cfg.barcode.height
  // )
  // const barcodeImg = await loadImage(barcodeUrl)
  // ctx.drawImage(
  //   barcodeImg,
  //   cfg.barcode.x,
  //   cfg.barcode.y,
  //   cfg.barcode.width,
  //   cfg.barcode.height
  // )

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
  baseImageUrl: string = REACT_APP_SERVER_API + '/base/base MC1.png',
  filename = 'student-cards.pdf'
) {
  // Load base image 1 lần

  // Vẽ từng thẻ → lấy PNG bytes
  const cardPngs: Uint8Array[] = []
  for (const s of students) {
    const baseImg = await loadImage(
      `${REACT_APP_SERVER_API}/base/base MC${s.branch}.png`
    )
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
