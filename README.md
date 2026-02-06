# 🦞 Claw Desktop Pet

一个可爱的桌面龙虾助手,集成了 OpenClaw AI、Edge TTS 语音、表情动画系统。

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ 功能特性

### 🎨 核心功能
- **桌面宠物** - 可爱的龙虾🦞在桌面陪伴你
- **AI 对话** - 集成 OpenClaw,实时智能对话
- **语音播报** - Edge TTS 自然中文语音(晓晓)
- **双向同步** - 飞书消息 ↔️ 桌面通知

### 🎭 表情系统
- 🦞 正常状态 - 平静待机
- 🤔 思考中 - 处理问题时
- 💼 忙碌中 - 收到消息时
- 🎉 兴奋 - 开心时刻
- 😴 困了 - 可扩展

### 🎬 动画效果
- **呼吸动画** - 默认状态,上下浮动
- **思考动画** - 左右摇头
- **说话动画** - 上下跳动
- **工作动画** - 左右摇摆
- **开心动画** - 旋转庆祝
- **闲置动画** - 10秒无操作自动触发随机动作

### 💾 智能特性
- **位置记忆** - 自动保存窗口位置
- **状态指示** - 实时连接状态显示
- **工作日志** - 自动记录操作历史

## 📦 安装

### 前置要求
- Node.js 16+
- Python 3.8+ (用于 Edge TTS)
- Windows 10/11

### 步骤

1. **克隆仓库**
```bash
git clone https://github.com/YOUR_USERNAME/claw-desktop-pet.git
cd claw-desktop-pet
```

2. **安装依赖**
```bash
npm install
pip install edge-tts
```

3. **配置 OpenClaw**

创建或编辑配置文件 (如果需要):
```json
{
  "openclawUrl": "http://localhost:3000",
  "voice": "zh-CN-XiaoxiaoNeural"
}
```

4. **运行**
```bash
npm start
```

## 🎮 使用方法

### 基本操作
- **拖动** - 按住龙虾拖动到任意位置
- **点击** - 打开控制菜单
- **输入** - 在输入框输入消息发送
- **语音** - 点击🔊按钮切换语音播报

### 快捷按钮
- 💬 **发送** - 发送消息给AI
- 🔊 **语音** - 开启/关闭语音播报
- ⚡ **充能** - 给龙虾加能量
- 🎯 **任务** - 触发工作动画

### 闲置模式
10秒无操作后,龙虾会:
- 随机说话 ("...", "嗯?", "*挥钳*")
- 做小动作 (跳跃、摇摆)
- 持续循环,保持活力

## 🛠️ 技术栈

- **Electron** - 桌面应用框架
- **OpenClaw** - AI 对话引擎
- **Edge TTS** - 微软语音合成
- **Node.js** - 后端运行时
- **HTML/CSS/JS** - 前端界面

## 📁 项目结构

```
claw-desktop-pet/
├── main.js                 # Electron 主进程
├── index.html              # 前端界面
├── openclaw-client.js      # OpenClaw API 客户端
├── working-voice.js        # Edge TTS 语音系统
├── message-sync.js         # 消息同步系统
├── desktop-notifier.js     # 桌面通知服务器
├── pet-config.js           # 配置管理
├── work-logger.js          # 工作日志
├── auto-notify.js          # 自动通知辅助
├── package.json            # 项目配置
├── README.md               # 说明文档
└── temp/                   # 临时文件(语音缓存)
```

## 🔧 配置选项

### pet-config.json
```json
{
  "position": { "x": 1580, "y": 418 },
  "mood": "happy",
  "theme": "default",
  "voiceEnabled": true
}
```

- `position` - 窗口位置(自动保存)
- `mood` - 当前情绪状态
- `theme` - 主题(未来扩展)
- `voiceEnabled` - 语音开关

## 🎨 自定义

### 更换声音
编辑 `working-voice.js`:
```javascript
this.voice = 'zh-CN-YunxiNeural'; // 温暖男声
// 或
this.voice = 'zh-CN-XiaoyiNeural'; // 温柔女声
```

### 更换表情
编辑 `index.html`:
```javascript
const emotions = {
    normal: '🦞',
    happy: '🎉',
    // 添加更多...
};
```

### 调整动画
CSS 动画定义在 `index.html` 的 `<style>` 部分。

## 🐛 常见问题

### 听不到声音?
1. 检查系统音量
2. 确认 edge-tts 已安装: `pip install edge-tts`
3. 查看日志输出

### 窗口位置不对?
删除 `pet-config.json`,重新启动会恢复默认位置。

### OpenClaw 连接失败?
确保 OpenClaw Gateway 正在运行: `http://localhost:3000`

## 🚀 未来计划

- [ ] 快捷键唤起 (Ctrl+Shift+C)
- [ ] 主题切换系统
- [ ] 夜间模式
- [ ] 消息历史记录
- [ ] 定时提醒功能
- [ ] 截图功能
- [ ] 拖拽文件发送
- [ ] 多窗口支持

## 📝 更新日志

### v1.0.0 (2026-02-06)
- ✨ 初始发布
- 🎭 表情系统
- 🎬 5种动画状态
- 🔊 Edge TTS 语音
- 💾 位置记忆
- 🎲 闲置动画

## 📄 许可证

MIT License - 自由使用、修改、分发

## 🤝 贡献

欢迎提交 Issue 和 Pull Request!

## 👨‍💻 作者

- **zhouk** - 开发者
- **Claw (AI)** - 灵魂设计师 🦞

---

**⭐ 如果喜欢,请给个 Star!**

Made with ❤️ and 🦞
