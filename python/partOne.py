import cv2
import numpy as np
from dataPaper import configPaper

def find_darkest_circle_per_row(roi_gray, rows=10, cols=4, binary_thresh=150, threshold_diff=10.0, mean_val_thresh=200):
    """
    Tìm các cột có hình tròn tô đậm nhất trong mỗi hàng.
    Cho phép ghi nhận nhiều ô nếu mức độ đậm gần nhau.
    """
    h, w = roi_gray.shape
    cell_h = h // rows
    cell_w = w // cols

    col_to_letter = ['A', 'B', 'C', 'D']
    result = []
    debug_circles = []

    for row in range(rows):
        candidates = []
        for col in range(cols):
            x1 = col * cell_w
            x2 = (col + 1) * cell_w
            y1 = row * cell_h
            y2 = (row + 1) * cell_h

            cell = roi_gray[y1:y2, x1:x2]
            cell_blur = cv2.GaussianBlur(cell, (3, 3), 0)
            ret, cell_thresh = cv2.threshold(cell_blur, binary_thresh, 255, cv2.THRESH_BINARY_INV)

            circles = cv2.HoughCircles(cell_thresh, cv2.HOUGH_GRADIENT, dp=1.2,
                                       minDist=cell_w // 2,
                                       param1=30, param2=8,
                                       minRadius=5, maxRadius=cell_h // 2)
            if circles is not None and len(circles[0]) > 0:
                c = np.round(circles[0, 0]).astype("int")
                x, y, r = c
                mask = np.zeros_like(cell)
                cv2.circle(mask, (x, y), r, 255, -1)
                mean_val = cv2.mean(cell, mask=mask)[0]
                if mean_val < mean_val_thresh:
                    candidates.append((col, mean_val, (x + x1, y + y1, r)))

        if not candidates:
            result.append([])
        else:
            candidates.sort(key=lambda x: x[1])
            best_val = candidates[0][1]
            answer_list = []

            for col_idx, mean_val, (cx, cy, r) in candidates:
                if mean_val - best_val <= threshold_diff:
                    answer_list.append(col_to_letter[col_idx])
                    debug_circles.append((row, col_idx, cx, cy, r))  # Vẽ hết các ô gần như tốt
                else:
                    break  # Các ô còn lại chênh lệch nhiều, bỏ qua
            result.append(answer_list)

    return result, debug_circles

def draw_debug_circles_on_roi(roi_color, debug_circles):
    """
    Vẽ các hình tròn đã được chọn lên ảnh ROI để debug.

    Args:
        roi_color (ndarray): Ảnh màu của ROI.
        debug_circles (list): Danh sách các hình tròn (row, col, x, y, r).

    Returns:
        ndarray: Ảnh debug đã được vẽ.
    """
    debug_img = roi_color.copy()
    col_to_letter = ['A', 'B', 'C', 'D']  # Cột 0 -> A, cột 1 -> B, v.v.

    for row, col, x, y, r in debug_circles:
        cv2.circle(debug_img, (x, y), r, (0, 0, 255), 2)
        if 0 <= col < len(col_to_letter):
            text = col_to_letter[col]
        else:
            text = '?'
        cv2.putText(debug_img, text, (x - 10, y + 5),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 0), 2)
    return debug_img


def process_matrix_image(img, roi, debug = False):
    """
    Xử lý ảnh và nhận diện dãy số từ ma trận 10 hàng × 6 cột.
    
    Args:
        image_path (str): Đường dẫn tới ảnh.
        roi (tuple): (x_min, y_min, x_max, y_max) của vùng cần nhận diện.
        binary_thresh (int): Ngưỡng nhị phân để chuyển đổi ảnh.
        
    Returns:
        tuple: (danh sách 6 chữ số, ảnh debug ROI)
    """
    if img is None:
        print(f"Không thể đọc ảnh từ: {image_path}")
        return [], None

    x_min, y_min, x_max, y_max = roi
    roi_color = img[y_min:y_max, x_min:x_max]
    roi_gray = cv2.cvtColor(roi_color, cv2.COLOR_BGR2GRAY)

    digits, debug_circles = find_darkest_circle_per_row(roi_gray,)
    if(debug):
        debug_img = draw_debug_circles_on_roi(roi_color, debug_circles)
        return digits, debug_img
    return digits
def processPartOne(img):
    mapDigist = []
    listRois = configPaper['PARTONE_BOUND']

    for rois in listRois:
        digits = process_matrix_image(img, rois)
        mapDigist = mapDigist + digits
    return mapDigist

if __name__ == "__main__":
    image_path = "../images/full40.jpg"
    mapDigist = []
    listRois = [
        [46 , 462, 237 , 739],
        [302 , 462, 485 , 739],
        [504 , 462, 732 , 739],
        [806 , 462, 991 , 739],
    ]
    for rois in listRois:
        digits, debug_img = process_matrix_image(image_path, rois, binary_thresh=150)
        mapDigist = mapDigist + digits
    print("Giá trị nhận dạng phần 1:", mapDigist)

    if debug_img is not None:
        cv2.imshow("Debug ROI", debug_img)
        cv2.waitKey(0)
        cv2.destroyAllWindows()
        cv2.imwrite("debug_roi.jpg", debug_img)
        print("Ảnh debug đã được lưu thành debug_roi.jpg")
