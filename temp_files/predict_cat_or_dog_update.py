# 导入框架和库，完成参数配置
import tensorflow as tf
import cv2
import numpy as np
import matplotlib.pyplot as plt
import os

# 参数设置
IMG_SIZE = 128
BASE_DIR = os.path.dirname(__file__)  # 当前.py文件的目录
MODEL_PATH = os.path.join(BASE_DIR, 'cat_dog_cnn_model.h5')
IMAGE_PATH = 'test_images/test_cat_or_dog.png'  # 测试图像路径

print("当前图像路径是否存在：", os.path.exists(IMAGE_PATH))


# 图像预处理函数
def load_and_preprocess_image(img_path):
    # 加载原始图像
    img = cv2.imread(img_path)
    if img is None:
        raise FileNotFoundError(f"无法加载图像，请检查路径是否正确：{img_path}")

    # 显示原始图像（BGR转RGB以便matplotlib显示）
    img_rgb_original = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    plt.figure(figsize=(4, 4))
    plt.imshow(img_rgb_original)
    plt.axis('off')
    plt.title("Original Image")
    plt.show()

    # 预处理（尺寸缩放、归一化）
    img_resized = cv2.resize(img, (IMG_SIZE, IMG_SIZE))
    img_rgb = cv2.cvtColor(img_resized, cv2.COLOR_BGR2RGB)
    img_normalized = img_rgb / 255.0

    # 显示预处理后的图像
    plt.figure(figsize=(4, 4))
    plt.imshow(img_rgb)
    plt.axis('off')
    plt.title("Preprocessed Image (Resized & Normalized)")
    plt.show()

    return np.expand_dims(img_normalized, axis=0), img_rgb


# 加载已训练好的模型
model = tf.keras.models.load_model(MODEL_PATH)

# 加载图像并预测
img_batch, img_display = load_and_preprocess_image(IMAGE_PATH)
prediction = model.predict(img_batch)[0][0]
label = "Dog" if prediction > 0.5 else "Cat"
confidence = round(prediction if prediction > 0.5 else 1 - prediction, 2)

# 理解与决策：在图像上添加文字，并显示
output_img = img_display.copy()
cv2.putText(output_img, f"{label} ({confidence * 100:.1f}%)", (10, 20),
            cv2.FONT_HERSHEY_SIMPLEX, 0.6,
            (0, 255, 0) if label == "Dog" else (255, 0, 0), 2)

# 显示预测后的图像
plt.figure(figsize=(4, 4))
plt.imshow(output_img)
plt.axis('off')
plt.title("Prediction Result")
plt.show()
