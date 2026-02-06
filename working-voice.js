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
        this.edgeTtsPath = 'C:\\Users\\zhouk\\AppData\\Roaming\\Python\\Python313\\Scripts\\edge-tts.exe';
        this.initTempDir();
    }

    async initTempDir() {
        try {
            await fs.mkdir(this.tempDir, { recursive: true });
        } catch (err) {}
    }

    async speak(text) {
        if (this.isSpeaking) {
            console.log('⏭️ 跳过 (正在播放)');
            return;
        }

        this.isSpeaking = true;
        const startTime = Date.now();
        
        try {
            // 生成语音文件
            const outputFile = path.join(this.tempDir, 'speech.mp3');
            console.log('🔊 生成语音:', text.substring(0, 30));
            const genCmd = `"${this.edgeTtsPath}" --voice "${this.voice}" --text "${text.replace(/"/g, '').replace(/\n/g, ' ')}" --write-media "${outputFile}"`;
            
            await execAsync(genCmd, { timeout: 10000 });
            console.log('✅ 语音文件生成');
            
            // 用 Start-Process 播放 - 最简单可靠
            const playCmd = `Start-Process -FilePath "${outputFile}" -Wait`;
            await execAsync(`powershell -Command "${playCmd}"`, { timeout: 60000 });
            
            const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
            console.log(`✅ 播放完成 (${elapsed}秒)`);
            
        } catch (err) {
            console.error('Edge TTS失败:', err.message);
        } finally {
            this.isSpeaking = false;
            console.log('🔓 语音系统已解锁');
        }
    }

    async fallback(text) {
        const ps = `Add-Type -AssemblyName System.Speech; $s = New-Object System.Speech.Synthesis.SpeechSynthesizer; $s.Rate = 1; $s.Speak("${text.replace(/"/g, '`"')}")`;
        try {
            await execAsync(`powershell -Command "${ps}"`, { timeout: 10000 });
        } catch (e) {}
    }
}

module.exports = WorkingVoice;
