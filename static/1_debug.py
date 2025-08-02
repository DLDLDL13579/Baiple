import subprocess
import base64
import os
import sys
import time
from pathlib import Path
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import webbrowser
from threading import Timer

# 初始化路径
BASE_DIR = Path(__file__).parent.resolve()
TEMP_DIR = BASE_DIR / "temp_files"
TEMP_DIR.mkdir(exist_ok=True)

# 获取当前 Python 解释器路径（兼容 Windows）
PYTHON_EXECUTABLE = sys.executable

app = Flask(__name__,
            static_folder='static',
            template_folder='templates')
CORS(app)

app.config['JSON_AS_ASCII'] = False
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024


def cleanup_files(*filenames):
    """安全删除临时文件（解决 Windows 文件占用问题）"""
    for filename in filenames:
        if filename.exists():
            max_retries = 3
            for _ in range(max_retries):
                try:
                    filename.unlink()
                    break
                except Exception as e:
                    time.sleep(0.5)
                    if _ == max_retries - 1:
                        print(f"无法删除文件 {filename}: {str(e)}")


@app.route('/')
def index():
    return render_template('vueindex.html')


@app.route('/run_code', methods=['POST'])
def run_code():
    temp_code_path = TEMP_DIR / "temp_code.py"
    output_image_path = TEMP_DIR / "output.png"

    # 清理旧文件（增加重试机制）
    cleanup_files(temp_code_path, output_image_path)

    try:
        # 验证请求格式
        if not request.is_json:
            return jsonify({'success': False, 'message': '请求必须为 JSON 格式'}), 400

        data = request.get_json()
        if 'code' not in data:
            return jsonify({'success': False, 'message': '未提供代码'}), 400

        # 写入代码文件（添加 Matplotlib 头）
        with open(temp_code_path, 'w', encoding='utf-8') as f:
            f.write("""import matplotlib
matplotlib.use('Agg')\n
import matplotlib.pyplot as plt\n\n""")
            f.write(data['code'])
            f.write("\nplt.close('all')\n")  # 确保释放资源

        # 执行代码（使用当前 Python 解释器）
        result = subprocess.run(
            [PYTHON_EXECUTABLE, str(temp_code_path)],
            cwd=str(TEMP_DIR)
			#,
            #capture_output=True,
            #text=True,
            #timeout=30,
            #check=True,
            #encoding='utf-8',
            #errors='replace'
        )

        # 构建响应数据
        response_data = {
		    'success': True
            #'success': True,
            #'output': result.stdout.strip(),
            #'output': result.stdout.decode().strip(),
			#'warning': result.stderr.strip() if result.stderr.strip() 
			#'warning': result.stderr.strip() if result.stderr.decode().strip() 
			#else None
        }

        # 处理生成的图片
        if output_image_path.exists():
            with open(output_image_path, 'rb') as f:
                response_data['image'] = base64.b64encode(f.read()).decode()
        else:
            print("警告：未生成 output.png")

        return jsonify(response_data)

    except subprocess.TimeoutExpired:
        return jsonify({'success': False, 'message': '代码执行超时（30秒限制）'}), 408
    except subprocess.CalledProcessError as e:
        print(f"[执行错误] 返回码 {e.returncode}\nSTDOUT: {e.stdout}\nSTDERR: {e.stderr}")
        return jsonify({
            'success': False,
            'message': f"执行错误（状态码 {e.returncode}）",
            'detail': e.stderr.strip() or "未知错误，请检查控制台日志"
        }), 400
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({
            'success': False,
            'message': '服务器内部错误',
            'detail': str(e)
        }), 500


def open_browser():
    """尝试打开浏览器（忽略可能的权限错误）"""
    try:
        webbrowser.open('http://localhost:5001')
    except Exception as e:
        print(f"自动打开浏览器失败: {str(e)}")


if __name__ == '__main__':
    # 依赖检查
    try:
        import matplotlib
    except ImportError:
        print("错误：请先安装 matplotlib！执行命令：pip install matplotlib")
        exit(1)

    # 延迟打开浏览器
    Timer(1.5, open_browser).start()

    # 启动服务
    app.run(
        host='0.0.0.0',
        port=5001,
        debug=False,
        use_reloader=False,
        threaded=True
    )