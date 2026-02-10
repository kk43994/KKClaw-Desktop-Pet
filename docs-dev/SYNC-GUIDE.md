# KKClaw Switch 配置同步功能

## 功能说明

现在 KKClaw Switch（桌面龙虾的模型管理面板）新增了两个同步按钮：

### 1. ⬆ 同步到 OpenClaw
- **功能**: 将 KKClaw Switch 中的服务商配置同步到 OpenClaw
- **操作**: 点击按钮即可
- **效果**:
  - 更新 `~/.openclaw/openclaw.json`
  - 更新 `~/.openclaw/agents/main/agent/models.json`
  - 自动生成所有模型配置（Opus 4.6, Sonnet 4.5, Haiku 4.5）
- **提示**: 同步后需要重启 OpenClaw 才能生效

### 2. ⬇ 从 CC Switch 导入
- **功能**: 从 CC Switch 数据库导入服务商配置到 KKClaw Switch
- **操作**: 点击按钮 → 确认对话框
- **效果**:
  - 读取 `~/.cc-switch/cc-switch.db`
  - 导入所有 Claude providers
  - 自动生成标准模型列表
  - 刷新 KKClaw Switch 界面
- **注意**: 会覆盖当前的服务商列表

## 使用流程

### 方案 A: 从 CC Switch 同步到 OpenClaw

```
1. 在 CC Switch 中配置好服务商
2. 点击桌面龙虾右下角按钮 → 打开 KKClaw Switch
3. 点击 "⬇ 从CC Switch导入"
4. 确认导入
5. 点击 "⬆ 同步到OpenClaw"
6. 重启 OpenClaw
```

### 方案 B: 直接在 KKClaw Switch 中管理

```
1. 在 KKClaw Switch 中添加/编辑服务商
2. 点击 "⬆ 同步到OpenClaw"
3. 重启 OpenClaw
```

## 技术细节

### 配置文件位置
- **KKClaw Switch**: 使用 model-switcher.js 的内存配置
- **OpenClaw**:
  - `~/.openclaw/openclaw.json` (主配置)
  - `~/.openclaw/agents/main/agent/models.json` (agent配置)
- **CC Switch**: `~/.cc-switch/cc-switch.db` (SQLite数据库)

### 模型配置格式
同步时会自动为每个 provider 生成标准的 Claude 模型列表：
- claude-opus-4-6
- claude-sonnet-4-5-20250929
- claude-haiku-4-5-20251001

所有模型配置了：
- reasoning: true
- input: text + image
- contextWindow: 200000
- maxTokens: 32000

### 代码文件
- **界面**: `model-settings.html` (按钮和前端逻辑)
- **处理器**: `main.js` (IPC handlers: sync-to-openclaw, import-from-ccswitch)
- **核心**: `model-switcher.js` (服务商管理)

## 常见问题

### Q: 同步后 OpenClaw 没有生效？
A: 需要重启 OpenClaw。可以使用 `/restart` 命令或重新启动进程。

### Q: 导入后原来的服务商丢失了？
A: 导入操作会覆盖现有配置��建议在导入前做好备份。

### Q: 某个 provider 没有模型？
A: 检查 provider 的 baseUrl 和 apiKey 是否正确配置。

### Q: 如何知道当前使用哪个 provider？
A: 在 KKClaw Switch 顶部会显示 "当前使用" 的指示器。

## 更新日志

### 2026-02-10
- ✅ 添加 "同步到 OpenClaw" 功能
- ✅ 添加 "从 CC Switch 导入" 功能
- ✅ 自动生成标准模型配置
- ✅ 支持批量导入
- ✅ 添加错误提示和成功反馈
