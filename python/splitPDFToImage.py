import fitz  # PyMuPDF
import os
from crop import cropAndRotate

pdf_path = 'E:/OneDrive - Marie Curie/scanner/CK II/SCAN0134.pdf'
output_dir = 'SplitPdf'
os.makedirs(output_dir, exist_ok=True)

doc = fitz.open(pdf_path)

for i, page in enumerate(doc):
    pix = page.get_pixmap(dpi=200)  # có thể chỉnh dpi (100–300)
    output_path = os.path.join(output_dir, f'page_{i+1}.png')
    pix.save(output_path)
    cropAndRotate(output_path, 'handle/' + f'page_{i+1}.png')
