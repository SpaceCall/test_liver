# Copyright © 2020-2023. All rights reserved.
# Authors: Vitalii Babenko
# Contacts: vbabenko2191@gmail.com
from FindLiverClass import get_classification_results
# from sys import argv

# from os import listdir, path
# import pandas as pd


if __name__ == '__main__':
    # load_dir = 'Images/u'
    # save_list = []
    # for file in listdir(load_dir):
    # print(file)
    # filename = path.join(load_dir, file)
    filename = 'Images/u/0000_cup_1.png'  # link = argv[1]
    # Task type: 1 - norma vs pathology, 2 - fibrosis stages multi-classification
    task_type = 2  # task_type = argv[2]
    clf = get_classification_results(filename, task_type)
    # row = {'file': file}
    for res in clf:
        print('Task: ', res['task'])
        # row[res['task'] + '_pred'] = res['prediction']
        print('Prediction made by Logistic Regression: ', res['prediction'])
        # row[res['task'] + '_prob'] = res['probability']
        print('Probability of prediction: ', res['probability'])
        # save_list.append(row)

    # save_list = pd.DataFrame(save_list)
    # save_list.to_excel('test.xlsx', index=False)
