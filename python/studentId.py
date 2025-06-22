from dataPaper import configPaper
import cv2
import numpy as np

def find_darkest_circle_per_column(roi_gray, rows=10, cols=6, binary_thresh=150, threshold_diff=3.0):
    """
    Tìm hàng có hình tròn tô đậm nhất trong mỗi cột bằng cách thực hiện threshold (nhị phân)
    trên từng ô và sử dụng HoughCircles.
    
    Nếu có 2 ô ở trên cùng 1 cột có mức đậm gần như nhau (sự chênh lệch < threshold_diff)
    thì lưu cả 2 vào mảng con. Nếu không có hình tròn nào được phát hiện thì mảng con rỗng.
    
    Args:
        roi_gray (ndarray): Ảnh grayscale của ROI.
        rows (int): Số hàng (mặc định 10).
        cols (int): Số cột (mặc định 3).
        binary_thresh (int): Ngưỡng dùng để chuyển ảnh về dạng nhị phân.
        threshold_diff (float): Ngưỡng chênh lệch giữa 2 candidate để ghi nhận cả 2.
        
    Returns:
        result: list với độ dài bằng số cột, mỗi phần tử là list chứa các chỉ số hàng được nhận diện (0–9)
        debug_circles: list chứa tuple (col, row, x, y, r) của hình tròn được chọn (candidate đầu tiên ở mỗi cột)
    """
    h, w = roi_gray.shape
    cell_h = h // rows
    cell_w = w // cols

    result = []         # Danh sách các mảng con, mỗi mảng ứng với 1 cột
    debug_circles = []  # Dùng để vẽ debug hình tròn chọn được trên mỗi cột

    for col in range(cols):
        candidates = []
        for row in range(rows):
            x1 = col * cell_w
            x2 = (col + 1) * cell_w
            y1 = row * cell_h
            y2 = (row + 1) * cell_h

            cell = roi_gray[y1:y2, x1:x2]
            # Làm mờ nhẹ để giảm nhiễu
            cell_blur = cv2.GaussianBlur(cell, (3, 3), 0)
            # Chuyển sang ảnh nhị phân, dùng THRESH_BINARY_INV: vùng tô (đậm) sẽ chuyển thành vùng sáng
            ret, cell_thresh = cv2.threshold(cell_blur, binary_thresh, 255, cv2.THRESH_BINARY_INV)

            circles = cv2.HoughCircles(cell_thresh, cv2.HOUGH_GRADIENT, dp=1.2,
                                       minDist=cell_h // 2,
                                       param1=30, param2=8,
                                       minRadius=5, maxRadius=cell_h // 2)
            if circles is not None and len(circles[0]) > 0:
                # Lấy hình tròn đầu tiên (có thể thay đổi chiến lược nếu cần)
                c = np.round(circles[0, 0]).astype("int")
                x, y, r = c
                mask = np.zeros_like(cell)
                cv2.circle(mask, (x, y), r, 255, -1)
                mean_val = cv2.mean(cell, mask=mask)[0]
                candidates.append((row, mean_val, (x + x1, y + y1, r)))
                
        if not candidates:
            result.append([])  # Không phát hiện được ô nào ở cột này
        else:
            # Sắp xếp các candidate theo mức xám (mean_val), giá trị càng nhỏ nghĩa là càng đậm
            candidates.sort(key=lambda x: x[1])
            best = candidates[0]  # Candidate tốt nhất
            row_list = [best[0]]
            # Nếu có candidate thứ hai có sự chênh lệch rất nhỏ (< threshold_diff) so với candidate tốt nhất, ghi nhận cả 2
            if len(candidates) > 1:
                diff = candidates[1][1] - best[1]
                if diff < threshold_diff:
                    row_list.append(candidates[1][0])
            result.append(row_list)
            # Debug: chỉ lấy candidate đầu tiên để vẽ
            debug_circles.append((col, best[0], *best[2]))

    return result, debug_circles


def draw_debug_circles_on_roi(roi_color, debug_circles):
    """
    Vẽ các hình tròn đã được chọn lên ảnh ROI để debug.

    Args:
        roi_color (ndarray): Ảnh màu của ROI.
        debug_circles (list): Danh sách các hình tròn (col, row, x, y, r).

    Returns:
        ndarray: Ảnh debug đã được vẽ.
    """
    debug_img = roi_color.copy()
    for col, row, x, y, r in debug_circles:
        cv2.circle(debug_img, (x, y), r, (0, 0, 255), 2)
        cv2.putText(debug_img, str(row), (x - 10, y + 5),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 0), 2)
    return debug_img


def processStudentId(img, roi = configPaper['STUDENTID_BOUND'], binary_thresh=150, debug = False):
    # print(configPaper["STUDENTID_BOUND"])
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

    digits, debug_circles = find_darkest_circle_per_column(roi_gray, binary_thresh=binary_thresh)
    if(debug):
        debug_img = draw_debug_circles_on_roi(roi_color, debug_circles)
        return digits, debug_img
    return digits


if __name__ == "__main__":
    image_path = "../images/aligned.jpg"
    roi_coordinates = configPaper['STUDENTID_BOUND']  # Thay thế bằng tọa độ ROI của bạn

    # Bạn có thể điều chỉnh giá trị binary_thresh để cải thiện khả năng nhận diện hình tròn tô đậm.
    digits, debug_img = process_matrix_image(image_path, roi_coordinates, binary_thresh=150)

    print("Giá trị nhận dạng (6 cột):", digits)

    if debug_img is not None:
        cv2.imshow("Debug ROI", debug_img)
        cv2.waitKey(0)
        cv2.destroyAllWindows()
        cv2.imwrite("debug_roi.jpg", debug_img)
        print("Ảnh debug đã được lưu thành debug_roi.jpg")
