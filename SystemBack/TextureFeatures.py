# Copyright © 2019-2023. All rights reserved.
# Authors: Vitalii Babenko
# Contacts: vbabenko2191@gmail.com

import FeaturesStack as FS
from pandas import DataFrame
from numpy import concatenate
from os.path import join
from json import load


def glcm_features(image_features, glcm, glcm_type, f2_index, f4_index, f5_index, cropped_pairs):
    glcm = DataFrame(glcm, columns=['x', 'y', 'z'])
    image_features = FS.get_glcm_features(image_features, glcm_type, glcm, f2_index, f4_index, f5_index)
    image_features = FS.get_cropped_pairs(image_features, glcm_type, glcm, cropped_pairs)
    return image_features


def glrlm_features(image_features, glrlm, glrlm_type, cropped_runs, max_len=5):
    glrlm = DataFrame(glrlm)
    glrlm = glrlm.loc[(glrlm != 0).any(axis=1)]
    image_features = FS.get_diffs(image_features, glrlm_type, glrlm)
    for i in range(max_len):
        image_features = FS.get_dis_features(image_features, glrlm[i], glrlm_type + 'glrlm' + str(i + 1) + 'l')
    image_features = FS.get_cropped_runs(image_features, glrlm_type, glrlm, cropped_runs)
    return image_features


def get_all_features(task, texture_matrices):
    with open('D:\\programs\\gits\\Liver\\test_liver\\SystemBack\\Settings\\'+ task + '.json') as f:
        settings = load(f)
    init_gm = texture_matrices['gm']
    glcm0, glcm90 = texture_matrices['glcm0'], texture_matrices['glcm90']
    glrlm0, glrlm90 = texture_matrices['glrlm0'], texture_matrices['glrlm90']
    gm = concatenate(init_gm, axis=None)
    image_features = {}
    image_features = FS.get_wp(image_features, gm, settings['gm_diff_indices'])
    image_features = FS.get_ex_grads(image_features, gm)
    image_features = FS.get_dis_features(image_features, gm, 'gm')
    image_features = FS.get_cropped_shades(image_features, gm, settings['gm_shades'])

    # glcms

    ## hor glcm (0 degree)
    image_features = glcm_features(image_features, glcm0, 'hor',
                                   settings['glcm0_f2_index'],
                                   settings['glcm0_f4_index'],
                                   settings['glcm0_f5_index'],
                                   settings['glcm0_pairs'])  # ,best_pairs)
    ## vert glcm (90 degree)
    image_features = glcm_features(image_features, glcm90, 'vert',
                                   settings['glcm90_f2_index'],
                                   settings['glcm90_f4_index'],
                                   settings['glcm90_f5_index'],
                                   settings['glcm90_pairs'])  # ,best_pairs)

    # glrlms
    ## hor glrlm (0 degree)
    image_features = glrlm_features(image_features, glrlm0, 'hor', settings['glrlm0_runs'])
    ## vert glrlm (90 degree)
    image_features = glrlm_features(image_features, glrlm90, 'vert', settings['glrlm90_runs'])

    with open("D:\\programs\\gits\\Liver\\test_liver\\SystemBack\\SelectedFeatures\\"+ task+ '.json') as f:
        selected = load(f)

    data, row = [], []
    for s in selected['features']:
        row.append(image_features[s])

    data.append(row)
    return data
