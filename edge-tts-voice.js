// Edge TTS 语音系统 - 修复版
const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);
const path = require('path');
const fs = require('fs').promises;

class EdgeTTSVoice {
    constructor() {
        this.isSpeaking = false;
        this.tempDir = path.join(__dirname, 'temp');
        this.voice = 'zh-CN-XiaoxiaoNeural'; // 晓晓(活泼女声)
        this.edgeTtsPath = 'C:\\Users\\zhouk\\AppData\\Roaming\\Python\\Python313\\Scripts\\edge-tts.exe';
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
            // 检查 edge-tts 是否存在
            try {
                await fs.access(this.edgeTtsPath);
            } catch {
                console.log('⚠️ Edge TTS 不可用,使用 Windows TTS');
                await this.fallbackTTS(text);
                return;
            }

            console.log('🔊 Edge TTS 开始生成:', text.substring(0, 30));
            
            // 生成语音文件
            const outputFile = path.join(this.tempDir, 'speech.mp3');
            const genCommand = `"${this.edgeTtsPath}" --voice "${this.voice}" --text "${text.replace(/"/g, '').replace(/\n/g, ' ')}" --write-media "${outputFile}"`;
            
            await execAsync(genCommand, { timeout: 10000 });
            
            console.log('✅ 语音文件生成完成');
            
            // 用 PowerShell 播放 MP3 - 最简单的方法
            const playScript = `
$player = New-Object System.Media.SoundPlayer
$mp3 = "${outputFile.replace(/\\/g, '\\\\')}"
Add-Type -AssemblyName presentationCore
$mediaPlayer = New-Object System.Windows.Media.MediaPlayer
$mediaPlayer.Open($mp3)
$mediaPlayer.Play()
$duration = 0
while ($mediaPlayer.NaturalDuration.HasTimeSpan -eq $false -and $duration -lt 50) {
    Start-Sleep -Milliseconds 100
    $duration++
}
if ($mediaPlayer.NaturalDuration.HasTimeSpan) {
    $totalSeconds = $mediaPlayer.NaturalDuration.TimeSpan.TotalSeconds
    Start-Sleep -Seconds $totalSeconds
}
$mediaPlayer.Close()
            `.trim();

            await execAsync(`powershell -Command "${playScript}"`, { timeout: 30000 });
            
            console.log('✅ 播放完成');
            
        } catch (err) {
            console.error('❌ Edge TTS 失败:', err.message);
            console.log('📢 切换到备用 TTS');
            await this.fallbackTTS(text);
        } finally {
            this.isSpeaking = false;
        }
    }

    async fallbackTTS(text) {
        // 备用: Windows TTS
        const psScript = `
Add-Type -AssemblyName System.Speech
$speak = New-Object System.Speech.Synthesis.SpeechSynthesizer
$speak.Rate = 1
$speak.Volume = 100
$speak.Speak("${text.replace(/"/g, '`"').replace(/\n/g, ' ')}")
        `.trim();

        try {
            await execAsync(`powershell -Command "${psScript}"`, { timeout: 15000 });
        } catch (err) {
            console.error('❌ 备用 TTS 也失败:', err);
        }
    }

    setVoice(voiceName) {
        this.voice = voiceName;
        console.log(`✅ 切换到声音: ${voiceName}`);
    }

    stop() {
        this.isSpeaking = false;
    }
}

module.exports = EdgeTTSVoice;
