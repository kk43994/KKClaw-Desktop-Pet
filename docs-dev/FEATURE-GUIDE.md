# 🦞 KKClaw Desktop Pet 全方位功能介绍

**完整技术文档 + 使用指南 + 最佳实践**

---

## 📚 目录

1. [核心概念](#核心概念)
2. [UI系统详解](#ui系统详解)
3. [情绪与表情系统](#情绪与表情系统)
4. [智能语音系统](#智能语音系统)
5. [KKClaw Switch集成](#kkclaw-switch集成)
6. [工具栏与交互](#工具栏与交互)
7. [稳定性系统](#稳定性系统)
8. [配置与定制](#配置与定制)
9. [使用场景](#使用场景)
10. [技术架构](#技术架构)

---

## 核心概念

### 什么是KKClaw Desktop Pet？

**一句话总结**：给OpenClaw AI一个可视化的身体，让AI从聊天框走到桌面上。

**设计哲学**：
- **空气感** — 像桌面歌词，存在但不打扰
- **有温度** — 不是工具，是伙伴
- **高效率** — 7×24运行，永不掉线
- **可定制** — 从外观到行为，完全可控

**核心价值**：
1. **视觉化** — 把AI的状态、情绪、思考过程可视化
2. **陪伴感** — 不是用完就关的工具，而是长期陪伴的存在
3. **效率提升** — 快捷操作（截图、语音、模型切换）
4. **情感连接** — 7种情绪、38种表情，让AI有了"人格"

---

## UI系统详解

### 双窗口架构

#### 设计理念

传统桌面宠物的问题：
- ❌ 单窗口占用空间大
- ❌ 遮挡工作区域
- ❌ 交互不便

KKClaw的解决方案：
- ✅ 精灵窗口（200×220px）— 最小化视觉占用
- ✅ 歌词窗口（400×100px）— 完全鼠标穿透
- ✅ 拖动同步 — 两窗口联动

---

### 精灵窗口（Pet Window）

**尺寸**：200px × 220px  
**特性**：半透明背景、永远置顶、可拖动

#### 组成部分

**1. 琉璃球体（67px）**

```
结构分层（由内到外）：
┌─────────────────────────────┐
│ Layer 1: 内部流体层          │
│  - blob1 (20×20px 圆形)     │
│  - blob2 (30×30px 椭圆)     │
│  - 动画速度: 20s / 25s      │
│  - 无限循环动画              │
└─────────────────────────────┘
        ↓
┌─────────────────────────────┐
│ Layer 2: 玻璃外壳           │
│  - 3层径向渐变               │
│  - 主高光 (35% at 18%)      │
│  - 副高光 (20% at 12%)      │
│  - 1.5px半透明border        │
└─────────────────────────────┘
        ↓
┌─────────────────────────────┐
│ Layer 3: 外部发光           │
│  - 内发光 (inset)            │
│  - 外发光 (blur 15px)       │
│  - 颜色随mood动态变化       │
└─────────────────────────────┘
```

**视觉效果**：
- 琉璃质感：3层渐变 + 双重高光
- 流体动画：内部blob缓慢移动
- 发光效果：根据情绪变色

**技术实现**：
```css
.pet-ball {
  width: 67px;
  height: 67px;
  border-radius: 50%;
  background: radial-gradient(
    circle at 35% 18%,
    rgba(255,255,255,0.8) 0%,
    rgba(255,255,255,0) 15%
  ),
  radial-gradient(...), /* 主体渐变 */
  linear-gradient(...); /* blob层 */
  box-shadow: 
    inset 0 -10px 30px rgba(255,255,255,0.2),
    0 0 15px currentColor;
  animation: colorShift 1s ease-in-out;
}
```

---

**2. 胶囊形眼睛**

**设计**：
- 形状：11px × 19px 胶囊（圆角矩形）
- 颜色：白色 + 发光效果
- 位置：球体中心偏上
- 间距：30px

**15+种表情**：

| 表情 | 尺寸 | 特殊效果 | 动画 |
|------|------|----------|------|
| normal | 11×19px | - | - |
| blink | 12×3px | 快速压扁 | 0.1s |
| happy | 13×7px | 圆角7px 7px 3px 3px | 弯眼微笑 |
| surprised | 13×21px | 放大110% | 瞪大眼 |
| thinking | 10×17px | 向上移动-3px | 眯眼思考 |
| sleepy | 12×4px | 向下移动2px | 半闭眼 |
| sparkle | 12×12px | 旋转45deg | 星星眼 |
| wink | 左13×7px, 右11×19px | 单侧happy | 眨眼 |
| love | 14×13px | 旋转45deg + 圆角 | 爱心眼 |
| angry | 12×14px | 旋转±12deg | 生气皱眉 |
| dizzy | 10×10px | 旋转±25deg | 头晕旋转 |
| cross | 10×3px | 旋转±30deg | X眼装死 |

**技术实现**：
```javascript
function setEyes(type, params = {}) {
  const leftEye = document.querySelector('.eye-left');
  const rightEye = document.querySelector('.eye-right');
  
  switch(type) {
    case 'happy':
      leftEye.style.width = '13px';
      leftEye.style.height = '7px';
      leftEye.style.borderRadius = '7px 7px 3px 3px';
      break;
    // ... 其他表情
  }
}
```

---

**3. SVG图标工具栏**

**默认状态**：隐藏（opacity: 0）  
**hover触发**：淡入展开（0.3s transition）  
**图标尺寸**：26px × 26px

**4个图标**：

| 图标 | 功能 | 快捷键 | 说明 |
|------|------|--------|------|
| 💬 | 打开聊天 | Ctrl+Shift+C | 聚焦到飞书/Telegram对话 |
| 📸 | 截图上传 | Ctrl+Shift+S | 截图 → 自动上传到飞书 |
| 🎤 | 语音切换 | Ctrl+Shift+V | 切换TTS引擎/音色 |
| ⚙️ | 设置面板 | Ctrl+Shift+P | 打开配置界面 |

**技术实现**：
```html
<div class="toolbar" onmouseenter="showToolbar()">
  <div class="tool-icon" onclick="openChat()">
    <svg>...</svg>
  </div>
  <!-- 其他图标 -->
</div>
```

---

### 歌词窗口（Lyrics Window）

**尺寸**：400px × 100px（可自动扩展高度）  
**特性**：完全鼠标穿透、无边框、透明背景

#### 核心特性

**1. 完全鼠标穿透**

```javascript
lyricsWindow.setIgnoreMouseEvents(true, {
  forward: true  // 转发鼠标事件到下层窗口
});
```

**效果**：
- ✅ 鼠标可以点击穿过窗口
- ✅ 可以拖动下层窗口
- ✅ 可以编辑穿过的文档
- ✅ 完全不妨碍操作

**2. 白字描边（8重叠加）**

```css
.lyrics-text {
  color: white;
  text-shadow:
    -1px -1px 0 #000,  
     1px -1px 0 #000,
    -1px  1px 0 #000,
     1px  1px 0 #000,
     0   -2px 3px #000,
     0    2px 3px #000,
    -2px  0   3px #000,
     2px  0   3px #000;
  font-size: 16px;
  font-weight: 600;
}
```

**效果**：
- ✅ 任何背景都清晰���见
- ✅ 白色壁纸、黑色壁纸都能看清
- ✅ 复杂图片背景也不影响

**3. 打字机效果**

```javascript
async function typeText(text) {
  lyricsElement.textContent = '';
  for (let char of text) {
    lyricsElement.textContent += char;
    await sleep(50); // 每字符50ms
  }
}
```

**效果**：
- 逐字出现
- 支持emoji
- 自动换行
- 动态高度调整

---

### 窗口同步机制

**拖动同步**：

```javascript
// 精灵窗口监听拖动
mainWindow.on('move', () => {
  const [x, y] = mainWindow.getPosition();
  
  // 通知歌词窗口跟随
  ipcMain.emit('drag-pet', { x, y });
});

// 歌词窗口接收
ipcMain.on('drag-pet', (event, { x, y }) => {
  lyricsWindow.setPosition(x + 50, y + 100); // 偏移位置
});
```

**效果**：
- 拖动精灵窗口 → 歌词窗口实时跟随
- 无延迟、无卡顿
- 两窗口保持相对位置

---

## 情绪与表情系统

### 7种情绪状态（Mood System）

#### 情绪定义

| 情绪 | 英文 | 颜色代码 | 触发条件 | 持续时间 |
|------|------|----------|----------|----------|
| 闲置 | idle | `#ff6b6b` → `#ff8c42` | 无任务 | 持续 |
| 开心 | happy | `#ffd93d` → `#ff6f3c` | 收到消息、任务完成 | 5秒 |
| 对话 | talking | `#ff4d94` → `#ff6ec7` | 语音播放中 | 直到播放��束 |
| 思考 | thinking | `#a78bfa` → `#6366f1` | AI生成内容中 | 直到生成完成 |
| 困了 | sleepy | `#b8987c` → `#8b7d6b` | 23:00-8:00 深夜 | 持续 |
| 惊讶 | surprised | `#ffb84d` → `#ff9500` | 收到@提醒、错误 | 3秒 |
| 离线 | offline | `#b0b0b0` | OpenClaw未连接 | 直到重连 |

#### 颜色过渡动画

**问题**：CSS `transition` 不支持 `linear-gradient` 过渡

**解决方案**：动态生成 `@keyframes`

```javascript
function createColorTransition(fromColor, toColor) {
  const animName = `colorShift-${Date.now()}`;
  const keyframes = `
    @keyframes ${animName} {
      from { background: ${fromColor}; }
      to { background: ${toColor}; }
    }
  `;
  
  // 注入样式表
  const style = document.createElement('style');
  style.textContent = keyframes;
  document.head.appendChild(style);
  
  // 应用动画（三层独立时间）
  petBall.style.animation = `${animName} 1.0s ease-in-out forwards`;
  blob1.style.animation = `${animName} 0.8s ease-in-out forwards`;
  blob2.style.animation = `${animName} 1.2s ease-in-out forwards`;
}
```

**效果**：
- ✅ 1秒平滑过渡
- ✅ 三层独立动画速度（0.8s/1.0s/1.2s）
- ✅ 自然的颜色渐变（红→橙→黄风格）

---

### 38个待机表情动画

#### 触发机制

```javascript
setInterval(() => {
  if (currentMood === 'idle' && Math.random() < 0.3) {
    // 30%概率触发
    const randomAct = idleActs[Math.floor(Math.random() * 38)];
    randomAct();
  }
}, 4000); // 每4秒检查一次
```

#### 动画分类

**A类：眼睛动画（14个）**

1. **左右张望** — 左眼→右眼→中心，各0.3s
2. **好奇歪头** — 整个球体rotate(-5deg) + 眼睛thinking
3. **快速扫视** — 左右快速切换3次，0.1s/次
4. **上下看** — 眼睛translateY(±5px)
5. **眨眼** — blink 0.1s
6. **双眨** — blink → 0.2s → blink
7. **三连眨** — blink → blink → blink
8. **懒洋洋眨眼序列** — blink(0.3s) → 停顿1s → blink(0.2s) → 停顿0.5s → blink(0.15s)
9. **左看** — 左眼normal, 右眼thinking
10. **右看** — 左眼thinking, 右眼normal
11. **仰望** — translateY(-5px) + surprised
12. **俯视** — translateY(5px) + sleepy
13. **眯眼偷看** — sleepy → 停顿 → wink
14. **环顾四周** — 左→上→右→下→中心

**B类：表情组合（12个）**

15. **开心→惊讶** — happy(1s) → surprised(0.5s) → happy(0.5s)
16. **思考→闪亮** — thinking(1.5s) → sparkle(0.3s) → thinking(0.5s)
17. **困→惊醒** — sleepy(1s) → surprised(0.2s) → normal(0.3s)
18. **害羞脸红** — wink + scale(0.95) + 球体颜色变粉
19. **得意脸** — wink + rotate(3deg)
20. **生气→呼吸** — angry(0.8s) → scale(1.05) → scale(0.95) → normal
21. **困惑→恍然** — thinking → rotate(-8deg) → surprised → happy
22. **悲伤→恢复** — sleepy + scale(0.9) → blink → normal
23. **狡黠微笑** — wink + rotate(5deg) + 小幅度bounce
24. **星星眼→咯咯笑** — sparkle(0.5s) → happy + bounce(3次)
25. **困惑歪头** — thinking + rotate(-10deg) + 停顿
26. **哇塞→好奇** — surprised(0.3s) → sparkle(0.2s) → thinking

**C类：情感表达（6个）**

27. **爱心眼+脸红** — love(1s) + 球体变粉 + scale(1.05)
28. **生气跺脚** — angry + translateY(5px快速) × 2
29. **装死** — cross(2s) + rotate(90deg) + opacity(0.5)
30. **头晕目眩** — dizzy + rotate(360deg, 2s) + scale(0.9)
31. **扫描周围** — 眼睛快速360度旋转 + thinking
32. **开心蹦跶** — happy + translateY(-10px) bounce 3次

**D类：复杂序列（6个）**

33. **伸懒腰** — scale(1.1, 1.5s缓慢) → scale(1.0, 0.5s) + sleepy
34. **摇头** — rotate(-15deg) → rotate(15deg) → rotate(-15deg) → 0deg
35. **点头确认** — translateY(3px) → 0 → translateY(3px) → 0
36. **向上bounce** — translateY(-15px) → 0 (弹性动画)
37. **吃东西** — surprised → love + scale(1.05) → happy + 脸红
38. **装死→复活** — cross + rotate(90deg) → surprised + rotate(0deg) + bounce

---

#### 示例代码

```javascript
const idleActs = [
  // 1. 左右张望
  () => {
    setEyes('normal', { look: 'left' });
    setTimeout(() => setEyes('normal', { look: 'right' }), 300);
    setTimeout(() => setEyes('normal'), 600);
  },
  
  // 15. 开心→惊讶
  () => {
    setEyes('happy');
    setMood('happy');
    setTimeout(() => setEyes('surprised'), 1000);
    setTimeout(() => {
      setEyes('happy');
      setMood('idle');
    }, 1500);
  },
  
  // 27. 爱心眼+脸红
  () => {
    setEyes('love');
    petBall.style.filter = 'hue-rotate(20deg)'; // 变粉
    petBall.style.transform = 'scale(1.05)';
    setTimeout(() => {
      setEyes('normal');
      petBall.style.filter = '';
      petBall.style.transform = 'scale(1)';
    }, 1000);
  }
];
```

---

## 智能语音系统

### 三级降级架构

```
优先级1: MiniMax Speech 2.5 Turbo
   ↓ 失败/超时
优先级2: DashScope CosyVoice
   ↓ 失败/超时
优先级3: Edge TTS（本地）
```

---

### MiniMax Speech 2.5 Turbo

#### 配置

```json
{
  "voice": {
    "engine": "minimax",
    "minimax": {
      "apiKey": "sk-api--xxxxx",
      "groupId": "2020139946483921771",
      "voiceId": "xiaotuantuan_minimax",
      "model": "speech-2.5-turbo-preview",
      "speed": 1.1,
      "vol": 3.0,
      "emotion": "happy"
    }
  }
}
```

#### 克隆音色流程

**第一步：上传音频**

```bash
POST https://api.minimax.chat/v1/files/upload
Content-Type: multipart/form-data

{
  "file": "xiaotuantuan_nav.mp3",  # 81秒，有背景音乐也OK
  "purpose": "voice_clone"
}

Response:
{
  "file_id": "364335525450134"
}
```

**第二步：创建音色**

```bash
POST https://api.minimax.chat/v1/voice_clone
{
  "file_id": "364335525450134",
  "voice_name": "xiaotuantuan_minimax"
}

Response:
{
  "voice_id": "xiaotuantuan_minimax",
  "status": "processing"
}
```

等待5-10分钟，音色创建完成。

**第三步：使用**

```bash
POST https://api.minimax.chat/v1/t2a_v2
{
  "model": "speech-2.5-turbo-preview",
  "text": "KK，我看到你的消息啦！<#0.5#>现在开始帮你处理",
  "voice_setting": {
    "voice_id": "xiaotuantuan_minimax",
    "speed": 1.1,
    "vol": 3.0,
    "emotion": "happy"
  }
}
```

#### 7种情感

| 情感 | 适用场景 | 示例文本 |
|------|----------|----------|
| happy | 任务完成、收到好消息 | "太好了！已经搞定~" |
| sad | 失败、错误 | "抱歉，出了点问题..." |
| angry | 警告、紧急 | "注意！系统资源不足！" |
| fearful | 不确定、担心 | "这个操作可能有风险..." |
| disgusted | 拒绝、不推荐 | "这个方案不太合适" |
| surprised | 意外、发现 | "哇！发现了新功能！" |
| calm | 平静、说明 | "让我为你解释一下" |

#### 自动情感识别

```javascript
function detectEmotion(text) {
  // 开心
  if (/太好|成功|完成|搞定|耶|棒|赞/.test(text)) {
    return 'happy';
  }
  // 惊讶
  if (/哇|天哪|什么|！？|竟然/.test(text)) {
    return 'surprised';
  }
  // 悲伤
  if (/失败|错误|抱歉|遗憾|可惜/.test(text)) {
    return 'sad';
  }
  // 默认平静
  return 'calm';
}
```

#### 停顿控制

```javascript
const text = "KK，我看到你的消息啦！<#0.5#>现在开始帮你处理<#0.3#>稍等一下哦";
// 会在"啦"后停顿0.5秒，"理"后停顿0.3秒
```

#### 费用

- **TTS费用**：2元/万字符
- **克隆费用**：9.9元/音色（一次性）
- **同音色切换**：HD ↔ Turbo 免费

---

### DashScope CosyVoice

#### 配置

```json
{
  "voice": {
    "engine": "dashscope",
    "dashscope": {
      "apiKey": "sk-aa02695435f240558af5218319a60b56",
      "model": "cosyvoice-v3-plus",
      "voice": "cosyvoice-v3-plus-tuantuan-xxx"
    }
  }
}
```

#### 使用

```python
from dashscope.audio.tts_v2 import SpeechSynthesizer

synthesizer = SpeechSynthesizer(
    model='cosyvoice-v3-plus',
    voice='cosyvoice-v3-plus-tuantuan-xxx'
)

audio = synthesizer.call(text="KK，我看到你的消息啦")
audio_data = synthesizer.get_audio_data()

with open('output.wav', 'wb') as f:
    f.write(audio_data)
```

#### 费用

- **免费额度**：每月500万字符
- **超出后**：按量计费

---

### Edge TTS（降级方案）

```bash
edge-tts --voice zh-CN-XiaoxiaoNeural --text "KK收到" --write-media output.mp3
```

- **优点**：完全免费，本地运行
- **缺点**：音质一般，无法克隆

---

### 语音播报流程

```javascript
async function speak(text) {
  // 1. 设置mood为talking
  setMood('talking');
  
  // 2. 自动检测情感
  const emotion = detectEmotion(text);
  
  // 3. 三级降级
  let audioPath;
  try {
    audioPath = await minimaxTTS(text, emotion);
  } catch (e) {
    console.warn('MiniMax失败，降级到DashScope');
    try {
      audioPath = await dashscopeTTS(text);
    } catch (e2) {
      console.warn('DashScope失败，降级到Edge');
      audioPath = await edgeTTS(text);
    }
  }
  
  // 4. 播放音频
  await playAudio(audioPath);
  
  // 5. 显示歌词（打字机效果）
  await typeText(text);
  
  // 6. 恢复idle
  setMood('idle');
}
```

---

## KKClaw Switch集成

### 什么是KKClaw Switch？

**问题**：AI模型切换需要：
1. 打开配置文件
2. 修改provider
3. 重启Gateway
4. 等待30秒

**KKClaw Switch解决方案**：
- 点击切换 → 3秒生效
- 无需编辑文件
- 自动重启
- 对话不中断

---

### 工作原理

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│ KKClaw Switch│ →   │ SQLite DB    │ →   │ Auto Monitor │
│ 选择provider │     │ 保存选择     │     │ 每2秒检测     │
└──────────────┘     └──────────────┘     └──────────────┘
                                                   ↓
                                          ┌──────────────┐
                                          │ Sync Script  │
                                          │ 读取DB       │
                                          └──────────────┘
                                                   ↓
                                          ┌──────────────┐
                                          │ OpenClaw     │
                                          │ 更新config   │
                                          │ 重启Gateway  │
                                          └──────────────┘
```

---

### 集成方式

#### 自动同步（推荐）

**桌面龙虾启动时自动开启监听器**：

```javascript
// main.js
const { spawn } = require('child_process');

let syncWatcher;

app.on('ready', () => {
  // 启动自动同步监听器
  syncWatcher = spawn('node', [
    path.join(__dirname, 'kkclaw-auto-sync.js')
  ], {
    detached: false,
    stdio: 'inherit'
  });
  
  console.log('✅ KKClaw auto-sync started');
});

app.on('will-quit', () => {
  // 关闭时停止监听器
  if (syncWatcher) {
    syncWatcher.kill();
  }
});
```

**监听器代码**：

```javascript
// kkclaw-auto-sync.js
const Database = require('better-sqlite3');
const { execSync } = require('child_process');
const path = require('path');
const os = require('os');

const DB_PATH = path.join(os.homedir(), '.cc-switch', 'cc-switch.db');
let lastProvider = null;

setInterval(() => {
  try {
    const db = new Database(DB_PATH, { readonly: true });
    const row = db.prepare('SELECT name FROM active_provider LIMIT 1').get();
    db.close();
    
    const currentProvider = row?.name;
    
    if (currentProvider && currentProvider !== lastProvider) {
      console.log(`🔄 Provider changed: ${lastProvider} → ${currentProvider}`);
      
      // 执行同步
      execSync('node kkclaw-hotswitch.js --restart', {
        cwd: __dirname,
        stdio: 'inherit'
      });
      
      lastProvider = currentProvider;
    }
  } catch (e) {
    // DB文件不存在或读取失败，等待下次检查
  }
}, 2000); // 每2秒检查
```

---

#### 手动同步（可选）

```bash
# 方式1：只同步config，不重启
node kkclaw-hotswitch.js

# 方式2：同步 + 重启Gateway
node kkclaw-hotswitch.js --restart
```

**同步脚本**：

```javascript
// kkclaw-hotswitch.js
const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { execSync } = require('child_process');

// 1. 读取KKClaw Switch DB
const dbPath = path.join(os.homedir(), '.cc-switch', 'cc-switch.db');
const db = new Database(dbPath, { readonly: true });
const row = db.prepare('SELECT name FROM active_provider LIMIT 1').get();
db.close();

const activeProvider = row?.name;
if (!activeProvider) {
  console.error('❌ No active provider found');
  process.exit(1);
}

// 2. 读取OpenClaw config
const configPath = path.join(os.homedir(), '.openclaw', 'openclaw.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

// 3. 更新defaultProvider
config.defaultProvider = activeProvider;

// 4. 写回config
fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
console.log(`✅ Synced: defaultProvider = ${activeProvider}`);

// 5. 重启Gateway（如果指定--restart）
if (process.argv.includes('--restart')) {
  console.log('🔄 Restarting OpenClaw Gateway...');
  try {
    execSync('openclaw gateway restart', { stdio: 'inherit' });
    console.log('✅ Gateway restarted');
  } catch (e) {
    console.error('❌ Restart failed:', e.message);
  }
}
```

---

### 使用场景

**场景1：快速切换模型**

```
你：需要写长文档
操作：KKClaw Switch → 选择 Claude Opus 4
结果：3秒后生效，开始使用Opus写作

你：需要快速回答
操作：KKClaw Switch → 选择 GPT-5.3
结果：3秒后生效，切换到GPT
```

**场景2：成本优化**

```
普通任务：使用 deepseek-chat（便宜）
复杂任务：使用 claude-opus-4（贵但强）
代码任务：使用 gpt-5.3-codex（专业）
```

**场景3：多API密钥管理**

```
Provider 1: 俱乐部自用统一（gptclubapi中转）
Provider 2: 官方API（OpenAI/Anthropic）
Provider 3: 本地模型（Ollama）
```

---

## 工具栏与交互

### 右键菜单

**完整菜单项**：

```javascript
const contextMenu = Menu.buildFromTemplate([
  {
    label: '🎨 设置情绪',
    submenu: [
      { label: '🔴 闲置 (Idle)', click: () => setMood('idle') },
      { label: '🟡 开心 (Happy)', click: () => setMood('happy') },
      { label: '💗 对话 (Talking)', click: () => setMood('talking') },
      { label: '🔵 思考 (Thinking)', click: () => setMood('thinking') },
      { label: '🤎 困了 (Sleepy)', click: () => setMood('sleepy') },
      { label: '🟠 惊讶 (Surprised)', click: () => setMood('surprised') },
      { label: '⚫ 离线 (Offline)', click: () => setMood('offline') }
    ]
  },
  { type: 'separator' },
  {
    label: '🎙️ 语音设置',
    submenu: [
      { label: '🎤 MiniMax Turbo', click: () => setVoice('minimax') },
      { label: '🔊 DashScope', click: () => setVoice('dashscope') },
      { label: '📢 Edge TTS', click: () => setVoice('edge') }
    ]
  },
  { type: 'separator' },
  {
    label: '📸 截图上传',
    accelerator: 'Ctrl+Shift+S',
    click: () => takeScreenshot()
  },
  {
    label: '💬 打开聊天',
    accelerator: 'Ctrl+Shift+C',
    click: () => openChat()
  },
  { type: 'separator' },
  {
    label: '🔁 KKClaw Switch',
    click: () => openKKClawSwitch()
  },
  {
    label: '⚙️ 设置',
    accelerator: 'Ctrl+Shift+P',
    click: () => openSettings()
  },
  { type: 'separator' },
  {
    label: '🔄 重启',
    click: () => app.relaunch(); app.quit();
  },
  {
    label: '❌ 退出',
    accelerator: 'Ctrl+Q',
    click: () => app.quit()
  }
]);
```

---

### 截图上传功能

**流程**：

```
1. 触发（Ctrl+Shift+S 或点击图标）
   ↓
2. 全屏截图（pyautogui或PowerShell）
   ↓
3. 保存临时文件
   ↓
4. 调用飞书上传API
   ↓
5. 获取image_key
   ↓
6. 发送到飞书对话
   ↓
7. 删除临时文件
```

**代码**：

```javascript
async function takeScreenshot() {
  try {
    // 1. 截图
    const tempPath = path.join(os.tmpdir(), `screenshot-${Date.now()}.png`);
    await execAsync(`python -c "import pyautogui; pyautogui.screenshot('${tempPath}')"`);
    
    // 2. 上传到飞书
    const imageKey = await uploadToFeishu(tempPath);
    
    // 3. 发送消息
    await sendFeishuMessage({
      msg_type: 'image',
      content: {
        image_key: imageKey
      }
    });
    
    // 4. 清理
    fs.unlinkSync(tempPath);
    
    console.log('✅ Screenshot uploaded');
  } catch (e) {
    console.error('❌ Screenshot failed:', e);
  }
}
```

---

## 稳定性系统

### 自动重启机制

#### Electron进程崩溃

```javascript
// main.js
process.on('uncaughtException', (error) => {
  console.error('💥 Uncaught Exception:', error);
  
  // 记录日志
  fs.appendFileSync('logs/crash.log', `${new Date().toISOString()} ${error.stack}\n`);
  
  // 5秒后重启
  setTimeout(() => {
    app.relaunch();
    app.exit(0);
  }, 5000);
});
```

#### OpenClaw Gateway挂掉

```javascript
// gateway-guardian.js
setInterval(async () => {
  try {
    const response = await fetch('http://localhost:3000/health');
    if (!response.ok) throw new Error('Gateway unhealthy');
  } catch (e) {
    console.warn('🚨 Gateway down, restarting...');
    
    execSync('openclaw gateway restart', { stdio: 'inherit' });
    
    // 等待30秒启动
    await sleep(30000);
  }
}, 60000); // 每分钟检查
```

---

### 日志轮转

**策略**：
- 每日轮转
- 保留7天
- 单文件10MB限制
- 自动压缩为.gz

```javascript
// log-rotation.js
const winston = require('winston');
require('winston-daily-rotate-file');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.DailyRotateFile({
      filename: 'logs/app-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxSize: '10m',
      maxFiles: '7d',
      zippedArchive: true
    }),
    new winston.transports.DailyRotateFile({
      level: 'error',
      filename: 'logs/error-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxSize: '10m',
      maxFiles: '30d',
      zippedArchive: true
    })
  ]
});
```

---

### 性能监控

```javascript
// performance-monitor.js
setInterval(() => {
  const cpuUsage = process.cpuUsage();
  const memUsage = process.memoryUsage();
  
  const cpuPercent = (cpuUsage.user + cpuUsage.system) / 1000000 / 1; // 简化计算
  const memMB = memUsage.heapUsed / 1024 / 1024;
  
  // 记录
  logger.info('Performance', {
    cpu: cpuPercent.toFixed(2) + '%',
    memory: memMB.toFixed(2) + 'MB',
    uptime: process.uptime()
  });
  
  // 告警
  if (cpuPercent > 80) {
    logger.warn('⚠️ High CPU usage:', cpuPercent);
  }
  if (memMB > 500) {
    logger.warn('⚠️ High memory usage:', memMB);
  }
}, 60000); // 每分钟
```

---

### 缓存管理

```javascript
// cache-manager.js
const cron = require('node-cron');

// 每天凌晨3点清理
cron.schedule('0 3 * * *', () => {
  const tempDir = path.join(__dirname, 'temp');
  const files = fs.readdirSync(tempDir);
  
  let cleaned = 0;
  files.forEach(file => {
    const filePath = path.join(tempDir, file);
    const stat = fs.statSync(filePath);
    
    // 删除超过24小时的文件
    if (Date.now() - stat.mtimeMs > 24 * 60 * 60 * 1000) {
      fs.unlinkSync(filePath);
      cleaned++;
    }
  });
  
  logger.info(`🧹 Cleaned ${cleaned} temp files`);
});
```

---

## 配置与定制

### 配置文件结构

```json
{
  "openclaw": {
    "gateway": "http://localhost:3000",
    "sessionKey": "main",
    "checkInterval": 2000,
    "reconnectDelay": 5000
  },
  
  "window": {
    "position": { "x": 100, "y": 100 },
    "lyricsOffset": { "x": 50, "y": 100 },
    "alwaysOnTop": true,
    "opacity": 1.0,
    "clickThrough": false
  },
  
  "appearance": {
    "ballSize": 67,
    "defaultMood": "idle",
    "enableIdleAnimations": true,
    "animationSpeed": 1.0
  },
  
  "voice": {
    "engine": "minimax",
    "enabled": true,
    "autoEmotion": true,
    "minimax": {
      "apiKey": "sk-api--xxxxx",
      "groupId": "2020139946483921771",
      "voiceId": "xiaotuantuan_minimax",
      "model": "speech-2.5-turbo-preview",
      "speed": 1.1,
      "vol": 3.0,
      "emotion": "happy"
    },
    "dashscope": {
      "apiKey": "sk-xxxxxxxxxx",
      "model": "cosyvoice-v3-plus",
      "voice": "cosyvoice-v3-plus-tuantuan-xxx"
    },
    "edge": {
      "voice": "zh-CN-XiaoxiaoNeural"
    }
  },
  
  "feishu": {
    "enabled": true,
    "autoUpload": true
  },
  
  "performance": {
    "fps": 60,
    "enableMonitoring": true,
    "logLevel": "info"
  }
}
```

---

### 自定义音色

**步骤1：准备音频**

要求：
- 格式：MP3/WAV
- 时长：30秒-5分钟
- 语言：清晰、无噪音
- 内容：自然对话（有背景音乐也可以）

**步骤2：上传克隆**

```bash
curl -X POST https://api.minimax.chat/v1/files/upload \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -F "file=@my_voice.mp3" \
  -F "purpose=voice_clone"

# 获得file_id后
curl -X POST https://api.minimax.chat/v1/voice_clone \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "file_id": "获得的file_id",
    "voice_name": "my_custom_voice"
  }'
```

**步骤3：配置使用**

```json
{
  "voice": {
    "minimax": {
      "voiceId": "my_custom_voice"
    }
  }
}
```

---

## 使用场景

### 场景1：专注工作模式

**需求**：长时间编程/写作，需要AI随时待命

**配置**：
- mood: thinking（保持专注状态）
- 禁用待机动画（减少干扰）
- 语音：calm情感

**操作**：
1. 右键 → 设置情绪 → 思考
2. 配置文件：`"enableIdleAnimations": false`
3. 需要时直接问问题，龙虾球会立即响应

---

### 场景2：深夜创作

**需求**：23:00后继续工作，需要陪伴但不打扰

**自动触发**：
- 23:00-8:00自动切换sleepy mood
- 降低语音音量
- 待机动画频率降低50%

**配置**：
```json
{
  "appearance": {
    "nightMode": {
      "enabled": true,
      "start": "23:00",
      "end": "08:00",
      "mood": "sleepy",
      "animationFrequency": 0.5
    }
  },
  "voice": {
    "minimax": {
      "vol": 2.0  // 降低音量
    }
  }
}
```

---

### 场景3：团队协作

**需求**：多人共享屏幕，需要展示AI助手

**配置**：
- 放大球体尺寸（便于观看）
- 启用所有动画（展示效果）
- 使用happy mood（积极氛围）

```json
{
  "appearance": {
    "ballSize": 100,  // 放大到100px
    "enableIdleAnimations": true,
    "defaultMood": "happy"
  }
}
```

---

### 场景4：多模型切换

**需求**：不同任务用不同模型

**工作流**：
1. 打开KKClaw Switch
2. 预设3个profile：
   - 写作：Claude Opus 4
   - 编程：GPT-5.3 Codex
   - 快问快答：DeepSeek Chat
3. 任务切换时点击切换，3秒生效

---

## 技术架构

### 技术栈

**前端**：
- Electron 28.x
- HTML5 + CSS3
- Vanilla JavaScript（无框架）

**后端**：
- Node.js 18.x
- SQLite（KKClaw Switch DB）
- Python 3.10（截图、TTS辅助）

**通信**：
- IPC（主进程 ↔ 渲染进程）
- HTTP/WebSocket（OpenClaw Gateway）
- REST API（MiniMax、DashScope）

**存储**：
- JSON配置文件
- SQLite数据库
- 本地日志文件

---

### 文件结构

```
desktop-pet/
├── main.js                    # Electron主进程
├── index.html                # 精灵窗口UI
├── lyrics.html               # 歌词窗口UI
├── model-settings.html       # 设置面板
│
├── voice/                    # 语音引擎
│   ├── minimax-tts.js
│   ├── dashscope-tts.js
│   ├── cosyvoice-tts.py
│   └── voice-system.js
│
├── utils/                    # 工具模块
│   ├── notify-desktop.js
│   ├── auto-notify.js
│   └── ...
│
├── scripts/                  # 脚本工具
│   ├── take_screenshots.py
│   └── ...
│
├── tests/                    # 测试
├── docs-dev/                 # 开发文档
├── archive/                  # 归档
│
├── kkclaw-hotswitch.js       # 模型切换脚本
├── kkclaw-auto-sync.js       # 自动同步监听器
├── create-shortcut.ps1       # 快捷方式生成
│
├── package.json
├── pet-config.json           # 配置文件（不提交）
└── README.md
```

---

### 数据流

```
┌─────────────────────────────────────────────────────────────┐
│                        User Actions                         │
│  (拖动/点击/右键/快捷键)                                       │
└────────────────────────────────────���────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    Electron Main Process                    │
│  - Window Management                                        │
│  - IPC Communication                                        │
│  - System Integration                                       │
└─────────────────────────────────────────────────────────────┘
         ↓                    ↓                    ↓
┌────────────────┐  ┌────────────────┐  ┌────────────────┐
│ Renderer (Pet) │  │ Renderer (Lyrics)│ │  Settings      │
│  - UI Render   │  │  - Text Display  │  │  - Config UI   │
│  - Animations  │  │  - Typewriter    │  │                │
└────────────────┘  └────────────────┘  └────────────────┘
         ↓                    ↓
┌─────────────────────────────────────────────────────────────┐
│                    OpenClaw Client                          │
│  - WebSocket Connection                                     │
│  - Message Sync                                             │
│  - Status Polling                                           │
└─────────────────────────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────────────────────────┐
│                    OpenClaw Gateway                         │
│  - AI Model Routing                                         │
│  - Session Management                                       │
│  - Plugin System                                            │
└─────────────────────────────────────────────────────────────┘
         ↓                    ↓                    ↓
┌────────────────┐  ┌────────────────┐  ┌────────────────┐
│  AI Providers  │  │  Voice APIs    │  │  Feishu API    │
│  (Claude/GPT)  │  │  (MiniMax/etc) │  │                │
└────────────────┘  └────────────────┘  └────────────────┘
```

---

## 开发路线图

### V2.1（计划中）

- [ ] 多主题皮肤系统
- [ ] 自定义颜色方案
- [ ] 更多待机动作（50+）
- [ ] 插件系统（允许第三方扩展）
- [ ] Linux/macOS支持

### V3.0（未来）

- [ ] 多龙虾球（团队模式）
- [ ] AR投影模式
- [ ] 手势识别交互
- [ ] 完整的情感AI系统

---

**文档版本**：2.0.3  
**最后更新**：2026-02-11  
**维护者**：小K
