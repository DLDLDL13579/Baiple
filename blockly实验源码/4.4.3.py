# -*- coding: utf-8 -*-
import sys
import io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

import matplotlib as mpl
mpl.use('Agg')
import matplotlib.pyplot as plt

try:
    import tensorflow as tf
    import os
    import numpy as np
    from tensorflow.keras.models import Sequential
    from tensorflow.keras.layers import Input, Conv2D, MaxPooling2D, Flatten, Dense, Dropout
    from tensorflow.keras.models import Model
    from tensorflow.keras.preprocessing.image import ImageDataGenerator
    from tensorflow.keras.optimizers import Adam

    # 从标签文件中加载图片和对应标签
    def load_data(data_dir, label_file, target_size=(224, 224)):
        images = []
        labels = []
        with open(os.path.join(data_dir, label_file), 'r') as f:
            for line in f:
                path, label = line.strip().split(',')
                image_path = os.path.join(data_dir, path)
                image = tf.keras.preprocessing.image.load_img(image_path, target_size=target_size)
                image = tf.keras.preprocessing.image.img_to_array(image)
                images.append(image)
                labels.append(int(label))
        # 将图片数组归一化到 [0, 1]，同时将数据从列表转换为 NumPy 数组
        images = np.array(images, dtype='float32') / 255.0  # 归一化图像
        labels = np.array(labels, dtype='int32')  # 标签转为整数数组
        return images, labels
    # 数据集所在的路径和标签文件
    train_dir = 'C:\sourcecode\datasets\catdog'
    test_dir = 'C:\sourcecode\datasets\catdog'
    train_label_file = 'train.txt'
    test_label_file = 'test.txt'
    # 加载训练和验证数据
    train_images, train_labels = load_data(train_dir, train_label_file)
    test_images, test_labels = load_data(test_dir, test_label_file)
    # 模型结构
    def create_alexnet_model():
        model = Sequential([
            # 第一层卷积层：96个11x11卷积核，步幅为4，激活函数ReLU
            Conv2D(96, kernel_size=(11, 11), strides=(4, 4), activation='relu', input_shape=(224, 224, 3)),
            # 第一层最大池化层：3x3池化核，步幅为2
            MaxPooling2D(pool_size=(3, 3), strides=(2, 2)),
            # 第二层卷积层：256个5x5卷积核，padding设为'same'以保持尺寸
            Conv2D(256, kernel_size=(5, 5), activation='relu', padding='same'),
            # 第二层最大池化层
            MaxPooling2D(pool_size=(3, 3), strides=(2, 2)),
            # 第三、第四、第五层卷积层：分别为384、384、256个3x3卷积核
            Conv2D(384, kernel_size=(3, 3), activation='relu', padding='same'),
            Conv2D(384, kernel_size=(3, 3), activation='relu', padding='same'),
            Conv2D(256, kernel_size=(3, 3), activation='relu', padding='same'),
            # 第三层最大池化层
            MaxPooling2D(pool_size=(3, 3), strides=(2, 2)),
            # 扁平化操作，将多维特征映射为一维
            Flatten(),
            # 全连接层1：4096个神经元
            Dense(4096, activation='relu'),
            # Dropout：防止过拟合
            Dropout(0.5),
            # 全连接层2：4096个神经元
            Dense(4096, activation='relu'),
            Dropout(0.5),
            # 输出层：1 个神经元（用于二分类），激活函数为 sigmoid
            Dense(1, activation='sigmoid')  # 注意这里改为了 1
        ])
        # 编译模型：Adam优化器，使用 binary_crossentropy 作为损失函数
        model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])
        return model



    # 创建模型
    model = create_alexnet_model()
    # 训练模型
    history = model.fit(
        train_images, train_labels,  # 输入训练集的图片和标签
        validation_data=(test_images, test_labels),  # 输入验证集的图片和标签
        epochs=2,  # 训练轮次设置为2轮
        batch_size=32  # 每次训练的小批量大小设置为32
    )
    # 可视化训练过程中的准确率变化 验证与测试
    import matplotlib.pyplot as plt
    plt.plot(history.history['accuracy'], label='Training Accuracy')  # 绘制训练集准确率曲线
    plt.plot(history.history['val_accuracy'], label='Test Accuracy')  # 绘制验证集准确率曲线
    plt.legend()  # 显示图例
    plt.xlabel('Epochs')  # 横坐标名称：训练轮次
    plt.ylabel('Accuracy')  # 纵坐标名称：准确率
    plt.title('Training and Test Accuracy')  # 图表标题
    plt.savefig('output1.png')
    plt.savefig('output.png')

except Exception as e:
    print("执行错误:", str(e))
