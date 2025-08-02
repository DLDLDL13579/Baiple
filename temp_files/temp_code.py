# -*- coding: utf-8 -*-
import sys
import io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

import matplotlib as mpl
mpl.use('Agg')
import matplotlib.pyplot as plt

try:
    from tkinter import simpledialog


    simpledialog.askstring('输入框','fdewfeef')

except Exception as e:
    print("执行错误:", str(e))
