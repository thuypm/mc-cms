import cv2
import numpy as np
import json
import sys

def show_image_scaled(window_name, image, max_width=1200, max_height=800):
    h, w = image.shape[:2]
    scale_w = max_width / w
    scale_h = max_height / h
    scale = min(scale_w, scale_h, 1.0)  # Không phóng to quá kích thước gốc

    resized = cv2.resize(image, (int(w * scale), int(h * scale)))
    cv2.imshow(window_name, resized)
    cv2.waitKey(0)
    cv2.destroyAllWindows()
    
def find_corner_markers(image, radius = 160):
    # Chuyển ảnh sang grayscale và áp dụng threshold
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    _, thresh = cv2.threshold(gray, 50, 255, cv2.THRESH_BINARY_INV)
    
    # Tìm contours
    contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    
    # Lấy kích thước ảnh
    height, width = image.shape[:2]
    
    # Định nghĩa 4 vùng góc (bán kính 80px từ mỗi góc)
    corner_regions = [
        (0, 0, radius, radius),                # Top-left
        (width - radius, 0, radius, radius),        # Top-right
        (width - radius, height - radius, radius, radius), # Bottom-right
        (0, height - radius, radius, radius)        # Bottom-left
    ]
    
    # Danh sách lưu các marker tìm được
    markers = []
    
    for c in contours:
        # Tính diện tích contour
        area = cv2.contourArea(c)
        
        # Lọc theo kích thước (24x24 = 576, cho phép sai số)
        if area < 64 or area > 1600:  # Khoảng 17x17 đến 30x30
            continue
        
        # Lấy hình chữ nhật bao quanh
        x, y, w, h = cv2.boundingRect(c)
        # Tính aspect ratio (tỷ lệ w/h)
        aspect_ratio = w / float(h)
        
        # Kiểm tra nếu gần hình chữ nhật (cho phép sai số)
        if not (0.5 < aspect_ratio < 2.0):
            continue
        
        # Tính tâm của hình chữ nhật
        center = (x + w // 2, y + h // 2)
    
          
        # Kiểm tra xem tâm có nằm trong vùng góc nào không
        for i, (cx, cy, cw, ch) in enumerate(corner_regions):
            if (cx <= center[0] <= cx + cw) and (cy <= center[1] <= cy + ch):
                markers.append((i, center))  # Lưu cùng index của vùng góc
                break
        # for i, pt in enumerate(markers):
        #     cv2.circle(image, pt[1], 5, (0, 255, 0), -1)
        #     show_image_scaled("Markers", image)
    # Nếu không tìm đủ 4 marker
    if len(markers) != 4:
        raise ValueError(f"Không tìm thấy đủ 4 marker góc (tìm thấy {len(markers)})")
    
    # Sắp xếp các marker theo thứ tự các góc
    markers.sort()
    result = [marker[1] for marker in markers]
    
    # Kiểm tra lại thứ tự và trả về
    # Thứ tự: top-left, top-right, bottom-right, bottom-left
    if len(result) == 4:
        return result
    else:
        raise ValueError("Sắp xếp các marker không thành công")

def warp_from_corners(image, corners, output_size=(1000, 1414)):
    src = np.array(corners, dtype="float32")
    dst = np.array([
        [0, 0],
        [output_size[0] - 1, 0],
        [output_size[0] - 1, output_size[1] - 1],
        [0, output_size[1] - 1]
    ], dtype="float32")

    matrix = cv2.getPerspectiveTransform(src, dst)
    warped = cv2.warpPerspective(image, matrix, output_size)
    return warped

def main(image_path, output_path):
    img = cv2.imread(image_path)
    try:
        corners = find_corner_markers(img)
        aligned = warp_from_corners(img, corners)
        cv2.imwrite(output_path, aligned)
        # print(json.dumps({"status": "ok", "aligned": output_path}))
    except Exception as e:
        print(json.dumps({"error": str(e)}))

if __name__ == '__main__':
    image_path = sys.argv[1]
    output_path = sys.argv[2]
    # image_path = "../img/test 2.png"  # Đường dẫn ảnh bạn vừa upload
    # output_path = "../images/aligned_result.jpg"
    main(image_path, output_path)
