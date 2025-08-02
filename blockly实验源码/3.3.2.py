import pandas as pd
from sklearn.decomposition import PCA
from sklearn.datasets import load_linnerud
import matplotlib.pyplot as plt

# 加载内置数据集Linnerud
dataset = load_linnerud()

# 提取特征和目标变量
X = dataset.data# 前三列是运动变量（Chins、Situps和Jumps），在实际应用中，需要根据问题的具体需求来选择特征
y = dataset.target# 后三列是生理测量变量，对于PCA，通常只关心特征矩阵X
# 注意：在实际应用中，你可能需要根据问题的具体需求来选择特征

# 标准化特征（PCA对特征的尺度敏感）
from sklearn.preprocessing import StandardScaler
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# 应用PCA降维
pca = PCA(n_components=2)  # 将数据降维到2维
X_pca = pca.fit_transform(X_scaled)
# 可视化降维后的数据
plt.scatter(X_pca[:, 0], X_pca[:, 1])
plt.xlabel('Principal Component 1')
plt.ylabel('Principal Component 2')
plt.title('PCA of Linnerud Dataset (2D projection)')
plt.savefig('output.png')

# 输出PCA结果
print("主成分方差解释率:", pca.explained_variance_ratio_)
print("主成分:", pca.components_)


