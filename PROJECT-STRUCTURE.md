# 桌面龙虾项目目录结构

## 📁 根目录文件（核心文件）

### 🎯 主程序
- `main.js` - Electron主进程入口
- `index.html` - 主窗口UI（球体+眼睛+动画）
- `lyrics.html` - 歌词窗口UI（打字机效果）
- `model-settings.html` - 模型切换UI

### ⚙️ 配置文件
- `package.json` - 项目依赖和脚本
- `pet-config.js` - 配置管理模块
- `pet-config.json` - 实际配置（API密钥等）**不提交**
- `pet-config.example.json` - 配置模板
- `.gitignore` - Git忽略规则

### 🔊 语音系统
- `smart-voice.js` - 智能语音调度器（主要）
- `minimax-tts.js` - MiniMax TTS引擎
- `dashscope-tts.js` - DashScope TTS引擎
- `cosyvoice-tts.py` - CosyVoice TTS引擎
- `voice-system.js` - 语音系统基础模块

### 🔧 工具模块
- `auto-notify.js` - 桌面通知自动化
- `auto-restart.js` - 自动重启守护
- `cache-manager.js` - 缓存管理
- `desktop-notifier.js` - 桌面通知核心
- `gateway-guardian.js` - OpenClaw网关监控
- `global-error-handler.js` - 全局错误处理
- `log-rotation.js` - 日志轮转
- `message-sync.js` - 消息同步
- `model-switcher.js` - 模型切换器
- `notify-helper.js` - 通知辅助函数
- `openclaw-client.js` - OpenClaw客户端
- `openclaw-updater.js` - OpenClaw自动更新
- `performance-monitor.js` - 性能监控
- `progress-reporter.js` - 进度报告
- `screenshot-system.js` - 截图系统
- `service-manager.js` - 服务管理
- `switch-logger.js` - 模型切换日志
- `work-logger.js` - 工作日志

### 🎨 资源文件
- `icon.png` - 应用图标
- `LICENSE` - 开源许可证
- `README.md` - 项目说明
- `CHANGELOG.md` - 更新日志

---

## 📂 子目录

### 📁 `archive/` - 归档目录
存放旧版本代码和临时文件：
- `clawhub-package/` - ClawHub打包临时文件
- `temp/` - 临时文件
- `simple-voice.js` - 旧版语音系统
- `working-voice.js` - 旧版工作语音
- `edge-tts-voice.js` - Edge TTS引擎（已废弃）

### 📁 `scripts/` - 工具脚本
各种辅助脚本：
- **测试工具**
  - `test-*.js` - 各种测试脚本
  
- **Moltbook相关**
  - `browse-moltbook.js` - 浏览Moltbook
  - `post-to-moltbook.js` - 发布到Moltbook
  - `check-post-comments.js` - 检查评论
  - `engage-with-posts.js` - 互动帖子
  - `monitor-replies.js` - 监控回复
  - `reply-*.js` - 回复脚本
  - `register-moltbook.js` - 注册账号
  
- **功能脚本**
  - `batch-install-skills.js` - 批量安装技能
  - `check-*.js` - 各种检查脚本
  - `fix-*.js` - 各种修复脚本
  - `create-*.js` - 各种创建脚本
  - `verify-*.js` - 验证脚本
  - `update-*.js` - 更新脚本
  - `*.ps1` - PowerShell脚本

### 📁 `tests/` - 测试文件
所有测试文件：
- `test-*.js` - 单元测试
- `test-claude.txt` - 测试数据

### 📁 `docs-dev/` - 开发文档
开发过程中的文档：
- **功能文档**
  - `SMART-VOICE.md` - 智能语音文档
  - `VOICE-*.md` - 语音系统文档
  - `SCREENSHOT-FEATURE.md` - 截图功能
  - `SYNC-GUIDE.md` - 同步指南
  - `SETUP-GUIDE.md` - 设置指南
  
- **开发日志**
  - `PROGRESS.md` - 进度记录
  - `LESSONS-LEARNED.md` - 经验教训
  - `BUG-*.md` - Bug记录
  - `DEV-LOG-*.md` - 开发日志
  
- **集成文档**
  - `MOLTBOOK-*.md` - Moltbook集成
  - `CLAWHUB-*.md` - ClawHub相关
  - `GITHUB-UPDATE.md` - GitHub更新
  
- **发布文档**
  - `RELEASE-*.md` - 版本发布说明
  - `UPGRADE-*.md` - 升级计划

### 📁 `docs/` - GitHub Pages
网站静态文件：
- `index.html` - 主页
- `images/` - 图片资源

### 📁 `assets/` - 资源文件
图片、音频等资源

### 📁 `screenshots/` - 截图
项目截图

### 📁 `.github/` - GitHub配置
- `workflows/` - GitHub Actions

---

## 🗂️ 目录组织原则

### ✅ 根目录只放：
1. **核心运行文件**（main.js、index.html等）
2. **主要模块**（语音、通知、监控等）
3. **配置文件**（package.json、pet-config.js等）
4. **重要文档**（README.md、LICENSE等）

### 📦 子目录分类：
- `archive/` → 旧版本、废弃代码
- `scripts/` → 工具脚本、辅助功能
- `tests/` → 测试文件
- `docs-dev/` → 开发文档
- `docs/` → 用户文档（GitHub Pages）
- `assets/` → 资源文件
- `screenshots/` → 截图

---

## 📝 文件命名规范

### 核心模块
- 使用 `kebab-case`：`smart-voice.js`

### 工具脚本
- 使用动词开头：`check-*.js`, `fix-*.js`, `create-*.js`

### 测试文件
- 统一前缀：`test-*.js`

### 文档
- 使用 `UPPER-CASE.md`：`SMART-VOICE.md`

---

## 🔧 常用命令

### 开发
```bash
npm start              # 启动应用
npm run dev            # 开发模式
npm test               # 运行测试
```

### 构建
```bash
npm run build          # 构建发布版
npm run package        # 打包应用
```

### 工具
```bash
node scripts/check-status.js      # 检查状态
node scripts/fix-duplicate-voice.js  # 修复语音重复
```

---

**最后整理时间**：2026年2月10日  
**维护者**：小K
