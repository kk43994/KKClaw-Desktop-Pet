# 🦞 Claw Desktop Pet

一个**企业级7×24稳定运行**的桌面龙虾智能助手，集成了 OpenClaw AI、智能语音播报、性能监控、自动恢复等强大功能。

![Version](https://img.shields.io/badge/version-1.3.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Stability](https://img.shields.io/badge/stability-7×24-success)

## ✨ 核心亮点

- 🛡️ **系统级容错** - 5种错误全捕获，智能自愈
- 🔄 **自动重启** - 崩溃后自动恢复，真正7×24运行
- 📊 **性能监控** - 实时健康评分，异常告警
- 🎙️ **智能语音** - 自然播报，口语化处理
- 📝 **日志管理** - 自动轮转，完整可观测
- 🧹 **资源优化** - 自动清理缓存和日志

## ⚡ 快速开始

**最简单的方式 (不需要AI功能):**

```bash
# 1. 克隆项目
git clone https://github.com/kk43994/claw-desktop-pet.git
cd claw-desktop-pet

# 2. 安装依赖
npm install
pip install edge-tts

# 3. 启动
npm start
```

**完整功能 (包含AI对话):**

```bash
# 1-2. 同上

# 3. 安装 OpenClaw
npm install -g openclaw

# 4. 启动 Gateway
openclaw gateway start

# 5. 启动龙虾
npm start
```

第一次启动后:
- 🦞 龙虾出现在右下角
- 🛡️ 全局错误处理启动
- 📊 性能监控开始采样
- 🎙️ 智能语音系统就绪
- 拖动到喜欢的位置，享受智能助手！

---

## 🚀 v1.3.0 新特性

### 🛡️ 7×24稳定运行系统

**全局错误处理**
- 5种错误类型全捕获 (uncaughtException, unhandledRejection等)
- 智能恢复机制 (最多3次尝试)
- 致命错误识别 (ENOSPC, ENOMEM等)
- 完整错误统计和历史

**自动重启机制**
- 崩溃后自动恢复
- 渐进式延迟 (3秒→60秒)
- 崩溃循环保护
- 状态持久化
- 重启次数限制 (1小时10次)

**性能监控系统**
- 实时性能采集 (CPU、内存、系统资源)
- 智能健康评分 (100分制)
- 异常检测和告警
- 错误统计和持久化
- 性能报告生成

**日志轮转管理**
- 自动清理过期日志 (30天)
- 大文件自动归档 (10MB)
- 日志浏览和查询
- 空间统计分析

**缓存清理系统**
- 自动清理截图、语音、日志
- 定时执行 (6小时)
- 语音播报清理结果
- 完整统计

### 🎙️ 智能语音系统

**智能内容分析**
- 自动分类: success, error, warning, data, celebration
- 优先级识别: high, medium, normal, low
- 情境检测: happy, urgent, calm, excited

**口语化处理**
- 技术术语转换 (API→接口, JSON→数据)
- 数字读法优化 (100MB→100兆)
- 自然停顿添加
- 连接词补充

**情境化播报**
- 紧急消息: 换男声 + 语速+10%
- 兴奋消息: 语速+20% + 音调+50Hz
- 成功消息: 音调+30Hz
- 重要消息: 优先插队

**智能过滤**
- 去重检测 (5秒窗口)
- 内容过短/纯标点过滤
- 长度智能处理 (>300字自动摘要)

**播报队列**
- 最多排队10条
- 高优先级插队
- 自动依次播放

---

## 📦 功能特性

### 🎨 核心功能
- **智能助手** - 企业级7×24稳定运行
- **AI 对话** - 集成 OpenClaw，实时智能对话
- **智能语音** - 口语化自然播报，情境化表达
- **性能监控** - 实时健康评分，异常告警
- **自动恢复** - 崩溃后智能重启
- **日志管理** - 自动轮转，完整可观测
- **双向同步** - 飞书消息 ↔️ 桌面通知

### 🎭 表情系统
- 🦞 正常状态 - 平静待机
- 🤔 思考中 - 处理问题时
- 💼 忙碌中 - 收到消息时
- 🎉 兴奋 - 开心时刻
- 😴 困了 - 可扩展

### 🎬 动画效果
- **呼吸动画** - 默认状态，上下浮动
- **思考动画** - 左右摇头
- **说话动画** - 上下跳动
- **工作动画** - 左右摇摆
- **开心动画** - 旋转庆祝
- **闲置动画** - 10秒无操作自动触发

### 💾 智能特性
- **位置记忆** - 自动保存窗口位置
- **状态指示** - 实时连接状态显示
- **工作日志** - 自动记录操作历史
- **健康评分** - 100分制性能评估
- **错误统计** - 完整错误追踪
- **资源优化** - 自动清理和管理

---

## 🛠️ 安装与配置

### 前置要求
- **Node.js** 16+ ([下载](https://nodejs.org/))
- **Python** 3.8+ ([下载](https://www.python.org/downloads/))
- **Windows** 10/11
- **OpenClaw Gateway** (可选，用于AI对话)

### 详细步骤

#### 1. 克隆仓库
```bash
git clone https://github.com/kk43994/claw-desktop-pet.git
cd claw-desktop-pet
```

#### 2. 安装 Node.js 依赖
```bash
npm install
```

#### 3. 安装 Python 依赖 (语音系统)
```bash
pip install edge-tts

# 验证安装
edge-tts --version
```

#### 4. 配置 OpenClaw (可选)
```bash
# 安装 OpenClaw Gateway
npm install -g openclaw

# 启动 Gateway
openclaw gateway start
```

#### 5. 运行
```bash
npm start
```

---

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

### 性能监控
- 📊 查看实时性能数据
- 🏥 健康评分 (100分制)
- ⚠️ 异常告警
- 📈 性能趋势分析

### 日志管理
- 📝 查看最近日志
- 🔍 搜索日志内容
- 🧹 手动触发清理
- 📊 空间统计

---

## 🔧 技术栈

- **Electron** - 桌面应用框架
- **OpenClaw** - AI 对话引擎
- **Edge TTS** - 微软语音合成
- **Node.js** - 后端运行时
- **HTML/CSS/JS** - 前端界面

---

## 📁 项目结构

```
claw-desktop-pet/
├── main.js                      # Electron 主进程
├── index.html                   # 前端界面
├── openclaw-client.js           # OpenClaw API 客户端
├── smart-voice.js              # 🆕 智能语音系统
├── global-error-handler.js     # 🆕 全局错误处理
├── auto-restart.js             # 🆕 自动重启机制
├── performance-monitor.js      # 🆕 性能监控系统
├── log-rotation.js             # 🆕 日志轮转管理
├── cache-manager.js            # 🆕 缓存清理系统
├── service-manager.js          # 服务管理
├── message-sync.js             # 消息同步系统
├── desktop-notifier.js         # 桌面通知服务器
├── pet-config.js               # 配置管理
├── work-logger.js              # 工作日志
├── package.json                # 项目配置
├── README.md                   # 说明文档
├── AUTO-RESTART.md             # 🆕 自动重启文档
├── ERROR-HANDLING.md           # 🆕 错误处理文档
├── MONITORING.md               # 🆕 性能监控文档
├── SMART-VOICE.md              # 🆕 智能语音文档
├── CACHE-CLEANUP.md            # 🆕 缓存清理文档
└── RELEASE-v1.3.0.md          # 🆕 发布说明
```

---

## 📊 性能指标

- **内存占用:** ~60MB (含监控数据)
- **CPU占用:** <1% (正常运行)
- **启动时间:** ~2秒
- **重启恢复:** <5秒
- **健康评分:** 实时更新
- **日志大小:** 自动控制

---

## 🔍 监控和调试

### IPC 接口

```javascript
// 性能监控
const stats = await window.ipc.invoke('performance-stats');
const health = await window.ipc.invoke('health-check');

// 日志管理
const logs = await window.ipc.invoke('log-list', 10);
await window.ipc.invoke('log-rotate');

// 错误历史
const errors = await window.ipc.invoke('error-history', 10);

// 重启管理
const restartStats = await window.ipc.invoke('restart-stats');

// 智能语音
await window.ipc.invoke('voice-speak', '测试', { priority: 'high' });
const voiceStats = await window.ipc.invoke('voice-stats');
```

---

## 🐛 常见问题

### 性能监控显示异常?
- 检查系统资源使用情况
- 查看错误日志
- 运行健康检查

### 自动重启不工作?
- 查看重启统计
- 检查是否达到重启上限
- 查看错误日志

### 语音播报不自然?
- 使用新的智能语音系统
- 支持口语化和情境化
- 查看 SMART-VOICE.md

---

## 📝 更新日志

### v1.3.0 (2026-02-07) 🚀
- ✨ **全局错误处理系统** - 系统级容错和自愈
- ✨ **自动重启机制** - 崩溃后智能恢复
- ✨ **性能监控系统** - 实时健康评分和异常告警
- ✨ **日志轮转管理** - 自动清理和空间管理
- ✨ **缓存清理系统** - 自动资源优化
- ✨ **智能语音系统** - 口语化自然播报
- 📝 新增5份技术文档
- 🧪 新增5个测试脚本
- 🎯 总计: 18个文件修改，+4558行代码

[查看完整发布说明](RELEASE-v1.3.0.md)

### v1.1.0 (2026-02-06)
- ✨ 进度汇报系统
- 🎤 emoji 过滤
- 📏 增加语音长度
- 📖 完善文档

### v1.0.0 (2026-02-06)
- 🎉 初始发布

---

## 🚀 未来计划

- [ ] 快捷键唤起 (Ctrl+Shift+C)
- [ ] 主题切换系统
- [ ] 夜间模式
- [ ] 远程监控面板
- [ ] AI 辅助诊断
- [ ] Windows 服务模式
- [ ] 多语言支持

---

## 📄 许可证

MIT License - 自由使用、修改、分发

---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request!

---

## 👨‍💻 作者

- **zhouk (kk43994)** - 开发者
- **Claw (AI)** - 灵魂设计师 🦞

---

## 📚 文档

- [错误处理文档](ERROR-HANDLING.md)
- [自动重启文档](AUTO-RESTART.md)
- [性能监控文档](MONITORING.md)
- [智能语音文档](SMART-VOICE.md)
- [缓存清理文档](CACHE-CLEANUP.md)
- [发布说明 v1.3.0](RELEASE-v1.3.0.md)

---

**⭐ 如果喜欢，请给个 Star！**

**🦞 现在是企业级7×24稳定运行的智能助手！**

Made with ❤️ and 🦞
