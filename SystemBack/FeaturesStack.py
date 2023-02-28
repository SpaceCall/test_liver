# Copyright © 2019-2023. All rights reserved.
# Authors: Vitalii Babenko, Vladyslav Kruhlyi
# Contacts: vbabenko2191@gmail.com

from numpy import where, isin, sum, amin, amax, mean, std, median, percentile, argmax
from scipy.stats import kurtosis as kurt
from scipy.stats import median_abs_deviation as mad
from scipy.stats import skew, entropy

"""
====================================
Features from Vitya Babenko
====================================
"""


# White percentage after binarization
def get_wp(image_features, gm, diff_indices):
    bin_gm = where(isin(gm, diff_indices), 255, 0)
    image_features['gm_wp'] = sum(bin_gm == 255) / bin_gm.size
    return image_features


# GM grads of extremes frequency
def get_ex_grads(image_features, gm):
    image_features['gm_minfreq'] = (sum(gm == amin(gm)) / gm.size) * 100
    image_features['gm_maxfreq'] = (sum(gm == amax(gm)) / gm.size) * 100
    return image_features


# Greyscale distribution characteristics
def get_dis_features(image_features, matrix, matrix_type):
    if sum(matrix > 0):
        f_mean = mean(matrix)
        image_features[matrix_type + '_mean'] = f_mean
        f_std = std(matrix)  # Standard Deviation
        image_features[matrix_type + '_std'] = f_std

        # Coefficient of Variation
        if f_mean > 0:
            image_features[matrix_type + '_cov'] = f_std / f_mean
        else:
            image_features[matrix_type + '_cov'] = 0

        image_features[matrix_type + '_skew'] = skew(matrix)  # Skewness
        image_features[matrix_type + '_kurt'] = kurt(matrix)  # Kurtosis
        image_features[matrix_type + '_range'] = amax(matrix) - amin(matrix)
        image_features[matrix_type + '_median'] = median(matrix)
        q1 = percentile(matrix, 25, interpolation='midpoint')
        image_features[matrix_type + '_q1'] = q1
        q3 = percentile(matrix, 75, interpolation='midpoint')
        image_features[matrix_type + '_q3'] = q3
        image_features[matrix_type + '_p5'] = percentile(matrix, 5, interpolation='midpoint')
        image_features[matrix_type + '_p95'] = percentile(matrix, 95, interpolation='midpoint')
        image_features[matrix_type + '_iqr'] = q3 - q1  # Intra-Quartile Range
        image_features[matrix_type + '_mad'] = mad(matrix)  # Mean Absolute Deviation
        image_features[matrix_type + '_entropy'] = entropy(matrix)
        image_features[matrix_type + '_energy'] = mean(matrix ** 2)
    else:
        image_features[matrix_type + '_mean'] = 0
        image_features[matrix_type + '_std'] = 0
        image_features[matrix_type + '_cov'] = 0
        image_features[matrix_type + '_skew'] = 0
        image_features[matrix_type + '_kurt'] = 0
        image_features[matrix_type + '_range'] = 0
        image_features[matrix_type + '_median'] = 0
        image_features[matrix_type + '_q1'] = 0
        image_features[matrix_type + '_q3'] = 0
        image_features[matrix_type + '_p5'] = 0
        image_features[matrix_type + '_p95'] = 0
        image_features[matrix_type + '_iqr'] = 0
        image_features[matrix_type + '_mad'] = 0
        image_features[matrix_type + '_entropy'] = 0
        image_features[matrix_type + '_energy'] = 0
    return image_features


# Differences between amplitudes of modes
def get_diffs(image_features, glrlm_type, glrlm):
    image_features[glrlm_type + 'glrlm_diff12'] = amax(glrlm[0]) - amax(glrlm[1])
    image_features[glrlm_type + 'glrlm_diff13'] = amax(glrlm[0]) - amax(glrlm[2])
    image_features[glrlm_type + 'glrlm_diff14'] = amax(glrlm[0]) - amax(glrlm[3])
    image_features[glrlm_type + 'glrlm_diff15'] = amax(glrlm[0]) - amax(glrlm[4])
    image_features[glrlm_type + 'glrlm_diff23'] = amax(glrlm[1]) - amax(glrlm[2])
    image_features[glrlm_type + 'glrlm_diff24'] = amax(glrlm[1]) - amax(glrlm[3])
    image_features[glrlm_type + 'glrlm_diff25'] = amax(glrlm[1]) - amax(glrlm[4])
    image_features[glrlm_type + 'glrlm_diff34'] = amax(glrlm[2]) - amax(glrlm[3])
    image_features[glrlm_type + 'glrlm_diff35'] = amax(glrlm[2]) - amax(glrlm[4])
    image_features[glrlm_type + 'glrlm_diff45'] = amax(glrlm[3]) - amax(glrlm[4])
    return image_features


"""
============================
GLCM features (Vlad Kruhlyi)
============================
"""


def get_glcm_features(image_features, glcm_type, glcm, best_grad, best_d, best_p):
    max_index = argmax(glcm['z'].values)
    image_features[glcm_type + 'glcm_f1'] = glcm.at[max_index, 'x'] * glcm.at[max_index, 'y']
    image_features[glcm_type + 'glcm_f2'] = get_grad_freq(glcm.copy(), best_grad)
    image_features[glcm_type + 'glcm_f3'] = amax(glcm['x'].values) * amax(glcm['y'].values)
    image_features[glcm_type + 'glcm_f4'] = get_d_freq(glcm.copy(), best_d)
    image_features[glcm_type + 'glcm_f5'] = get_p_freq(glcm.copy(), best_p)
    return image_features


## Calculate frequency of pair with given grad
def get_grad_freq(glcm, grad):
    if sum(glcm['z']) > 0:
        glcm['z'] = (glcm['z'] / sum(glcm['z'])) * 10000
        grad_from_glcm = glcm[(glcm['x'] == grad)]['z'].tolist()
        if len(grad_from_glcm) > 0:
            return mean(grad_from_glcm)
        else:
            return 0
    else:
        return 0


## Calculate frequency of pair with given diagonal grad
def get_d_freq(glcm, d):
    if sum(glcm['z'].values) > 0:
        glcm_d = glcm[(glcm['x'] == d) & (glcm['y'] == d)]
        return (sum(glcm_d['z'].values) / sum(glcm['z'].values)) * 10000
    else:
        return 0


## Calculate frequency of pair with given diagonal grad
def get_p_freq(glcm, p):
    if sum(glcm['z'].values) > 0:
        glcm_p = glcm[(glcm['x'] == p[0]) & (glcm['y'] == p[1])]
        return (sum(glcm_p['z'].values) / sum(glcm['z'].values)) * 10000
    else:
        return 0


"""
================================================
Optimal ensembles of pixel pairs (Max Honcharuk)
================================================
"""


def get_cropped_shades(image_features, gm, cropped_shades):
    for shade in cropped_shades:
        feature_name = 'gm_s_' + str(shade)
        image_features[feature_name] = (sum(gm == shade) / gm.size) * 100
    return image_features


def get_cropped_pairs(image_features, glcm_type, glcm, cropped_pairs):
    for pair in cropped_pairs:
        f = glcm[((glcm['x'] == pair[0]) & (glcm['y'] == pair[1])) | ((glcm['x'] == pair[1]) & (glcm['y'] == pair[0]))]
        feature_name = glcm_type + 'glcm_p_' + str(pair[0]) + '_' + str(pair[1])
        if sum(glcm['z'].values) > 0:
            image_features[feature_name] = (sum(f['z'].values) / sum(glcm['z'].values)) * 10000
        else:
            image_features[feature_name] = 0
    return image_features


def get_cropped_runs(image_features, glrlm_type, glrlm, cropped_runs):
    for run in cropped_runs:
        feature_name = glrlm_type + 'glrlm_s_' + str(run[0]) + '_l_' + str(run[1] + 1)
        try:
            image_features[feature_name] = glrlm.at[run[0], run[1]] * 100
        except:
            image_features[feature_name] = 0
    return image_features
