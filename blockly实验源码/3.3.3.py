import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, r2_score

# 1. 读取加州房价离线数据集（CSV 文件）
dataset = pd.read_csv('C:\sourcecode\datasets\california_housing\house.csv')

# 2. 准备特征和目标数据
target_column = 'median_house_value'  # 替换为实际的目标列名'median_house_value'
feature_name = 'latitude'  # 线性回归不需要太多特征，这里是latitude或longitude

X = dataset[[feature_name]]
y = dataset[[target_column]]

# 将数据集拆分为训练集和测试集
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# 创建线性回归模型
model = LinearRegression()

# 训练模型
model.fit(X_train, y_train)

# 进行预测
y_pred = model.predict(X_test)

# 评估模型
mse = mean_squared_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)
print(f'Mean Squared Error: {mse:.2f}')
print(f'R^2 Score: {r2:.2f}')
# 可视化拟合结果
plt.scatter(X_test, y_test, color='blue', label='Actual')
plt.plot(X_test, y_pred, color='red', linewidth=3, label='Predicted')
plt.xlabel(feature_name)
plt.ylabel('MEDV (' + target_column + ')')
plt.title(f'Linear Regression Fit for {feature_name}')
plt.legend()
plt.savefig('output.png')

