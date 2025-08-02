import os
import re
import pickle
import jieba
import numpy as np
import pandas as pd
from tqdm import tqdm
from gensim.models import Word2Vec
from sklearn.decomposition import PCA
from sklearn import svm, metrics
from sklearn.model_selection import train_test_split

# ====================== 全局路径配置 ======================
BASE_DIR = "C:\sourcecode\datasets\ChnSentiCorp"
DATA_DIR = os.path.join(BASE_DIR, "ChnSentiCorp/")
STOPWORDS_PATH = os.path.join(BASE_DIR, "scu_stopwords.txt")

# 确保目录存在
os.makedirs(DATA_DIR, exist_ok=True)


# ====================== 数据预处理函数 ======================
def clean_text(text):
    """清理文本，只保留中文"""
    text = re.sub(r'[^\u4e00-\u9fa5]', '', text)
    return text.strip()


def get_stopwords():
    """加载停用词表"""
    with open(STOPWORDS_PATH, 'r', encoding='utf8') as f:
        return set(f.read().strip().split('\n'))


def tokenize(text, stopwords):
    """分词并去除停用词"""
    words = [word for word in jieba.cut(text) if word not in stopwords]
    return words


def load_and_process(file_path, stopwords):
    """加载并处理数据"""
    with open(file_path, 'rb') as f:
        contents = pickle.load(f)
    return [tokenize(clean_text(text), stopwords) for text in tqdm(contents)]


# ====================== 主程序 ======================
if __name__ == "__main__":
    print("=" * 50)
    print("开始情感分析流程...")

    # 步骤1: 数据预处理
    print("\n[步骤1] 加载停用词并处理数据...")
    try:
        stopwords = get_stopwords()
        print(f"加载停用词表，包含 {len(stopwords)} 个停用词")

        # 处理负面和正面数据
        neg_data = load_and_process(os.path.join(DATA_DIR, "neg.pickle"), stopwords)
        pos_data = load_and_process(os.path.join(DATA_DIR, "pos.pickle"), stopwords)
        print(f"处理完成: 负面样本 {len(neg_data)} 条, 正面样本 {len(pos_data)} 条")

    except Exception as e:
        print(f"数据处理错误: {e}")
        exit(1)

    # 步骤2: 训练Word2Vec词向量模型
    print("\n[步骤2] 训练Word2Vec模型...")
    try:
        corpus = neg_data + pos_data
        w2v_model = Word2Vec(
            sentences=corpus,
            vector_size=100,  # 减小向量维度以加速处理
            window=5,
            min_count=1,
            workers=4,
            epochs=5  # 减少训练轮数
        )
        print(f"词向量模型训练完成! 词汇表大小: {len(w2v_model.wv)}")

    except Exception as e:
        print(f"训练词向量模型时出错: {e}")
        exit(1)

    # 步骤3: 构建句子向量
    print("\n[步骤3] 构建句子向量...")
    try:
        # 构建句子向量（词向量的平均值）
        def build_sentence_vec(words):
            vecs = [w2v_model.wv[word] for word in words if word in w2v_model.wv]
            return np.mean(vecs, axis=0) if vecs else np.zeros(w2v_model.vector_size)


        neg_vecs = [build_sentence_vec(words) for words in tqdm(neg_data)]
        pos_vecs = [build_sentence_vec(words) for words in tqdm(pos_data)]

        # 创建数据集
        X = np.array(neg_vecs + pos_vecs)
        y = np.array([0] * len(neg_vecs) + [1] * len(pos_vecs))

        print(f"向量化数据完成: 总样本数 {len(X)}")

    except Exception as e:
        print(f"构建句子向量时出错: {e}")
        exit(1)

    # 步骤4: 降维与分类
    print("\n[步骤4] 降维与分类...")
    try:
        # 使用PCA降维到50维（进一步简化）
        pca = PCA(n_components=50)
        X_pca = pca.fit_transform(X)
        print(f"降维完成: {X.shape[1]}维 -> {X_pca.shape[1]}维")

        # 划分训练集和测试集
        X_train, X_test, y_train, y_test = train_test_split(
            X_pca, y, test_size=0.2, random_state=42
        )

        # 使用线性SVM（更快且效果通常不错）
        print("\n训练SVM分类器...")
        svc = svm.SVC(kernel='linear', C=1.0)
        svc.fit(X_train, y_train)

        # 评估模型
        y_pred = svc.predict(X_test)
        accuracy = metrics.accuracy_score(y_test, y_pred)
        report = metrics.classification_report(y_test, y_pred)

        print("\n" + "=" * 50)
        print(f"测试集准确率: {accuracy:.4f}")
        print("分类报告:")
        print(report)
        print("=" * 50)

        # 保存模型
        model_path = os.path.join(DATA_DIR, 'sentiment_model.pkl')
        with open(model_path, 'wb') as f:
            pickle.dump(svc, f)
        print(f"模型已保存至: {model_path}")

    except Exception as e:
        print(f"分类过程中出错: {e}")
        exit(1)

    print("\n情感分析流程完成!")
