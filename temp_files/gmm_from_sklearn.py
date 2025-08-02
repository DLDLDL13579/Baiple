#导入模型与库
from utils import *
from sklearn.mixture import GaussianMixture
import os
import numpy as np
import warnings
import librosa
#MFCC特征提取
def mfcc(wav_path, delta=2):
    y, sr = librosa.load(wav_path)
    mfcc_feat = librosa.feature.mfcc(y = y, sr = sr, n_mfcc = 13)
    ans = [mfcc_feat]
    if delta >= 1:
        mfcc_delta1 = librosa.feature.delta(mfcc_feat, order = 1, mode ='nearest')
        ans.append(mfcc_delta1)
    if delta >= 2:
        mfcc_delta2 = librosa.feature.delta(mfcc_feat, order = 2, mode ='nearest')
        ans.append(mfcc_delta2)

    return np.transpose(np.concatenate(ans, axis = 0),[1,0])
def get_mfcc_data(train_dir):
    mfcc_data = []
    for i in range(10):
        digit_mfcc = np.array([])
        digit = str(i)
        digit_dir = os.path.join(train_dir, 'digit_' + digit)
        train_files = [x for x in os.listdir(digit_dir) if x.endswith('.wav')]
        for file_name in train_files:
            file_path = os.path.join(digit_dir, file_name)
            with warnings.catch_warnings():
                warnings.simplefilter('ignore')
                features_mfcc = mfcc(file_path)
            if len(digit_mfcc) == 0:
                digit_mfcc = features_mfcc
            else:
                digit_mfcc = np.append(digit_mfcc, features_mfcc, axis=0)
        mfcc_data.append(digit_mfcc)

    return mfcc_data
def log_gaussian_prob(x, means, var):
    return (-0.5 * np.log(var) - np.divide(np.square(x - means), 2 * var) - 0.5 * np.log(2 * np.pi)).sum()
#GMM模型训练
def train_model_gmm(train_dir):
    gmm_models = []
    for digit in os.listdir(train_dir):
        digit_dir = os.path.join(train_dir, digit)
        label = digit_dir[digit_dir.rfind('/') + 1:]
        X = np.array([])
        train_files = [x for x in os.listdir(digit_dir) if x.endswith('.wav')]
        for file_name in train_files:
            file_path = os.path.join(digit_dir, file_name)
            with warnings.catch_warnings():
                warnings.simplefilter('ignore')
                features_mfcc = mfcc(file_path)
            if len(X) == 0:
                X = features_mfcc
            else:
                X = np.append(X, features_mfcc, axis=0)

        model = GaussianMixture(n_components=2, covariance_type='diag')
        np.seterr(all='ignore')
        model.fit(X)
        gmm_models.append((model, label))
    return gmm_models
#GMM模型预测结果
def predict_gmm(gmm_models, test_files):
    count = 0
    pred_true = 0
    for test_file in test_files:
        with warnings.catch_warnings():
            warnings.simplefilter('ignore')
            features_mfcc = mfcc(test_file)
        max_score = -float('inf')
        predicted_label = ""
        for item in gmm_models:
            model, label = item
            score = model.score(features_mfcc)
            if score > max_score:
                max_score = score
                predicted_label = label
        # 提取真实标签和预测标签的数字部分
        true_label = os.path.splitext(test_file)[0][-1]
        pred_digit = predicted_label[-1]
        filename = os.path.basename(test_file)
        # 输出单条识别结果
        print(f"文件: {filename}, 真实结果: {true_label}, 预测结果: {pred_digit}")
        count += 1
        if os.path.splitext(test_file)[0][-1] == predicted_label[-1]:
            pred_true += 1
    print("---------- GMM (GaussianMixture) ----------")
    print("Train num: 160, Test num: %d, Predict true num: %d"%(count, pred_true))
    print("Accuracy: %.2f"%(pred_true / count))
if __name__ == '__main__':
    gmm_models = train_model_gmm("./processed_train_records")
    test_files = []
    for root, dirs, files in os.walk("./processed_test_records"):
        for file in files:
            if os.path.splitext(file)[1] == '.wav':
                test_files.append(os.path.join(root, file))
    predict_gmm(gmm_models, test_files)

