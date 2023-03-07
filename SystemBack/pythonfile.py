# Copyright © 2020-2023. All rights reserved.
# Authors: Vitalii Babenko
# Contacts: vbabenko2191@gmail.com

from sys import argv
from FindLiverClass import get_classification_results
from json import dumps
import os

if __name__ == '__main__':
    # Input arguments
    filename = argv[1] #'Images/Stage 1/0087_r1p_1.png'  # link = argv[1]
    # Task type: 1 - norma vs pathology, 2 - fibrosis stages multi-classification
    task_type = argv[2]

    res = get_classification_results(filename, task_type)

    print(dumps(res))
