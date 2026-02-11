# 🚀 GitHub 更新完成

## 📅 时间: 2026-02-07

### ✅ 已提交的更新

#### 🎙️ 语音系统优化
1. **音调配置调整**
   - 普通消息: 0Hz → +20Hz (更年轻活泼)
   - 开心消息: +30Hz (保持不变)
   - 超兴奋: +50Hz (保持不变)

2. **超时时间增加**
   - TTS生成: 15秒 → 30秒
   - 播放时间: 60秒 → 120秒

3. **文本长度提升**
   - smart-voice.js: 300字 → 800字
   - main.js: 500字 → 800字

#### 🐛 Bug修复
1. **重复播报问题**
   - 在main.js添加EventEmitter监听器清理
   - 防止重复注册导致多次播报

2. **文本清理优化**
   - desktop-bridge.js自动清理emoji、颜文字
   - 移除markdown格式,标点归一化

#### 📝 配置更新
- 更新.gitignore,排除:
  - 个人凭证文件 (.moltbook-credentials)
  - 临时测试脚本 (test-*.js, fix-*.js等)
  - 临时文档 (*-SUCCESS.md, BUG-*.md等)
  - 截图目录 (screenshots/)
  - 打包文件 (clawhub-package/)

---

### 🔒 已过滤的个人内容

**不会提交到GitHub:**
- ✅ .moltbook-credentials (Moltbook凭证)
- ✅ pet-config.json (窗口位置等个人设置)
- ✅ screenshots/ (个人截图)
- ✅ temp/ (临时语音文件)
- ✅ logs/ (运行日志)
- ✅ 所有测试脚本和临时文档

---

### 📊 提交信息

```
commit fd64be3
🎙️ 语音系统优化 + Bug修复

✨ 语音改进:
- 调整音调配置: 普通+20Hz, 开心+30Hz, 超兴奋+50Hz
- 增加超时时间: TTS生成30秒, 播放120秒
- 提高文本长度限制: 300字→800字

🐛 Bug修复:
- 修复重复播报问题 (EventEmitter监听器清理)
- 优化文本清理逻辑 (desktop-bridge.js)

📝 配置更新:
- 更新.gitignore,排除个人设置和临时文件
```

---

### 🔗 GitHub链接

https://github.com/kk43994/KKClaw-Desktop-Pet

---

**状态:** ✅ 已成功推送到master分支
**个人信息:** ✅ 完全过滤,安全可分享

Made with ❤️ by 小K
