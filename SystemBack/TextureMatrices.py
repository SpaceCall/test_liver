# Copyright © 2019-2023. All rights reserved.
# Authors: Vitalii Babenko
# Contacts: vbabenko2191@gmail.com

from cv2 import imread
from numpy import diff, amin, amax, asarray, zeros, sum, copy, reshape
from skimage.feature import graycomatrix
from pandas import DataFrame


def get_greyscale_matrix(filename):
    matrix = imread(filename, 0)
    return matrix.astype(int)


# Difference matrix
def get_diff_matrix(orig_matrix, var):
    # horizontal differentiation
    if var == 'hor':
        diff_matrix = diff(orig_matrix, axis=1)
    # vertical differentiation
    else:
        diff_matrix = diff(orig_matrix, axis=0)
    diff_matrix += abs(amin(diff_matrix))
    diff_matrix[diff_matrix > 255] = 255
    return diff_matrix


# Normed matrix
def get_norm_matrix(orig_matrix):
    norm_matrix = 255 * ((orig_matrix - amin(orig_matrix)) / (amax(orig_matrix) - amin(orig_matrix)))
    return asarray(norm_matrix, int)


# Equalized matrix
def get_eq_matrix(orig_matrix):
    eq_pixels = zeros(256)
    count = 0
    for i in range(256):
        count += sum(orig_matrix == i)
        eq_pixels[i] = (count * 255) / orig_matrix.size
    eq_matrix = copy(orig_matrix)
    for i in range(eq_matrix.shape[0]):
        for j in range(eq_matrix.shape[1]):
            eq_matrix[i, j] = round(eq_pixels[eq_matrix[i, j]], 0)
    return asarray(eq_matrix, int)


# Grey Level Co-Occurrence Matrix
def get_glcm(matrix, angle):
    init_glcm = graycomatrix(matrix, distances=[1], angles=[angle], levels=256, symmetric=True)
    init_glcm = asarray(reshape(init_glcm, (256, 256)), int)
    a_min, a_max = amin(matrix), amax(matrix)
    glcm = []
    for i in range(a_min, a_max + 1):
        for j in range(i, a_max + 1):
            glcm.append([i, j, init_glcm[i, j]])
    glcm = DataFrame(glcm, columns=['x', 'y', 'z'])
    return glcm.sort_values(['x', 'y'])


# Grey Level Run Length Matrix
def get_glrlm(matrix, max_len=5):
    glrlm = asarray(zeros((256, max_len)), int)
    for i in range(matrix.size):
        # len = 1
        glrlm[matrix[i]][0] += 1
        # len = 2
        try:
            if matrix[i] == matrix[i + 1]:
                glrlm[matrix[i]][1] += 1
                glrlm[matrix[i]][0] -= 1
        except:
            continue
        # len = 3
        try:
            if matrix[i] == matrix[i + 1] == matrix[i + 2]:
                glrlm[matrix[i]][2] += 1
                glrlm[matrix[i]][1] -= 1
        except:
            continue
        # len = 4
        try:
            if matrix[i] == matrix[i + 1] == matrix[i + 2] == matrix[i + 3]:
                glrlm[matrix[i]][3] += 1
                glrlm[matrix[i]][2] -= 1
        except:
            continue
        # len = 5
        try:
            if matrix[i] == matrix[i + 1] == matrix[i + 2] == matrix[i + 3] == matrix[i + 4]:
                glrlm[matrix[i]][4] += 1
                glrlm[matrix[i]][3] -= 1
        except:
            continue
    glrlm = glrlm / sum(glrlm)
    return glrlm
