// 18:04 能听到声音的版本
const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);
const path = require('path');
const fs = require('fs').promises;

class WorkingVoice {
    constructor() {
        this.isSpeaking = false;
        this.tempDir = path.join(__dirname, 'temp');
        this.voice = 'zh-CN-XiaoxiaoNeural';
        // 使用 python -m edge_tts 替代直接调用 edge-tts.exe
        this.usePythonModule = true;
        this.enabled = true; // 🔊 默认启用
        this.queue = []; // 🔊 播报队列
        this.maxQueueSize = 10; // 最多排队10条
        this.lastSpoken = '';    // 上次播报的内容
        this.lastSpokenTime = 0; // 上次播报的时间
        this.initTempDir();
    }

    async initTempDir() {
        try {
            await fs.mkdir(this.tempDir, { recursive: true });
        } catch (err) {}
    }

    async speak(text) {
        // 🔊 检查是否启用
        if (!this.enabled) {
            console.log('🔇 语音已关闭,跳过播放');
            return;
        }
        
        // 🎯 智能过滤 - 某些内容不需要播报
        if (this.shouldSkip(text)) {
            console.log('⏭️ 内容过滤,跳过播报');
            return;
        }
        
        // 🔊 队列管理
        if (this.isSpeaking) {
            if (this.queue.length < this.maxQueueSize) {
                this.queue.push(text);
                console.log(`📝 加入队列 (排队: ${this.queue.length})`);
            } else {
                console.log('⚠️ 队列已满,跳过');
            }
            return;
        }

        await this.speakNow(text);
        
        // 播报完成后处理队列
        await this.processQueue();
    }

    // 🎯 智能过滤
    shouldSkip(text) {
        // 过短的消息
        if (text.length < 2) return true;
        
        // 纯标点或空白
        if (/^[\s.,;!?。，；！？]+$/.test(text)) return true;
        
        // 纯数字或单个字符
        if (/^[0-9\s]+$/.test(text)) return true;
        
        // 重复的进度消息(避免过于频繁)
        if (this.lastSpoken === text && Date.now() - this.lastSpokenTime < 3000) {
            return true;
        }
        
        return false;
    }

    async speakNow(text) {
        this.isSpeaking = true;
        const startTime = Date.now();
        
        try {
            // 清理文本: 移除emoji和特殊符号
            const cleanText = this.cleanTextForSpeech(text);
            
            if (!cleanText.trim()) {
                console.log('⚠️ 清理后文本为空,跳过播放');
                return;
            }
            
            // 记录播报内容和时间(用于去重)
            this.lastSpoken = text;
            this.lastSpokenTime = Date.now();
            
            // 生成语音文件
            const outputFile = path.join(this.tempDir, 'speech.mp3');
            console.log('🔊 生成语音:', cleanText.substring(0, 30));
            
            // 使用 python -m edge_tts (更可靠,不依赖 PATH)
            const genCmd = `python -m edge_tts --voice "${this.voice}" --text "${cleanText.replace(/"/g, '').replace(/\n/g, ' ')}" --write-media "${outputFile}"`;
            
            await execAsync(genCmd, { timeout: 10000 });
            console.log('✅ 语音文件生成');
            
            // PowerShell MediaPlayer 播放
            const playCmd = `powershell -c "Add-Type -AssemblyName presentationCore; $mp = New-Object System.Windows.Media.MediaPlayer; $mp.Open('${outputFile}'); $mp.Play(); while($mp.NaturalDuration.HasTimeSpan -eq $false) { Start-Sleep -Milliseconds 100 }; $duration = $mp.NaturalDuration.TimeSpan.TotalSeconds; Start-Sleep -Seconds $duration; $mp.Close()"`;
            
            await execAsync(playCmd, { timeout: 60000 });
            
            const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
            console.log(`✅ 播放完成 (${elapsed}秒)`);
            
        } catch (err) {
            console.error('Edge TTS失败:', err.message);
        } finally {
            this.isSpeaking = false;
            console.log('🔓 语音系统已解锁');
        }
    }

    async processQueue() {
        if (this.queue.length > 0 && !this.isSpeaking) {
            const nextText = this.queue.shift();
            console.log(`🔊 播报队列 (剩余: ${this.queue.length})`);
            await this.speak(nextText);
        }
    }

    // 清空队列
    clearQueue() {
        this.queue = [];
        console.log('🗑️ 队列已清空');
    }

    // 停止播放并清空队列
    stop() {
        this.clearQueue();
        this.isSpeaking = false;
        console.log('⏹️ 停止播放');
    }

    cleanTextForSpeech(text) {
        let cleaned = text;
        
        // 1. 移除 emoji (Unicode范围)
        cleaned = cleaned.replace(/[\u{1F600}-\u{1F64F}]/gu, '') // 表情符号
                         .replace(/[\u{1F300}-\u{1F5FF}]/gu, '') // 杂项符号和象形文字
                         .replace(/[\u{1F680}-\u{1F6FF}]/gu, '') // 交通和地图符号
                         .replace(/[\u{1F700}-\u{1F77F}]/gu, '') // 炼金术符号
                         .replace(/[\u{1F780}-\u{1F7FF}]/gu, '') // 几何形状扩展
                         .replace(/[\u{1F800}-\u{1F8FF}]/gu, '') // 补充箭头-C
                         .replace(/[\u{1F900}-\u{1F9FF}]/gu, '') // 补充符号和象形文字
                         .replace(/[\u{1FA00}-\u{1FA6F}]/gu, '') // 国际象棋符号
                         .replace(/[\u{1FA70}-\u{1FAFF}]/gu, '') // 符号和象形文字扩展-A
                         .replace(/[\u{2600}-\u{26FF}]/gu, '')   // 杂项符号
                         .replace(/[\u{2700}-\u{27BF}]/gu, '');  // 装饰符号
        
        // 2. 替换常见特殊符号为语音友好文本
        cleaned = cleaned.replace(/✅/g, '完成')
                         .replace(/❌/g, '失败')
                         .replace(/⚠️/g, '注意')
                         .replace(/🚀/g, '开始')
                         .replace(/📢/g, '')
                         .replace(/💡/g, '')
                         .replace(/🔧/g, '')
                         .replace(/📝/g, '')
                         .replace(/📸/g, '')
                         .replace(/📤/g, '')
                         .replace(/📨/g, '')
                         .replace(/🔊/g, '')
                         .replace(/⚙️/g, '');
        
        // 3. 替换技术术语为口语化表达
        cleaned = cleaned.replace(/API/g, '接口')
                         .replace(/URL/g, '网址')
                         .replace(/JSON/g, '数据')
                         .replace(/HTTP/g, '')
                         .replace(/error/gi, '错误')
                         .replace(/success/gi, '成功')
                         .replace(/failed/gi, '失败');
        
        // 4. 处理标点符号 - 添加停顿
        cleaned = cleaned.replace(/\.\.\./g, '，')  // 省略号改逗号
                         .replace(/。/g, '。 ')      // 句号后加空格(停顿)
                         .replace(/！/g, '！ ')      // 感叹号后加空格
                         .replace(/？/g, '？ ')      // 问号后加空格
                         .replace(/；/g, '，')       // 分号改逗号
                         .replace(/\n/g, '。 ');     // 换行改句号
        
        // 5. 移除 Markdown 格式
        cleaned = cleaned.replace(/\*\*(.*?)\*\*/g, '$1')  // 加粗
                         .replace(/\*(.*?)\*/g, '$1')      // 斜体
                         .replace(/`(.*?)`/g, '$1')        // 代码
                         .replace(/\[(.*?)\]\(.*?\)/g, '$1'); // 链接
        
        // 6. 移除多余的标点
        cleaned = cleaned.replace(/[【】\[\]{}「」]/g, '')  // 各种括号
                         .replace(/[_~#@]/g, '');          // 特殊符号
        
        // 7. 智能长度处理
        if (cleaned.length > 500) {
            // 长文本,只取关键部分
            const sentences = cleaned.split(/[。！？]/);
            if (sentences.length > 3) {
                // 取前2句 + 结尾提示
                cleaned = sentences.slice(0, 2).join('。') + '。等内容,详情请查看桌面。';
            } else {
                // 直接截断
                cleaned = cleaned.substring(0, 500) + '...等共' + cleaned.length + '字。';
            }
        }
        
        // 8. 处理特殊模式
        // 进度信息简化
        if (cleaned.match(/正在|开始|完成/)) {
            cleaned = cleaned.replace(/正在(.+?)\.{3}/g, '正在$1');
        }
        
        // 重复字符压缩
        cleaned = cleaned.replace(/(.)\1{2,}/g, '$1$1');  // 最多重复2次
        
        // 9. 清理多余空格
        cleaned = cleaned.replace(/\s+/g, ' ').trim();
        
        // 10. 添加语气词(让播报更自然)
        if (cleaned.match(/^(完成|成功|好的|收到)$/)) {
            cleaned = cleaned + '了';  // "完成" → "完成了"
        }
        
        return cleaned;
    }

    async fallback(text) {
        const ps = `Add-Type -AssemblyName System.Speech; $s = New-Object System.Speech.Synthesis.SpeechSynthesizer; $s.Rate = 1; $s.Speak("${text.replace(/"/g, '`"')}")`;
        try {
            await execAsync(`powershell -Command "${ps}"`, { timeout: 10000 });
        } catch (e) {}
    }

    /**
     * 🧹 清理临时语音文件
     */
    async cleanupTempFiles(keepCount = 100) {
        try {
            const files = await fs.readdir(this.tempDir);
            const mp3Files = files.filter(f => f.endsWith('.mp3'));
            
            if (mp3Files.length <= keepCount) {
                return { deleted: 0, freed: 0 };
            }
            
            // 按修改时间排序
            const fileStats = await Promise.all(
                mp3Files.map(async (file) => {
                    const filePath = path.join(this.tempDir, file);
                    const stat = await fs.stat(filePath);
                    return { file, path: filePath, mtime: stat.mtime, size: stat.size };
                })
            );
            
            fileStats.sort((a, b) => b.mtime - a.mtime);
            
            // 删除旧文件
            const toDelete = fileStats.slice(keepCount);
            let deleted = 0;
            let freed = 0;
            
            for (const item of toDelete) {
                try {
                    await fs.unlink(item.path);
                    deleted++;
                    freed += item.size;
                } catch (err) {
                    console.warn(`删除语音文件失败 ${item.file}:`, err.message);
                }
            }
            
            console.log(`🧹 清理语音文件: ${deleted}个, ${(freed / 1024).toFixed(2)}KB`);
            return { deleted, freed };
        } catch (err) {
            console.error('清理语音文件失败:', err);
            return { deleted: 0, freed: 0 };
        }
    }
}

module.exports = WorkingVoice;
