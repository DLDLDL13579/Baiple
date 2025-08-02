import pandas as pd
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
import matplotlib.pyplot as plt

# 1. 读取 CSV 文件
dataset = pd.read_csv(r"C:\sourcecode\datasets\wholesale_customers\Wholesale_customers.csv")
# 选择用于聚类的特征列（排除CHANNEL和REGION）
X = dataset[['Fresh', 'Milk', 'Grocery', 'Frozen', 'Detergents_Paper', 'Delicassen']]

# 数据标准化
scaler = StandardScaler()
X_scaled  = scaler.fit_transform(X)
 
# 使用KMeans进行聚类
# 这里假设聚类数为3，但实际应用中可能需要通过肘部法等方法来确定最佳聚类数
kmeans = KMeans(n_clusters=3, random_state=42)
kmeans.fit(X_scaled)

# 获取聚类结果
cluster_labels = kmeans.labels_

# 可视化聚类结果（选择前两个特征进行可视化）
plt.figure(figsize=(8, 6))
plt.scatter(X_scaled[:, 0], X_scaled[:, 1], c=cluster_labels, cmap='viridis', marker='o', edgecolor='k', s=50)

# 标记聚类中心
centers = kmeans.cluster_centers_
plt.scatter(centers[:, 0], centers[:, 1], c='red', s=200, alpha=0.75, marker='X', label='Centroids')

plt.xlabel('Feature 1 (e.g., FRESH)')
plt.ylabel('Feature 2 (e.g., MILK)')
plt.title('K-Means Clustering on wholesale_customers Dataset')
plt.legend()
plt.grid(True)
plt.savefig('output.png')
