# Copyright © 2020-2023. All rights reserved.
# Authors: Vitalii Babenko
# Contacts: vbabenko2191@gmail.com

from sys import argv
from FindLiverClass import get_classification_results

if __name__ == '__main__':
    filename = argv[1]
    # Task type: 1 - norma vs pathology, 2 - fibrosis stages multi-classification
    task_type = argv[2]  # task_type = argv[2]

    clf = get_classification_results(filename, task_type)

