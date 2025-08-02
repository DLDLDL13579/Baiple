# -*- coding: utf-8 -*-
import sys
import io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

import matplotlib as mpl
mpl.use('Agg')
import matplotlib.pyplot as plt

try:
    import os
    import cv2
    import numpy as np
    import tensorflow as tf
    from tensorflow.keras import layers, models
    from tensorflow.keras.preprocessing.image import ImageDataGenerator
    # 数据集路径
    TRAIN_DIR = "C:\sourcecode\datasets\zebra\\train"
    VAL_DIR = "C:\sourcecode\datasets\zebra\\val"

    # 基础配置
    IMG_SIZE = 50# 图片尺寸
    BATCH_SIZE = 32# 批次大小
    EPOCHS = 15# 迭代次数
    # 数据预处理
    train_datagen = ImageDataGenerator(rescale=1. / 255)
    val_datagen = ImageDataGenerator(rescale=1. / 255)
    train_generator = train_datagen.flow_from_directory(
       TRAIN_DIR,
        target_size=(IMG_SIZE, IMG_SIZE),
        batch_size=BATCH_SIZE,
        class_mode='binary'
    )
    val_generator = val_datagen.flow_from_directory(
        VAL_DIR,
        target_size=(IMG_SIZE, IMG_SIZE),
        batch_size=BATCH_SIZE,
        class_mode='binary',
        shuffle=False
    )
          # 构建简单CNN模型
    model = models.Sequential([
        layers.Conv2D(32, (3, 3), activation='relu', input_shape=(IMG_SIZE, IMG_SIZE, 3)),
        layers.MaxPooling2D((2, 2)),
        layers.Flatten(),
        layers.Dense(64, activation='relu'),
        layers.Dense(1, activation='sigmoid')
    ])

    model.compile(optimizer='adam',loss='binary_crossentropy',metrics=['accuracy'])


        # 训练模型
    history = model.fit(train_generator,epochs=EPOCHS,validation_data=val_generator)
        # 预测函数
    def predict_image(img_path):
        img = cv2.imread(img_path)
        if img is None:
            return "无法读取图片", 0.0

        img = cv2.resize(img, (IMG_SIZE, IMG_SIZE))
        img = img / 255.0
        img = np.expand_dims(img, axis=0)

        prediction = model.predict(img)[0][0]
        return "斑马线" if prediction > 0.5 else "非斑马线", prediction

except Exception as e:
    print("执行错误:", str(e))
