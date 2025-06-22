import fitz  # PyMuPDF
from processImage import processImage
from pymongo import MongoClient
import sys
from bson.objectid import ObjectId
from dataPaper import updateDataPaper
import traceback

client = MongoClient("mongodb://localhost:27017/")
db = client["exam"]
assignmentCollection = db["assignments"]
answerCollection = db["answers"]
examCollection = db["exams"]


def cast_array_to_string(array=[]):
    result = ""
    for item in array:
        if isinstance(item, list):
            if len(item) == 1:
                result += str(item[0])
            elif len(item) == 0:
                result += "_"
            elif len(item) > 1:
                result += "?"
        else:
            result += "?"  # hoặc bỏ qua tùy bạn
    return result


def scoreAssignment(item, examId):
    key = cast_array_to_string(item.get("key", []))
    if not key:
        return None

    # Tìm answer trong DB
    answer = answerCollection.find_one({
        "key": key,
        "examId": ObjectId(examId)
    })

    exam = examCollection.find_one({
        "_id": ObjectId(examId)
    })

    if not answer:
        return None

    result = {
        "partOne": 0,
        "partTwo": 0,
        "partThree": 0
    }

    # Đối chiếu từng phần
    for part in ["partOne", "partThree"]:
        student_part = item.get(part, [])
        answer_part = answer.get(part, [])

        count = 0
        for i in range(min(len(student_part), len(answer_part))):
            student_ans = student_part[i]
            correct_ans = answer_part[i]

            # Chỉ xét nếu học sinh chọn 1 đáp án và đáp án đúng cũng có 1 lựa chọn
            if isinstance(student_ans, list) and len(student_ans) == 1:
                if student_ans[0] in correct_ans:
                    count += 1

        result[part] = count
    student_part = item.get("partTwo", [])
    answer_part = answer.get("partTwo", [])

    group_scores = []
    for i in range(0, min(len(student_part), len(answer_part)), 4):
        group_correct = 0
        for j in range(4):
            idx = i + j
            if idx >= len(student_part) or idx >= len(answer_part):
                continue
            s = student_part[idx]
            a = answer_part[idx]
            if isinstance(s, list) and len(s) == 1 and isinstance(a, list):
                if s[0] in a:
                    group_correct += 1
        group_scores.append(group_correct)

    result["partTwo"] = group_scores
    totalScore = result["partOne"] * exam["scorePartOne"] + \
        result["partThree"] * exam["scorePartThree"]
    for cnt in result["partTwo"]:
        totalScore += exam["scorePartTwo"][cnt - 1] if cnt > 0 else 0
    return totalScore


def handlePdfFile(filePath, currentExamId):
    updateDataPaper()
    doc = fitz.open(filePath)
    for i, page in enumerate(doc):
        try:
            _id = ObjectId()
            stringId = str(_id)
            pix = page.get_pixmap(dpi=200)  # có thể chỉnh dpi (100–300)
            data = processImage(pix, stringId, currentExamId)
            data["_id"] = _id
            data["imgName"] = currentExamId + '/' + stringId + ".jpg"
            data["examId"] = ObjectId(currentExamId)
            # data["exactStudentId"] = cast_array_to_string(data["studentId"])
            # data["exactKey"] = cast_array_to_string(data["key"])
            # data["score"] = scoreAssignment(data, currentExamId)
            assignmentCollection.insert_one(data)
            # print(i)
        except Exception as e:
            print(e)


            # traceback.print_exc()
            # assignmentCollection.insert_one({})
if __name__ == '__main__':
    currentExamId = sys.argv[2]
    filePath = sys.argv[1]
    handlePdfFile(filePath, currentExamId)
