import cv2
import numpy as np
import json
import sys
from itertools import combinations
import matplotlib.pyplot as plt

def show_image(img, title="Image", max_width=1000):
    """Hiển thị ảnh với kích thước tối đa cho phép"""
    h, w = img.shape[:2]
    scale = min(max_width / w, 1.0)
    resized = cv2.resize(img, (int(w * scale), int(h * scale)))
    rgb = cv2.cvtColor(resized, cv2.COLOR_BGR2RGB)
    plt.figure(figsize=(8, 6))
    plt.imshow(rgb)
    plt.title(title)
    plt.axis("off")
    plt.show()

def preprocess_for_marker_detection(image):
    """
    Chuyển ảnh sang nhị phân để phát hiện marker.
    Sử dụng GaussianBlur và OTSU thresholding để tăng độ ổn định.
    """
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    blur = cv2.GaussianBlur(gray, (5, 5), 0)
    _, binary = cv2.threshold(blur, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)
    return binary

def find_marker_candidates(binary_img, min_area=200, max_area=3000):
    """
    Tìm các contour có hình dạng gần giống hình vuông (4 đỉnh và convex)
    với diện tích nằm trong [min_area, max_area].
    """
    contours, _ = cv2.findContours(binary_img, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    candidates = []
    for cnt in contours:
        area = cv2.contourArea(cnt)
        if area < min_area or area > max_area:
            continue
        peri = cv2.arcLength(cnt, True)
        # Điều chỉnh khoảng sai số nếu cần
        approx = cv2.approxPolyDP(cnt, 0.05 * peri, True)
        if len(approx) == 4 and cv2.isContourConvex(approx):
            candidates.append(approx)
    return candidates

def extract_marker_centers(candidates):
    """Lấy tâm (x,y) của các contour candidate"""
    centers = []
    for cnt in candidates:
        M = cv2.moments(cnt)
        if M["m00"] == 0:
            continue
        cx = int(M["m10"] / M["m00"])
        cy = int(M["m01"] / M["m00"])
        centers.append((cx, cy))
    return centers

def sort_corners(corner_points):
    """
    Sắp xếp 4 điểm theo thứ tự:
      - Top-left, top-right, bottom-right, bottom-left.
    Giải thuật: dựa trên tổng tọa độ và hiệu tọa độ.
    """
    pts = np.array(corner_points, dtype="float32")
    s = pts.sum(axis=1)
    diff = np.diff(pts, axis=1)
    
    ordered = np.zeros((4, 2), dtype="float32")
    ordered[0] = pts[np.argmin(s)]        # Top-left có tổng nhỏ nhất
    ordered[2] = pts[np.argmax(s)]        # Bottom-right có tổng lớn nhất
    ordered[1] = pts[np.argmin(diff)]     # Top-right có hiệu nhỏ nhất
    ordered[3] = pts[np.argmax(diff)]     # Bottom-left có hiệu lớn nhất
    return ordered

def warp_from_corners(image, corners, output_size=(1000, 1500)):
    """
    Áp dụng phép biến đổi phối cảnh dựa trên 4 góc đã sắp xếp.
    output_size: kích thước ảnh đầu ra (width, height)
    """
    dst = np.array([
        [0, 0],
        [output_size[0]-1, 0],
        [output_size[0]-1, output_size[1]-1],
        [0, output_size[1]-1]
    ], dtype="float32")
    matrix = cv2.getPerspectiveTransform(corners, dst)
    warped = cv2.warpPerspective(image, matrix, output_size)
    return warped

def cropAndRotate(img, output_path):
    # Đọc ảnh
    if img is None:
        print(json.dumps({"error": "Không đọc được ảnh từ đường dẫn"}))
        return

    # Tạo bản nhị phân để phát hiện marker
    binary_img = preprocess_for_marker_detection(img)

    # Tìm các candidate marker
    candidates = find_marker_candidates(binary_img)

    # Debug: hiển thị các candidate marker
    debug_img = img.copy()
    for approx in candidates:
        cv2.drawContours(debug_img, [approx], -1, (0, 255, 0), 2)
    # Uncomment dòng dưới để xem ảnh debug (nếu chạy môi trường hỗ trợ hiển thị)
    # show_image(debug_img, "Detected Marker Candidates")
    
    # Lấy tâm của các marker
    centers = extract_marker_centers(candidates)
    
    # Nếu số lượng marker phát hiện không đủ, thông báo lỗi
    if len(centers) < 4:
        print(json.dumps({"error": f"Không tìm đủ marker. (Tìm được: {len(centers)})"}))
        return

    # Lọc ra 4 marker ở 4 góc bằng cách chọn nhóm 4 điểm có tổng khoảng cách cặp điểm lớn nhất
    max_dist = 0
    best_combo = None
    for combo in combinations(centers, 4):
        dist = sum(np.linalg.norm(np.array(p1) - np.array(p2)) for p1, p2 in combinations(combo, 2))
        if dist > max_dist:
            max_dist = dist
            best_combo = combo
    
    if best_combo is None:
        print(json.dumps({"error": "Không lọc được 4 marker ổn định"}))
        return
    
    # Sắp xếp lại 4 góc theo thứ tự chuẩn: top-left, top-right, bottom-right, bottom-left
    ordered_corners = sort_corners(best_combo)
    
    # Debug: hiển thị vị trí 4 marker đã sắp xếp
    debug_markers = img.copy()
    for idx, (x, y) in enumerate(ordered_corners):
        cv2.circle(debug_markers, (int(x), int(y)), 8, (0, 0, 255), -1)
        cv2.putText(debug_markers, f"{idx}", (int(x)+10, int(y)+10),
                    cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 0, 0), 2)
    # show_image(debug_markers, "Ordered Marker Corners")
    
    # Áp dụng warp perspective để căn chỉnh ảnh
    warped = warp_from_corners(img, ordered_corners)
    
    # Lưu ảnh đã căn chỉnh
    cv2.imwrite(output_path, warped)
    # print(json.dumps({"status": "ok", "aligned": output_path}))

if __name__ == '__main__':
    if len(sys.argv) < 3:
        print("Usage: python align_image.py <input_image> <output_image>")
        sys.exit(1)
    image_path = sys.argv[1]
    output_path = sys.argv[2]
    cropAndRotate(image_path, output_path)
