# Copyright © 2020-2023. All rights reserved.
# Authors: Vitalii Babenko
# Contacts: vbabenko2191@gmail.com

from sys import argv
from base64 import b64decode
from TextureMatrices import get_greyscale_matrix, get_eq_matrix, get_glcm, get_glrlm
from numpy import asarray, concatenate
from FindLiverClass import get_classification_results
from json import dumps
import os

if __name__ == '__main__':
    # Input arguments
    link = argv[1]
    task_type = argv[2]  # task_type: 1 - norma vs pathology, 2 - fibrosis stages multi-classification
    path_to_save = argv[3]

    # Input arguments
    # link = 'Images/Stage 1/0087_r1p_1.png'
    # task_type = 2  # task_type: 1 - norma vs pathology, 2 - fibrosis stages multi-classification
    # path_to_save = ''

    # Getting texture matrices for Feature Engineering
    matrix = get_greyscale_matrix(b64decode(link))  # original image
    orig_gm = asarray(matrix, int)  # converted to numpy 2D array
    gm = get_eq_matrix(orig_gm)  # equalization process
    glcm0 = get_glcm(gm, 0).values  # gray-level co-occurrence matrix (0 angle)
    conc_matrix = concatenate(gm, axis=None)  # convert GM from 2-D to 1-D
    glrlm0 = get_glrlm(conc_matrix)  # grey-level run length matrix (0 angle)
    glcm90 = get_glcm(gm, 90)  # gray-level co-occurrence matrix (90 angle)
    conc_matrix = concatenate(gm.T, axis=None)  # transporting matrix
    glrlm90 = get_glrlm(conc_matrix)  # grey-level run length matrix (90 angle)
    texture_matrices = {'gm': gm, 'glcm0': glcm0, 'glcm90': glcm90, 'glrlm0': glrlm0, 'glrlm90': glrlm90}

    res = get_classification_results(task_type, texture_matrices)

    print(dumps(res))
