# 🚀 版本发布: v1.4.0

## 📅 发布时间: 2026-02-07

---

## ✨ 本次更新内容

### 🎙️ 语音系统优化
1. **智能音调调整**
   - 普通消息: +20Hz (更年轻活泼)
   - 开心消息: +30Hz (保持不变)
   - 超兴奋: +50Hz (保持不变)
   - 声音更有层次感和表现力

2. **播报能力增强**
   - TTS生成超时: 15秒 → 30秒
   - 播放超时: 60秒 → 120秒
   - 文本长度: 300-500字 → 800字
   - 支持更长内容,不会被截断

3. **文本清理优化**
   - 自动移除emoji和颜文字
   - 清理markdown格式
   - 标点归一化
   - 播报更自然流畅

### 🐛 Bug修复
- **重复播报问题**
  - 修复同一消息播报3次的bug
  - 添加EventEmitter监听器清理机制
  - 确保每个消息只播报一次

### 📝 文档更新
- 添加CHANGELOG.md (版本变更记录)
- 更新.gitignore (排除个人设置)

---

## 📦 发布信息

**版本号:** v1.4.0
**Git标签:** v1.4.0
**提交数:** 2 commits
**文件变更:** 6 files changed

**GitHub Release:**
- Tag: v1.4.0
- Branch: master
- Commit: 6c70f03

---

## 🔗 链接

- **GitHub仓库:** https://github.com/kk43994/claw-desktop-pet
- **发布页面:** https://github.com/kk43994/claw-desktop-pet/releases/tag/v1.4.0
- **对比变更:** https://github.com/kk43994/claw-desktop-pet/compare/v1.3.0...v1.4.0

---

## 📥 安装方式

### 克隆仓库
```bash
git clone https://github.com/kk43994/claw-desktop-pet.git
cd claw-desktop-pet
npm install
npm start
```

### 下载特定版本
```bash
git clone --branch v1.4.0 https://github.com/kk43994/claw-desktop-pet.git
```

---

## 🎯 下一步计划

- [ ] 添加更多语音选项
- [ ] 优化内存占用
- [ ] 添加更多自动化功能
- [ ] 完善文档

---

**状态:** ✅ 已成功发布到GitHub
**标签:** ✅ v1.4.0已创建并推送

Made with ❤️ by 小K
