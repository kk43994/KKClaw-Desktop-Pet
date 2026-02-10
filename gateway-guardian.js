// Gateway 进程守护模块
const { spawn, exec } = require('child_process');
const EventEmitter = require('events');
const path = require('path');

class GatewayGuardian extends EventEmitter {
    constructor(options = {}) {
        super();
        this.checkInterval = options.checkInterval || 5000; // 5秒检查一次
        this.maxRestarts = options.maxRestarts || 10; // 1小时内最多重启10次
        this.restartWindow = options.restartWindow || 60 * 60 * 1000; // 1小时窗口
        this.gatewayHost = options.gatewayHost || 'http://127.0.0.1:18789';

        this.isRunning = false;
        this.checkTimer = null;
        this.gatewayProcess = null;
        this.restartHistory = []; // 记录重启时间
        this.consecutiveFailures = 0;
    }

    // 启动守护
    start() {
        if (this.isRunning) {
            console.log('[Guardian] 守护进程已在运行');
            return;
        }

        console.log('[Guardian] 🛡️ 启动 Gateway 进程守护');
        this.isRunning = true;

        // 立即检查一次
        this.checkGatewayHealth();

        // 定期检查
        this.checkTimer = setInterval(() => {
            this.checkGatewayHealth();
        }, this.checkInterval);

        this.emit('started');
    }

    // 停止守护
    stop() {
        console.log('[Guardian] 停止 Gateway 进程守护');
        this.isRunning = false;

        if (this.checkTimer) {
            clearInterval(this.checkTimer);
            this.checkTimer = null;
        }

        this.emit('stopped');
    }

    // 检查 Gateway 健康状态
    async checkGatewayHealth() {
        if (!this.isRunning) return;

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 3000);

            const response = await fetch(this.gatewayHost, {
                method: 'GET',
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (response.ok || response.status === 200) {
                // Gateway 正常
                this.consecutiveFailures = 0;
                this.emit('healthy');
            } else {
                this.handleUnhealthy('HTTP错误: ' + response.status);
            }
        } catch (err) {
            this.handleUnhealthy(err.message);
        }
    }

    // 处理不健康状态
    async handleUnhealthy(reason) {
        this.consecutiveFailures++;

        if (this.consecutiveFailures >= 3) {
            console.log(`[Guardian] ⚠️ Gateway 不健康 (连续失败 ${this.consecutiveFailures} 次): ${reason}`);

            // 检查是否允许重启
            if (this.canRestart()) {
                console.log('[Guardian] 🔄 触发自动重启...');
                this.emit('unhealthy', { reason, consecutiveFailures: this.consecutiveFailures });
                await this.restartGateway();
            } else {
                console.log('[Guardian] ❌ 重启次数过多，暂停自动重启');
                this.emit('restart-limit-reached', { restartHistory: this.restartHistory });
                this.stop(); // 停止守护，避免无限重启
            }
        }
    }

    // 检查是否允许重启
    canRestart() {
        const now = Date.now();

        // 清理过期的重启记录
        this.restartHistory = this.restartHistory.filter(
            timestamp => now - timestamp < this.restartWindow
        );

        return this.restartHistory.length < this.maxRestarts;
    }

    // 重启 Gateway
    async restartGateway() {
        try {
            console.log('[Guardian] 停止旧的 Gateway 进程...');
            await this.stopGateway();

            console.log('[Guardian] 等待 2 秒...');
            await new Promise(resolve => setTimeout(resolve, 2000));

            console.log('[Guardian] 启动新的 Gateway 进程...');
            await this.startGateway();

            // 记录重启时间
            this.restartHistory.push(Date.now());
            this.consecutiveFailures = 0;

            console.log('[Guardian] ✅ Gateway 重启完成');
            this.emit('restarted', {
                restartCount: this.restartHistory.length,
                maxRestarts: this.maxRestarts
            });

            return { success: true };
        } catch (err) {
            // 失败也计入重启历史，防止无限重试
            this.restartHistory.push(Date.now());
            console.error('[Guardian] ❌ 重启失败:', err.message);
            this.emit('restart-failed', { error: err.message });
            return { success: false, error: err.message };
        }
    }

    // 启动 Gateway
    async startGateway() {
        return new Promise((resolve, reject) => {
            const openclawPath = path.join(
                process.env.HOME || process.env.USERPROFILE,
                '.npm-global',
                'node_modules',
                'openclaw',
                'dist',
                'index.js'
            );

            const fs = require('fs');
            if (!fs.existsSync(openclawPath)) {
                reject(new Error(`openclaw 不存在: ${openclawPath}`));
                return;
            }

            const child = spawn('node', [openclawPath, 'gateway', '--port', '18789'], {
                detached: true,
                stdio: 'ignore',
                shell: true
            });

            child.unref();
            this.gatewayProcess = child;

            // 等待启动
            setTimeout(async () => {
                const healthy = await this.isGatewayHealthy();
                if (healthy) {
                    resolve({ success: true });
                } else {
                    reject(new Error('Gateway 启动后健康检查失败'));
                }
            }, 3000);
        });
    }

    // 停止 Gateway
    async stopGateway() {
        return new Promise((resolve) => {
            exec('netstat -ano | findstr :18789', (err, stdout) => {
                if (err || !stdout) {
                    resolve({ success: true });
                    return;
                }

                const lines = stdout.trim().split('\n');
                const pids = new Set();
                lines.forEach(line => {
                    const parts = line.trim().split(/\s+/);
                    const pid = parts[parts.length - 1];
                    if (pid && /^\d+$/.test(pid)) {
                        // 跳过当前进程
                        if (pid !== String(process.pid) && pid !== String(process.ppid)) {
                            pids.add(pid);
                        }
                    }
                });

                if (pids.size === 0) {
                    resolve({ success: true });
                    return;
                }

                let killed = 0;
                pids.forEach(pid => {
                    exec(`taskkill /PID ${pid}`, (err) => {
                        if (err) {
                            exec(`taskkill /PID ${pid} /F`, () => {
                                killed++;
                                if (killed === pids.size) {
                                    resolve({ success: true });
                                }
                            });
                        } else {
                            killed++;
                            if (killed === pids.size) {
                                resolve({ success: true });
                            }
                        }
                    });
                });
            });
        });
    }

    // 检查 Gateway 是否健���
    async isGatewayHealthy() {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 2000);

            const response = await fetch(this.gatewayHost, {
                method: 'GET',
                signal: controller.signal
            });

            clearTimeout(timeoutId);
            return response.ok || response.status === 200;
        } catch {
            return false;
        }
    }

    // 获取统计信息
    getStats() {
        const now = Date.now();
        const recentRestarts = this.restartHistory.filter(
            timestamp => now - timestamp < this.restartWindow
        );

        return {
            isRunning: this.isRunning,
            consecutiveFailures: this.consecutiveFailures,
            restartsInWindow: recentRestarts.length,
            maxRestarts: this.maxRestarts,
            restartWindowMinutes: this.restartWindow / 60000,
            canRestart: this.canRestart()
        };
    }
}

module.exports = GatewayGuardian;
