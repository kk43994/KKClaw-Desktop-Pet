// 截图反馈系统
const path = require('path');
const fs = require('fs').promises;
const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);

class ScreenshotSystem {
    constructor() {
        this.screenshotDir = path.join(__dirname, 'screenshots');
        this.init();
    }

    async init() {
        // 创建截图目录
        try {
            await fs.mkdir(this.screenshotDir, { recursive: true });
            console.log('✅ 截图目录就绪:', this.screenshotDir);
        } catch (err) {
            console.error('❌ 创建截图目录失败:', err);
        }
    }

    /**
     * 截取整个屏幕
     * @param {string} reason - 截图原因/任务名称
     * @returns {Promise<string>} 截图文件路径
     */
    async captureScreen(reason = 'screenshot') {
        const timestamp = Date.now();
        const filename = `${timestamp}_${this.sanitizeFilename(reason)}.png`;
        const filepath = path.join(this.screenshotDir, filename);

        try {
            // 方案1: 使用 Python desktop-control 技能
            const pythonScript = `
import sys
sys.path.append(r'C:\\Users\\zhouk\\openclaw-data\\skills\\desktop-control')
from __init__ import DesktopController

dc = DesktopController()
screenshot = dc.screenshot()
screenshot.save(r'${filepath.replace(/\\/g, '\\\\')}')
print('SUCCESS')
`;
            
            const tempPy = path.join(__dirname, 'temp_screenshot.py');
            await fs.writeFile(tempPy, pythonScript);
            
            const { stdout, stderr } = await execAsync(`python "${tempPy}"`, {
                timeout: 10000
            });
            
            await fs.unlink(tempPy);
            
            if (stdout.includes('SUCCESS')) {
                console.log('✅ 截图成功:', filepath);
                return filepath;
            } else {
                throw new Error(stderr || '截图失败');
            }
        } catch (err) {
            console.error('❌ Python截图失败,尝试PowerShell方案:', err.message);
            
            // 方案2: 使用 PowerShell (备用)
            return await this.capturePowerShell(filepath);
        }
    }

    /**
     * 使用 PowerShell 截图 (备用方案)
     */
    async capturePowerShell(filepath) {
        const psScript = `
Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

try {
    $screen = [System.Windows.Forms.Screen]::PrimaryScreen.Bounds
    $bitmap = New-Object System.Drawing.Bitmap($screen.Width, $screen.Height)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $graphics.CopyFromScreen($screen.Location, [System.Drawing.Point]::Empty, $screen.Size)
    $bitmap.Save('${filepath.replace(/\\/g, '/')}', [System.Drawing.Imaging.ImageFormat]::Png)
    $graphics.Dispose()
    $bitmap.Dispose()
    Write-Output 'SUCCESS'
} catch {
    Write-Error $_.Exception.Message
    exit 1
}
        `.trim();

        const tempPs = path.join(__dirname, 'temp_screenshot.ps1');
        await fs.writeFile(tempPs, psScript);

        try {
            const { stdout, stderr } = await execAsync(
                `powershell -ExecutionPolicy Bypass -File "${tempPs}"`,
                { timeout: 10000 }
            );

            await fs.unlink(tempPs);

            if (stdout.includes('SUCCESS') || await this.fileExists(filepath)) {
                console.log('✅ PowerShell截图成功:', filepath);
                return filepath;
            } else {
                throw new Error(stderr || 'PowerShell截图失败');
            }
        } catch (err) {
            console.error('❌ PowerShell截图失败:', err.message);
            await fs.unlink(tempPs).catch(() => {});
            throw err;
        }
    }

    /**
     * 检查文件是否存在
     */
    async fileExists(filepath) {
        try {
            await fs.access(filepath);
            return true;
        } catch {
            return false;
        }
    }

    /**
     * 截取指定区域
     * @param {number} x - 左上角X坐标
     * @param {number} y - 左上角Y坐标
     * @param {number} width - 宽度
     * @param {number} height - 高度
     * @param {string} reason - 截图原因
     */
    async captureRegion(x, y, width, height, reason = 'region') {
        const timestamp = Date.now();
        const filename = `${timestamp}_${this.sanitizeFilename(reason)}.png`;
        const filepath = path.join(this.screenshotDir, filename);

        const pythonScript = `
import sys
sys.path.append(r'C:\\Users\\zhouk\\openclaw-data\\skills\\desktop-control')
from __init__ import DesktopController

dc = DesktopController()
screenshot = dc.screenshot(region=(${x}, ${y}, ${width}, ${height}))
screenshot.save(r'${filepath.replace(/\\/g, '\\\\')}')
print('SUCCESS')
`;

        const tempPy = path.join(__dirname, 'temp_screenshot_region.py');
        await fs.writeFile(tempPy, pythonScript);

        try {
            const { stdout } = await execAsync(`python "${tempPy}"`, { timeout: 10000 });
            await fs.unlink(tempPy);

            if (stdout.includes('SUCCESS')) {
                console.log('✅ 区域截图成功:', filepath);
                return filepath;
            }
        } catch (err) {
            console.error('❌ 区域截图失败:', err);
            await fs.unlink(tempPy).catch(() => {});
            throw err;
        }

        return filepath;
    }

    /**
     * 清理文件名
     */
    sanitizeFilename(name) {
        return name
            .replace(/[<>:"/\\|?*]/g, '_')
            .replace(/\s+/g, '_')
            .substring(0, 50);
    }

    /**
     * 获取最近的截图
     * @param {number} count - 获取数量
     */
    async getRecentScreenshots(count = 5) {
        try {
            const files = await fs.readdir(this.screenshotDir);
            const screenshots = files
                .filter(f => f.endsWith('.png'))
                .map(f => ({
                    name: f,
                    path: path.join(this.screenshotDir, f),
                    timestamp: parseInt(f.split('_')[0])
                }))
                .sort((a, b) => b.timestamp - a.timestamp)
                .slice(0, count);

            return screenshots;
        } catch (err) {
            console.error('❌ 获取截图列表失败:', err);
            return [];
        }
    }

    /**
     * 清理旧截图 (保留最近N张)
     * @param {number} keep - 保留数量
     */
    async cleanupOld(keep = 20) {
        try {
            const files = await fs.readdir(this.screenshotDir);
            const screenshots = files
                .filter(f => f.endsWith('.png'))
                .map(f => ({
                    name: f,
                    path: path.join(this.screenshotDir, f),
                    timestamp: parseInt(f.split('_')[0])
                }))
                .sort((a, b) => b.timestamp - a.timestamp);

            // 删除超出保留数量的截图
            const toDelete = screenshots.slice(keep);
            for (const file of toDelete) {
                await fs.unlink(file.path);
                console.log('🗑️ 删除旧截图:', file.name);
            }

            console.log(`✅ 清理完成,保留 ${keep} 张截图`);
        } catch (err) {
            console.error('❌ 清理截图失败:', err);
        }
    }
}

module.exports = ScreenshotSystem;
