# Copyright © 2020-2023. All rights reserved.
# Authors: Vitalii Babenko
# Contacts: vbabenko2191@gmail.com

from base64 import b64decode
from TextureMatrices import get_greyscale_matrix, get_eq_matrix, get_glcm, get_glrlm
from numpy import asarray, concatenate
from TextureFeatures import get_all_features
from joblib import load
from os.path import join


# def tree_prediction(tree, img_f):
#     tree = pd.DataFrame(tree)
#     index = 0
#     leaf = 1
#     flag = False
#     y_hat = -1
#     while not flag:
#         node = tree.loc[index]
#         node_X = img_f[node['feature']]
#         if node['side'] == 1:
#             if node_X < node['threshold']:
#                 y_hat = 0
#             else:
#                 y_hat = 1
#         else:
#             if node_X < node['threshold']:
#                 y_hat = 1
#             else:
#                 y_hat = 0
#         try:
#             index = np.where((tree['previous_leaf'] == leaf) & (tree['previous_direction'] == y_hat + 1))[0][0]
#             leaf = tree.loc[index]['leaf_number']
#         except:
#             flag = True
#     return y_hat


# def forest_prediction(sensor_type, img_f):
#     with open(os.path.join('Classifiers/GeneticForests', sensor_type + '.json')) as f:
#         forest = json.load(f)
#     y_proba = 0
#     for obj in forest:
#         tree = obj['tree']
#         y_pred = tree_prediction(tree, img_f)
#         y_proba += y_pred * obj['weight']
#     if y_proba < 0.5:
#         y_hat = 0
#     else:
#         y_hat = 1
#     if y_hat == 0:
#         y_proba = 1 - y_proba
#     return y_proba, y_hat


def get_mean_signs(sensor_type, img_f):
    # if task_type == 1:
    if sensor_type == 'convex':
        feature1, feature2, feature3 = 'gm_wp_eq', 'horglrlm1l_entropy_orig', 'horglrlm2l_cov_eq'
        threshold1, threshold2, threshold3 = 0.558094, 4.181608, 2.276130
        value1, value2, value3 = img_f[feature1], img_f[feature2], img_f[feature3]
        if value1 < threshold1:
            res1 = 'norma'
        else:
            res1 = 'pathology'
        if value2 < threshold2:
            res2 = 'norma'
        else:
            res2 = 'pathology'
        if value3 < threshold3:
            res3 = 'pathology'
        else:
            res3 = 'norma'
    elif sensor_type == 'linear':
        feature1, feature2, feature3 = 'gm_wp_eq', 'horglrlm2l_entropy_eq', 'horglrlm2l_entropy_orig'
        threshold1, threshold2, threshold3 = 0.543821, 3.788145, 3.718229
        value1, value2, value3 = img_f[feature1], img_f[feature2], img_f[feature3]
        if value1 < threshold1:
            res1 = 'norma'
        else:
            res1 = 'pathology'
        if value2 < threshold2:
            res2 = 'norma'
        else:
            res2 = 'pathology'
        if value3 < threshold3:
            res3 = 'pathology'
        else:
            res3 = 'norma'
    elif sensor_type == 'reinforced_linear':
        feature1, feature2, feature3 = 'gm_wp_eq', 'gm_lbp255_eq', 'gm_lbp159_eq'
        threshold1, threshold2, threshold3 = 0.436147, 0.044118, 0.005618
        value1, value2, value3 = img_f[feature1], img_f[feature2], img_f[feature3]
        if value1 < threshold1:
            res1 = 'norma'
        else:
            res1 = 'pathology'
        if value2 < threshold2:
            res2 = 'norma'
        else:
            res2 = 'pathology'
        if value3 < threshold3:
            res3 = 'norma'
        else:
            res3 = 'pathology'
    else:
        feature1, feature2, feature3 = '', '', ''
        threshold1, threshold2, threshold3 = 0, 0, 0
        value1, value2, value3 = 0, 0, 0
        res1, res2, res3 = 0, 0, 0
    # elif task_type == 2:
    #     feature1, feature2, feature3 = '', '', ''
    #     threshold1, threshold2, threshold3 = 0, 0, 0
    #     value1, value2, value3 = 0, 0, 0
    #     res1, res2, res3 = 0, 0, 0
    # else:
    #     feature1, feature2, feature3 = '', '', ''
    #     threshold1, threshold2, threshold3 = 0, 0, 0
    #     value1, value2, value3 = 0, 0, 0
    #     res1, res2, res3 = 0, 0, 0
    # return [{'feature': feature1, 'threshold': threshold1, 'value': value1, 'result': res1},
    #         {'feature': feature2, 'threshold': threshold2, 'value': value2, 'result': res2},
    #         {'feature': feature3, 'threshold': threshold3, 'value': value3, 'result': res3}]
    return [res1, res2, res3]


def get_classification_results(filename, task_type):
    # Getting texture matrices for Feature Engineering
    matrix = get_greyscale_matrix(filename)  # original image
    orig_gm = asarray(matrix, int)  # converted to numpy 2D array
    gm = get_eq_matrix(orig_gm)  # equalization process
    glcm0 = get_glcm(gm, 0).values  # gray-level co-occurrence matrix (0 angle)
    conc_matrix = concatenate(gm, axis=None)  # convert GM from 2-D to 1-D
    glrlm0 = get_glrlm(conc_matrix)  # grey-level run length matrix (0 angle)
    glcm90 = get_glcm(gm, 90)  # gray-level co-occurrence matrix (90 angle)
    conc_matrix = concatenate(gm.T, axis=None)  # transporting matrix
    glrlm90 = get_glrlm(conc_matrix)  # grey-level run length matrix (90 angle)
    texture_matrices = {'gm': gm, 'glcm0': glcm0, 'glcm90': glcm90, 'glrlm0': glrlm0, 'glrlm90': glrlm90}

    if int(task_type) == 1:
        task = 'red'
        image_features = get_all_features(task, texture_matrices)
        gbm = load('D:\\programs\\gits\\Liver\\test_liver\\SystemBack\\Classifiers\\LightGBM\\'+ task + '.pkl')
        y_pred = gbm.predict(image_features)[0]
        y_proba = gbm.predict_proba(image_features)[0][y_pred]
        if y_pred == 0:
            return {'prediction': 'norma',
                    'probability': y_proba}
        else:
            return {'prediction': 'pathology',
                    'probability': y_proba}

    elif int(task_type) == 2:
        tasks = ['red', 'orange', 'yellow', 'green', 'sky', 'blue', 'purple']
        # tasks names
        names = {'red': '0 vs 1-2-3-4',
                 'orange': '0-1 vs 2-3-4',
                 'yellow': '0-1-2 vs 3-4',
                 'green': '0-1-2-3 vs 4',
                 'sky': '1-2 vs 3-4',
                 'blue': '1 vs 2-3-4',
                 'purple': '1-2-3 vs 4'}
        predictions = {'red': ['0', '1-2-3-4'],
                       'orange': ['0-1', '2-3-4'],
                       'yellow': ['0-1-2', '3-4'],
                       'green': ['0-1-2-3', '4'],
                       'sky': ['1-2', '3-4'],
                       'blue': ['1', '2-3-4'],
                       'purple': ['1-2-3', '4']}
        res = []
        for task in tasks:
            image_features = get_all_features(task, texture_matrices)
            gbm = load("D:\\programs\\gits\\Liver\\test_liver\\SystemBack\\Classifiers\\LightGBM\\"+task + '.pkl')
            y_pred = gbm.predict(image_features)[0]
            y_proba = gbm.predict_proba(image_features)[0][y_pred]
            res.append({'task': names[task],
                        'prediction': predictions[task][y_pred],
                        'probability': y_proba})
        return res
    else:
        print('Error')

    # # Генетический лес
    # gf_prob, gf_class = forest_prediction(sensor_type, img_f)
    # gf_result = 'norma' if gf_class == 0 else 'pathology'
    # # Пороги трёх наилучших признаков
    # mean_signs = get_mean_signs(sensor_type, img_f)
    #
    # return {'forest_prediction': gf_result,
    #         'forest_probability': round(gf_prob, 3),
    #         'feature_1': mean_signs[0],
    #         'feature_2': mean_signs[1],
    #         'feature_3': mean_signs[2]}
