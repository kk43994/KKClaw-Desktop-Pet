// 简化版语音系统 - 直接用 PowerShell
const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);
const path = require('path');
const fs = require('fs').promises;

class SimpleVoice {
    constructor() {
        this.isSpeaking = false;
        this.tempDir = path.join(__dirname, 'temp');
        this.voice = 'zh-CN-XiaoxiaoNeural';
        this.initTempDir();
    }

    async initTempDir() {
        try {
            await fs.mkdir(this.tempDir, { recursive: true });
        } catch (err) {
            console.error('创建临时目录失败:', err);
        }
    }

    async speak(text) {
        if (this.isSpeaking) {
            console.log('⏭️ 正在播放,跳过');
            return;
        }

        this.isSpeaking = true;
        
        try {
            // 直接用 Windows TTS - 简单可靠
            console.log('🔊 开始播放:', text.substring(0, 30));
            
            const psScript = `
Add-Type -AssemblyName System.Speech
$speak = New-Object System.Speech.Synthesis.SpeechSynthesizer
$speak.Rate = 1
$speak.Volume = 100
$speak.Speak("${text.replace(/"/g, '`"').replace(/\n/g, ' ')}")
            `.trim();

            await execAsync(`powershell -Command "${psScript}"`, { timeout: 15000 });
            console.log('✅ 播放完成');
            
        } catch (err) {
            console.error('❌ 语音播放失败:', err.message);
        } finally {
            this.isSpeaking = false;
        }
    }

    stop() {
        this.isSpeaking = false;
    }
}

module.exports = SimpleVoice;
