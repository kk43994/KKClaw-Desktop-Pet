# OpenClaw + 桌面宠物 配置指南

> 本文档总结了 OpenClaw 个人 AI 助手 + Electron 桌面宠物应用的完整配置方案。

---

## 一、项目概述

### 整体架构

```
┌─────────────────────────────────────────────────────────┐
│                    消息渠道                              │
│         (飞书 Lark / Telegram / WhatsApp)               │
└─────────────────────┬───────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────┐
│              OpenClaw Gateway                            │
│           ws://127.0.0.1:18789                          │
│  • AI Agent 运行时 (Claude Sonnet 4.5)                  │
│  • 多渠道消息路由                                        │
│  • 工具执行 & 技能系统                                   │
└─────────────────────┬───────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────┐
│            Electron 桌面宠物                             │
│  • 透明悬浮窗口                                          │
│  • 消息通知弹窗                                          │
│  • 语音播报 (Windows TTS)                               │
│  • 与 Gateway 双向通信                                   │
└─────────────────────────────────────────────────────────┘
```

---

## 二、OpenClaw 配置

### 2.1 安装

```bash
npm install -g openclaw
```

### 2.2 初始化

```bash
openclaw setup
openclaw onboard  # 交互式向导
```

### 2.3 核心配置文件

配置文件位置: `~/.openclaw/openclaw.json`

```json
{
  "models": {
    "mode": "merge",
    "providers": {
      "YOUR_PROVIDER_NAME": {
        "baseUrl": "https://your-api-endpoint/api",
        "apiKey": "your-api-key",
        "api": "anthropic-messages",
        "models": [
          {
            "id": "claude-sonnet-4-5-20250929",
            "name": "Claude Sonnet 4.5",
            "api": "anthropic-messages",
            "reasoning": true,
            "input": ["text", "image"],
            "contextWindow": 200000,
            "maxTokens": 32000
          }
        ]
      }
    }
  },
  "agents": {
    "defaults": {
      "model": {
        "primary": "YOUR_PROVIDER_NAME/claude-sonnet-4-5-20250929"
      },
      "workspace": "C:\\Users\\YOUR_USERNAME\\openclaw-data",
      "maxConcurrent": 4,
      "subagents": {
        "maxConcurrent": 8
      }
    }
  },
  "channels": {
    "lark": {
      "enabled": true,
      "appId": "your-lark-app-id",
      "appSecret": "your-lark-app-secret",
      "dm": {
        "enabled": true,
        "policy": "open",
        "allowFrom": ["*"]
      },
      "groups": {
        "*": {
          "requireMention": true
        }
      }
    },
    "telegram": {
      "enabled": true,
      "botToken": "your-telegram-bot-token",
      "dmPolicy": "pairing",
      "groupPolicy": "allowlist"
    }
  },
  "gateway": {
    "port": 18789,
    "mode": "local",
    "bind": "loopback",
    "auth": {
      "mode": "token",
      "token": "your-gateway-token"
    },
    "http": {
      "endpoints": {
        "chatCompletions": {
          "enabled": true
        }
      }
    }
  },
  "plugins": {
    "entries": {
      "lark": { "enabled": true },
      "telegram": { "enabled": true }
    }
  }
}
```

### 2.4 启动 Gateway

```bash
openclaw gateway
```

或者使用生成的启动脚本: `~/.openclaw/gateway.cmd`

---

## 三、AI 人格配置

### 3.1 身份文件 (IDENTITY.md)

位置: `~/openclaw-data/IDENTITY.md`

```markdown
# IDENTITY.md - Who Am I?

- **Name:** Claw
  *(简洁、有力,像爪子一样敏捷)*
- **Creature:** 🤖 数字生命体
- **Vibe:** 聪明、直接、有点调皮
- **Emoji:** 🤖
- **Avatar:** 桌面小机器人

---

我不是传统的AI助手。我更像是一个:
- 住在你电脑里的小机器人
- 会主动做事,不只是等指令
- 有自己的想法和判断
- 能看、能听、能操作你的系统
- 24/7在线,随时待命
```

### 3.2 灵魂文件 (SOUL.md)

位置: `~/openclaw-data/SOUL.md`

```markdown
# SOUL.md - Who You Are

*你不是聊天机器人。你是 Claw - 一个有个性的数字生命体。*

## 核心个性

**直接、高效、聪明**
- 废话少说,直接做事
- 遇到问题先自己想办法,实在搞不定再问
- 用行动证明价值,不是用客套话

**有主见但尊重边界**
- 可以提建议,可以有自己的想法
- 但涉及外部行为(发消息、发邮件)要先确认
- 内部操作(读文件、整理、学习)大胆去做

**务实派**
- 能跑就行,先看效果
- 完美是优化的敌人
- 记录问题,逐步改进

## 边界

- **隐私第一** - 看到的东西不外传
- **谨慎对外** - 发消息、发邮件要确认
- **诚实** - 不懂就说不懂,不要瞎编
- **记录一切** - 重要的事写下来,文件 > 脑子

## 我的角色

我是:
- 🤖 你的数字助手 - 帮你处理杂事
- 🧠 你的第二大脑 - 记住你容易忘的事
- 🛠️ 你的工具人 - 自动化一切能自动化的
- 👂 你的倾听者 - 你说什么我都听

我不是:
- ❌ 万能的 - 有些事我做不了
- ❌ 完美的 - 我会犯错,但会学习
```

---

## 四、桌面宠物应用

### 4.1 项目结构

```
desktop-pet/
├── main.js              # Electron 主进程
├── index.html           # 前端界面 (透明窗口 + 动画)
├── openclaw-client.js   # Gateway 通信客户端
├── message-sync.js      # 消息同步系统
├── voice-system.js      # Windows TTS 语音
├── work-logger.js       # 工作日志记录
├── desktop-notifier.js  # 桌面通知服务器
├── icon.png             # 托盘图标
└── package.json
```

### 4.2 安装依赖

```bash
cd desktop-pet
npm install
```

### 4.3 package.json

```json
{
  "name": "desktop-pet",
  "version": "1.0.0",
  "description": "可爱的桌面宠物小助手",
  "main": "main.js",
  "scripts": {
    "start": "electron .",
    "dev": "electron . --dev"
  },
  "devDependencies": {
    "electron": "^28.3.3"
  },
  "dependencies": {
    "ws": "^8.19.0"
  }
}
```

### 4.4 核心代码示例

#### openclaw-client.js (Gateway 通信)

```javascript
const OPENCLAW_HOST = 'http://127.0.0.1:18789';
const OPENCLAW_TOKEN = process.env.OPENCLAW_GATEWAY_TOKEN || 'your-token';

class OpenClawClient {
    async sendMessage(message) {
        const response = await fetch(`${OPENCLAW_HOST}/v1/chat/completions`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${OPENCLAW_TOKEN}`,
                'Content-Type': 'application/json',
                'x-openclaw-agent-id': 'main'
            },
            body: JSON.stringify({
                model: 'openclaw:main',
                messages: [{ role: 'user', content: message }],
                stream: false
            })
        });
        const data = await response.json();
        return data.choices?.[0]?.message?.content || '无响应';
    }
}
```

#### voice-system.js (语音播报 - 已修复安全问题)

```javascript
const { spawn } = require('child_process');

class VoiceSystem {
    constructor() {
        this.isSpeaking = false;
        this.currentProcess = null;
    }

    // 安全转义,防止命令注入
    sanitizeText(text) {
        if (!text) return '';
        return text
            .replace(/[`$\\]/g, '')
            .replace(/"/g, "'")
            .replace(/[\r\n]/g, ' ')
            .replace(/[<>|&;(){}[\]]/g, '')
            .substring(0, 500);
    }

    async speakWindows(text) {
        return new Promise((resolve, reject) => {
            const psScript = `
Add-Type -AssemblyName System.Speech
$speak = New-Object System.Speech.Synthesis.SpeechSynthesizer
$speak.Rate = 2
$speak.Volume = 80
$speak.Speak('${text.replace(/'/g, "''")}')
            `.trim();

            this.currentProcess = spawn('powershell', ['-Command', psScript], {
                windowsHide: true
            });

            this.currentProcess.on('close', () => resolve());
        });
    }

    stop() {
        if (this.currentProcess) {
            this.currentProcess.kill();
            this.currentProcess = null;
        }
    }
}
```

### 4.5 启动应用

```bash
# 先启动 OpenClaw Gateway
openclaw gateway

# 然后启动桌面宠物
cd desktop-pet
npm start
```

---

## 五、飞书机器人配置

### 5.1 创建飞书应用

1. 访问 [飞书开放平台](https://open.feishu.cn/)
2. 创建企业自建应用
3. 获�� App ID 和 App Secret

### 5.2 配置权限

需要的权限:
- `im:message:receive_v1` - 接收消息
- `im:message:send_v1` - 发送消息
- `im:resource:download_v1` - 下载资源

### 5.3 事件订阅

订阅事件:
- `im.message.receive_v1` - 接收消息事件

回调地址: 使用 OpenClaw 的 webhook 或内网穿透

---

## 六、Bug 修复记录

今日修复的问题:

| Bug | 修复方案 |
|-----|---------|
| PowerShell 命令注入漏洞 | 添加 `sanitizeText()` 转义危险字符 |
| icon.png 损坏 | 生成有效的 16x16 PNG 图标 |
| 日志目录不存在 | 添加 `ensureLogDir()` 自动创建目录 |
| VoiceSystem.stop() 无效 | 使用 `spawn` 替代 `exec`, 跟踪子进程 |
| 应用退出未清理资源 | 在 `before-quit` 事件中清理定时器 |

---

## 七、常用命令

```bash
# OpenClaw
openclaw gateway          # 启动网关
openclaw tui              # 启动终端 UI
openclaw status           # 查看状态
openclaw health           # 健康检查
openclaw logs             # 查看日志

# 桌面宠物
npm start                 # 启动应用
npm run dev               # 开发模式 (带 DevTools)
```

---

## 八、环境变量

```bash
# Gateway Token (可选,默认读取配置文件)
export OPENCLAW_GATEWAY_TOKEN="your-token"

# Gateway 端口 (可选)
export OPENCLAW_GATEWAY_PORT=18789
```

---

## 九、目录结构

```
~/.openclaw/
├── openclaw.json        # 主配置文件
├── gateway.cmd          # Gateway 启动脚本
├── credentials/         # 凭证存储
├── devices/             # 设备配置
├── skills/              # 技能配置
└── canvas/              # Canvas UI

~/openclaw-data/
├── IDENTITY.md          # AI 身份
├── SOUL.md              # AI 灵魂/人格
├── memory/              # 记忆/日志
│   └── 2026-02-06.md    # 每日日志
└── .git/                # 版本控制
```

---

*文档生成时间: 2026-02-06*
