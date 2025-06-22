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

def find_marker_candidates(binary_img, min_area=700, max_area=3000):
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

def extract_marker_corners(candidates):
    """Lấy các góc của các marker"""
    corners = []
    for cnt in candidates:
        corners.append(cnt.reshape(4, 2))  # Chuyển đổi mỗi contour thành 4 điểm
    return corners

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

def get_corner(marker_pts, position):
    """Chọn đỉnh từ marker tương ứng với vị trí: TL, TR, BR, BL"""
    marker_pts = np.array(marker_pts)  # Chuyển marker_pts thành numpy array
    s = marker_pts.sum(axis=1)
    diff = np.diff(marker_pts, axis=1)

    if position == 'TL':
        return marker_pts[np.argmin(s)]
    elif position == 'TR':
        return marker_pts[np.argmin(diff)]
    elif position == 'BR':
        return marker_pts[np.argmax(s)]
    elif position == 'BL':
        return marker_pts[np.argmax(diff)]

def warp_from_corners(image, corners, output_size=(1654, 2339)):
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

def cropAndRotate(image_path, output_path):
    # Đọc ảnh
    img = cv2.imread(image_path)
    if img is None:
        print(json.dumps({"error": "Không đọc được ảnh từ đường dẫn"}))
        return

    # Tạo bản nhị phân để phát hiện marker
    binary_img = preprocess_for_marker_detection(img)

    # Tìm các candidate marker
    candidates = find_marker_candidates(binary_img)

    # Nếu số lượng marker phát hiện không đủ, sao chép ảnh gốc vào output
    if len(candidates) < 4:
        cv2.imwrite(output_path, img)
        print(json.dumps({"status": "ok", "aligned": output_path, "message": "Không tìm đủ 4 marker, ảnh gốc đã được lưu."}))
        return

    # Lọc ra 4 marker có khoảng cách tổng lớn nhất
    max_dist = 0
    best_combo = None
    for combo in combinations(candidates, 4):
        centers = [np.mean(cnt.reshape(4, 2), axis=0) for cnt in combo]
        dist = sum(np.linalg.norm(p1 - p2) for p1, p2 in combinations(centers, 2))
        if dist > max_dist:
            max_dist = dist
            best_combo = combo

    if best_combo is None:
        print(json.dumps({"error": "Không lọc được 4 marker ổn định"}))
        return

    # Lấy đỉnh từ best_combo (4 contours x 4 đỉnh) → chọn 1 điểm đại diện mỗi marker
    marker_corners = extract_marker_corners(best_combo)
    
    # Lấy góc theo thứ tự: TL, TR, BR, BL
    ordered_corners = [
        get_corner(marker, 'TL') for marker in marker_corners
    ] + [
        get_corner(marker, 'TR') for marker in marker_corners
    ] + [
        get_corner(marker, 'BR') for marker in marker_corners
    ] + [
        get_corner(marker, 'BL') for marker in marker_corners
    ]
    
    # Sắp xếp lại 4 góc (top-left, top-right, bottom-right, bottom-left)
    ordered_corners = sort_corners(ordered_corners)

    # Đẩy rộng vùng cắt ra khoảng 20px
    ordered_corners += np.array([[-20, -20], [20, -20], [20, 20], [-20, 20]])

    # Áp dụng warp perspective để căn chỉnh ảnh
    warped = warp_from_corners(img, ordered_corners)

    # Xoay ảnh 90 độ theo chiều kim đồng hồ
    rotated = cv2.rotate(warped, cv2.ROTATE_90_CLOCKWISE)

    # Lưu ảnh đã căn chỉnh và xoay
    cv2.imwrite(output_path, rotated)
    # print(json.dumps({"status": "ok", "aligned": output_path}))

# if __name__ == '__main__':
#     if len(sys.argv) < 3:
#         print("Usage: python align_image.py <input_image> <output_image>")
#         sys.exit(1)
#     image_path = sys.argv[1]
#     output_path = sys.argv[2]
#     cropAndRotate(image_path, output_path)
