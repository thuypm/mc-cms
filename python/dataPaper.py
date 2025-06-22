
import json
import os

# Lấy đường dẫn tuyệt đối của file Python hiện tại
base_dir = os.path.dirname(os.path.abspath(__file__))

# Ghép với tên file JSON
json_path = os.path.join(base_dir, 'dataPaper.json')

configPaper = {
    "STUDENTID_BOUND": [],
    "KEY_BOUND": [],
    "PARTONE_BOUND": [],
    "PARTTWO_BOUND": [],
    "PARTTHREE_BOUND": []
}


def updateDataPaper():
    data = {}
    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    # get studentId bound
    configPaper['STUDENTID_BOUND'] =[ *data['studentId'][0]["0"]["topLeft"],  *data['studentId'][len(data['studentId'])-1]["9"]["bottomRight"]]
    configPaper['KEY_BOUND'] = [ *data['key'][0]["0"]["topLeft"],  *data['key'][len(data['key'])-1]["9"]["bottomRight"]]
    # partOne
    for i in range(0, 4):
        partOnePart = [*data['partOne'][i * 10]["A"]["topLeft"],  *data['partOne'][i*10+9]["D"]["bottomRight"]]
        configPaper['PARTONE_BOUND'].append(partOnePart)
    # partTwo
    for i in range(0, 8):
        partTwoPart = [*data['partTwo'][i*4]["D"]["topLeft"],  *data['partTwo'][i*4+3]["S"]["bottomRight"]]
        configPaper['PARTTWO_BOUND'].append(partTwoPart)
     # partThree
    for i in range(0, 6):
        partThree = [*data['partThree'][i][0]["-"]["topLeft"],  *data['partThree'][i][3]["9"]["bottomRight"]]
        configPaper['PARTTHREE_BOUND'].append(partThree)
    
    
# updateDataPaper()
# print( json.dumps(configPaper))