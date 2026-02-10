# 📸 截图反馈功能 - 使用文档

## ✅ 已实现功能

### 1. **自动截图系统**
- ✅ PowerShell 截图 (主方案)
- ✅ Python desktop-control (备用,需安装 pyautogui)
- ✅ 自动保存到 `screenshots/` 文件夹
- ✅ 文件名格式: `{timestamp}_{reason}.png`

### 2. **飞书上传** (待完善)
- ✅ 上传接口已就绪
- ⏳ 需要集成 OpenClaw message 工具

### 3. **桌面通知**
- ✅ 进度汇报系统集成
- ✅ 实时通知到桌面龙虾

### 4. **截图管理**
- ✅ 获取最近截图列表
- ✅ 自动清理旧截图 (保留20张)

---

## 🎮 如何使用

### **方案A: 在渲染进程调用 (index.html)**

```javascript
// 手动截图
document.getElementById('screenshot-btn').addEventListener('click', async () => {
    const result = await window.electronAPI.takeScreenshot('用户手动截图');
    if (result.success) {
        console.log('✅ 截图成功:', result.filepath);
    }
});

// 监听截图完成事件
window.electronAPI.onScreenshotTaken((data) => {
    console.log('📸 收到截图:', data.filepath);
    // 显示缩略图
    showThumbnail(data.filepath);
});
```

### **方案B: 在主进程调用 (main.js)**

```javascript
// 任务完成后自动截图
async function completeTask(taskName) {
    // 完成任务
    await doSomething();
    
    // 延迟1秒,等待界面更新
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 自动截图
    const filepath = await screenshotSystem.captureScreen(taskName);
    
    // 上传到飞书
    await larkUploader.uploadToLark(filepath, `✅ ${taskName} 完成`);
    
    // 通知桌面
    mainWindow.webContents.send('screenshot-taken', {
        filepath,
        reason: taskName,
        timestamp: Date.now()
    });
}
```

### **方案C: 通过 IPC 调用**

```javascript
// 从任何地方调用
ipcRenderer.invoke('take-screenshot', '安装完成').then(result => {
    console.log('截图结果:', result);
});
```

---

## 📋 API 参考

### **IPC Handlers**

#### `take-screenshot`
```javascript
ipcRenderer.invoke('take-screenshot', reason)
  .then(result => {
      // result.success - 是否成功
      // result.filepath - 截图路径
      // result.reason - 截图原因
  });
```

#### `get-recent-screenshots`
```javascript
ipcRenderer.invoke('get-recent-screenshots', 5)
  .then(screenshots => {
      // screenshots[i].name - 文件名
      // screenshots[i].path - 完整路径
      // screenshots[i].timestamp - 时间戳
  });
```

#### `cleanup-screenshots`
```javascript
ipcRenderer.invoke('cleanup-screenshots', 20)
  .then(() => {
      console.log('✅ 清理完成,保留20张');
  });
```

---

## 🔧 集成示例

### **示例1: 任务完成截图**

```javascript
// 在 ProgressReporter 的 complete() 中添加
async complete(summary) {
    this.notify(`✅ ${summary}`);
    
    // 延迟截图
    setTimeout(async () => {
        await window.electronAPI.takeScreenshot(this.taskName);
    }, 1000);
}
```

### **示例2: 定时截图**

```javascript
// 每5分钟自动截图
setInterval(async () => {
    const filepath = await screenshotSystem.captureScreen('定时快照');
    console.log('📸 定时截图:', filepath);
}, 5 * 60 * 1000);
```

### **示例3: 错误截图**

```javascript
try {
    await riskyOperation();
} catch (err) {
    // 出错时自动截图
    await screenshotSystem.captureScreen(`错误_${err.message}`);
    throw err;
}
```

---

## 📂 文件结构

```
desktop-pet/
├── screenshot-system.js     # 截图核心模块
├── lark-uploader.js         # 飞书上传模块
├── test-screenshot.js       # 测试脚本
├── screenshots/             # 截图保存目录
│   ├── 1770377383840_功能测试.png
│   └── ...
└── main.js                  # 集成到主进程
```

---

## ⚙️ 配置选项

### **截图质量**
默认 PNG 格式,无压缩。

### **保留数量**
默认保留最近 20 张截图,可调整:
```javascript
await screenshotSystem.cleanupOld(50); // 保留50张
```

### **截图区域**
```javascript
// 截取指定区域
await screenshotSystem.captureRegion(x, y, width, height, reason);
```

---

## 🐛 故障排除

### **Python 截图失败**
```
ModuleNotFoundError: No module named 'pyautogui'
```

**解决方案:**
```bash
pip install pyautogui pillow opencv-python pygetwindow
```

### **PowerShell 截图失败**
```
Cannot find type [System.Windows.Forms.Screen]
```

**解决方案:**
- 已自动修复,使用 `-AssemblyName` 加载
- 如仍失败,检查 PowerShell 版本

### **文件路径问题**
- 路径使用 `/` 而不是 `\\`
- 已在代码中处理转义

---

## 🚀 下一步计划

### **v1.3.0 - 完整集成**
- [ ] 真正的飞书上传 (OpenClaw message 工具)
- [ ] 龙虾窗口显示缩略图
- [ ] 右键菜单 "立即截图"
- [ ] 任务完成自动截图

### **v1.4.0 - 增强功能**
- [ ] 截图历史浏览器
- [ ] 图片标注功能
- [ ] OCR 文字识别
- [ ] 自动打码敏感信息

---

## ✅ 测试清单

- [x] PowerShell 截图成功
- [x] 文件正确保存
- [x] 桌面通知工作
- [x] 进度汇报显示
- [ ] 飞书上传测试
- [ ] 缩略图显示
- [ ] 清理旧文件
- [ ] 区域截图

---

**当前状态: 核心功能已完成,待集成到UI! ✅**
