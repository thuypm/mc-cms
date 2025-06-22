import cv2
import numpy as np
from dataPaper import configPaper

def find_darkest_circle_per_column(roi_gray, rows=12, cols=4, binary_thresh=150, threshold_diff=10.0, mean_val_thresh=200):
    """
    Tìm các hàng có hình tròn tô đậm nhất trong mỗi cột.
    Cho phép ghi nhận nhiều ô nếu mức độ đậm gần nhau.
    """
    h, w = roi_gray.shape
    cell_h = h // rows
    cell_w = w // cols

    row_to_letter = ['-', ',', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
    result = []
    debug_circles = []

    for col in range(cols):
        candidates = []
        for row in range(rows):
            x1 = col * cell_w
            x2 = (col + 1) * cell_w
            y1 = row * cell_h
            y2 = (row + 1) * cell_h

            cell = roi_gray[y1:y2, x1:x2]
            cell_blur = cv2.GaussianBlur(cell, (3, 3), 0)
            ret, cell_thresh = cv2.threshold(cell_blur, binary_thresh, 255, cv2.THRESH_BINARY_INV)

            circles = cv2.HoughCircles(cell_thresh, cv2.HOUGH_GRADIENT, dp=1.2,
                                       minDist=cell_h // 2,
                                       param1=30, param2=8,
                                       minRadius=5, maxRadius=cell_h // 2)
            if circles is not None and len(circles[0]) > 0:
                c = np.round(circles[0, 0]).astype("int")
                x, y, r = c
                mask = np.zeros_like(cell)
                cv2.circle(mask, (x, y), r, 255, -1)
                mean_val = cv2.mean(cell, mask=mask)[0]
                if mean_val < mean_val_thresh:
                    candidates.append((row, mean_val, (x + x1, y + y1, r)))

        if not candidates:
            result.append([])
        else:
            candidates.sort(key=lambda x: x[1])
            best_val = candidates[0][1]
            answer_list = []

            for row_idx, mean_val, (cx, cy, r) in candidates:
                if mean_val - best_val <= threshold_diff:
                    answer_list.append(row_to_letter[row_idx])
                    debug_circles.append((row_idx, col, cx, cy, r))
                else:
                    break
            result.append(answer_list)

    return result, debug_circles


def draw_debug_circles_on_roi(roi_color, debug_circles):
    """
    Vẽ các hình tròn đã được chọn lên ảnh ROI để debug.
    """
    debug_img = roi_color.copy()
    row_to_letter = ['-', ',', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9']

    for row, col, x, y, r in debug_circles:
        cv2.circle(debug_img, (x, y), r, (0, 0, 255), 2)
        text = row_to_letter[row] if 0 <= row < len(row_to_letter) else '?'
        cv2.putText(debug_img, text, (x - 10, y + 5),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 0), 2)
    return debug_img


def process_matrix_image(img, roi, debug = False):
    if img is None:
        print(f"Không thể đọc ảnh từ: {image_path}")
        return [], None

    x_min, y_min, x_max, y_max = roi
    roi_color = img[y_min:y_max, x_min:x_max]
    roi_gray = cv2.cvtColor(roi_color, cv2.COLOR_BGR2GRAY)
   
    digits, debug_circles = find_darkest_circle_per_column(roi_gray)
    if(debug):
        debug_img = draw_debug_circles_on_roi(roi_color, debug_circles)

        return digits, debug_img
    return digits
def processPartThree(img):
    mapDigist = []
    listRois = configPaper["PARTTHREE_BOUND"]
    for rois in listRois:
        digits = process_matrix_image(img, rois)
        mapDigist.append(digits)
    return mapDigist

if __name__ == "__main__":
    image_path = "../images/khtn.jpg"
    mapDigits = []
    listRois = [
        [37 , 1046, 161 , 1375],
        [206 , 1046, 330 , 1375],
        [374 , 1046, 497 , 1375],
        [535 , 1046, 660 , 1375],
        [700 , 1046, 830 , 1375],
        [868 , 1046, 996 , 1375],
    ]

    for rois in listRois:
        digits, debug_img = process_matrix_image(image_path, rois, binary_thresh=150)
        mapDigits += digits

    print("Giá trị nhận dạng phần 1:", mapDigits)

    if debug_img is not None:
        cv2.imshow("Debug ROI", debug_img)
        cv2.waitKey(0)
        cv2.destroyAllWindows()
        cv2.imwrite("debug_roi.jpg", debug_img)
        print("Ảnh debug đã được lưu thành debug_roi.jpg")
