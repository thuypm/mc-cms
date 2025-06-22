
import os
import cv2
import sys
import matplotlib.pyplot as plt
from partThree import processPartThree
from rotateandcrop import cropAndRotate
from key import processKey
from partOne import processPartOne
from partTwo import processPartTwo
from studentId import processStudentId
import numpy as np
import cv2
from dataPaper import configPaper


def processImage(imagebitmap, fileId = "/", currentExamId = ''):
    output_dir = 'images/' + currentExamId
    os.makedirs(output_dir, exist_ok=True)  # Tạo nếu chưa có
    output_path = os.path.join(output_dir, fileId + '.jpg')
    img = np.frombuffer(imagebitmap.samples, dtype=np.uint8).reshape((imagebitmap.height, imagebitmap.width, imagebitmap.n))
    if imagebitmap.n == 4:
        img = cv2.cvtColor(img, cv2.COLOR_RGBA2BGR)
    elif imagebitmap.n == 3:
        img = cv2.cvtColor(img, cv2.COLOR_RGB2BGR)
    cropAndRotate(img, output_path)
    imgHandle = cv2.imread(output_path)
    studentId = processStudentId(imgHandle,configPaper['STUDENTID_BOUND'])
    key = processKey(imgHandle, configPaper['KEY_BOUND'])
    partOne = processPartOne(imgHandle)
    partTwo = processPartTwo(imgHandle, )
    partThree = processPartThree(imgHandle, )
    data = {
    "studentId": studentId,
    "key": key,
    }

# Thêm các phần nếu không rỗng
    if partOne:
        data["partOne"] = partOne
    if partTwo:
        data["partTwo"] = partTwo
    if partThree:
        data["partThree"] = partThree
    return data

if __name__ == '__main__':
    if len(sys.argv) < 3:
        print("Usage: python align_image.py <input_image> <output_image>")
        sys.exit(1)
    image_path = sys.argv[1]
    output_path = sys.argv[2]
    cropAndRotate(image_path, output_path)
    imgHandle = cv2.imread(output_path)
    studentId = processStudentId(imgHandle,configPaper['STUDENTID_BOUND'])
    key = processKey(imgHandle, configPaper['KEY_BOUND'])
    partOne = processPartOne(imgHandle, configPaper['PARTONE_BOUND'])
    partTwo = processPartTwo(imgHandle, configPaper['PARTTWO_BOUND'])
    partThree = processPartThree(imgHandle, configPaper['PARTTHREE_BOUND'])
    data = {
    "studentId": studentId,
    "key": key,
    }

# Thêm các phần nếu không rỗng
    if partOne:
        data["partOne"] = partOne
    if partTwo:
        data["partTwo"] = partTwo
    if partThree:
        data["partThree"] = partThree
        print(data)
        