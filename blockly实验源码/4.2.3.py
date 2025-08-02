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
    from tensorflow import keras
    from tensorflow.keras.models import load_model
    from tensorflow.keras import layers, models
    import matplotlib.pyplot as plt
    import numpy as np
    import time

    # 超参数设置
    params = {
        "learning_rate": 0.01,
        "num_epochs": 10,
        "batch_size": 64,
        "train_size": 50000,
        "val_size": 10000,
        "test_size": 10000,
        "hidden_nodes": 128
    }
    physical_devices = tf.config.list_physical_devices('GPU')
    if physical_devices:
        print(f"Number of GPUs available: {len(physical_devices)}")
    else:
            print("No GPU found. Training will be done on CPU.")
    # 下载MNIST数据集并进行预处理
    (x_train, y_train), (x_test, y_test) = keras.datasets.mnist.load_data()
    # 归一化到[-1, 1]
    x_train, x_test = x_train / 127.5 - 1, x_test / 127.5 - 1
    # 重新划分训练集和验证集
    x_val, y_val = x_train[params['train_size']:], y_train[params['train_size']:]
    x_train, y_train = x_train[:params['train_size']], y_train[:params['train_size']]
    # 展平输入数据
    x_train = x_train.reshape(-1, 28 * 28)
    x_val = x_val.reshape(-1, 28 * 28)
    x_test = x_test.reshape(-1, 28 * 28)
    # 定义FCNN神经网络模型
    def build_model():
       model = models.Sequential([
        layers.Dense(params['hidden_nodes'], activation='relu', input_shape=(28 * 28,)),
        layers.Dense(10, activation='softmax')
    ])
       return model

    # 创建模型并编译
    model = build_model()
    model.compile(optimizer=keras.optimizers.SGD(learning_rate=params['learning_rate']),
                  loss='sparse_categorical_crossentropy',
                 metrics=['accuracy'])


    # 训练模型
    history = model.fit(x_train, y_train,
                        validation_data=(x_val, y_val),
                        epochs=params['num_epochs'],
                        batch_size=params['batch_size'])
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
