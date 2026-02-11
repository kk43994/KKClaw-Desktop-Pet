// OpenClaw 服务管理模块 - 按需检测版
const { spawn, exec } = require('child_process');
const path = require('path');
const EventEmitter = require('events');

const OPENCLAW_HOST = 'http://127.0.0.1:18789';

class ServiceManager extends EventEmitter {
    constructor() {
        super();
        this.services = {
            gateway: {
                name: 'OpenClaw Gateway',
                status: 'unknown', // unknown, running, stopped, error
                pid: null,
                lastCheck: 0,
                lastError: null,
                uptime: 0
            }
        };
        this.logs = [];
        this.maxLogs = 100;
        this._restartLock = false; // 防止并发重启
    }

    // 开始（仅初始化，不轮询）
    start() {
        this.log('info', '服务管理器启动 (按需检测模式)');
        // 初始检测一次
        this.checkGateway();
    }

    // 停止
    stop() {
        this.log('info', '服务管理器停止');
    }

    // 记录日志
    log(level, message, service = 'manager') {
        const entry = {
            timestamp: new Date().toISOString(),
            level,
            service,
            message
        };
        this.logs.push(entry);
        if (this.logs.length > this.maxLogs) {
            this.logs.shift();
        }
        this.emit('log', entry);
        console.log(`[${level.toUpperCase()}] [${service}] ${message}`);
    }

    // 获取最近日志
    getRecentLogs(count = 50) {
        return this.logs.slice(-count);
    }

    // 通信失败时调用此方法检测服务状态
    async onCommunicationError(error) {
        this.log('warn', `通信错误触发检测: ${error}`, 'gateway');
        return await this.checkGateway();
    }

    // 检查 Gateway 状态（按需调用）
    async checkGateway() {
        const service = this.services.gateway;
        const previousStatus = service.status;

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 3000);

            const response = await fetch(OPENCLAW_HOST, {
                method: 'GET',
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (response.ok || response.status === 200) {
                service.status = 'running';
                service.lastError = null;
                if (previousStatus !== 'running') {
                    service.uptime = Date.now();
                    this.log('success', 'Gateway 已连接', 'gateway');
                }
            } else {
                service.status = 'error';
                service.lastError = `HTTP ${response.status}`;
                this.log('error', `Gateway 返回错误: ${response.status}`, 'gateway');
            }
        } catch (err) {
            service.status = 'stopped';
            service.lastError = err.message;
            if (previousStatus === 'running') {
                this.log('error', `Gateway 连接断开: ${err.message}`, 'gateway');
            }
        }

        service.lastCheck = Date.now();

        // 状态变化时发送事件
        if (previousStatus !== service.status) {
            this.emit('status-change', {
                service: 'gateway',
                previousStatus,
                currentStatus: service.status,
                error: service.lastError
            });
        }

        return service;
    }

    // 查找占用指定端口的进程 PID（排除 Electron 自身）
    _findPortPids(port) {
        return new Promise((resolve) => {
            exec(`netstat -ano | findstr :${port} | findstr LISTENING`, (err, stdout) => {
                if (err || !stdout) {
                    resolve([]);
                    return;
                }

                const electronPid = process.pid;
                const parentPid = process.ppid;
                const pids = new Set();

                stdout.trim().split('\n').forEach(line => {
                    const parts = line.trim().split(/\s+/);
                    const pid = parts[parts.length - 1];
                    if (pid && /^\d+$/.test(pid) &&
                        pid !== String(electronPid) && pid !== String(parentPid)) {
                        pids.add(pid);
                    }
                });

                resolve([...pids]);
            });
        });
    }

    // 强制杀死占用端口的所有进程
    async _forceKillPort(port) {
        const pids = await this._findPortPids(port);
        if (pids.length === 0) return;

        this.log('info', `强制终止占用端口 ${port} 的进程: ${pids.join(', ')}`, 'gateway');

        const killPromises = pids.map(pid => new Promise((resolve) => {
            exec(`taskkill /PID ${pid} /F /T`, (err) => {
                if (err) {
                    this.log('warn', `终止 PID ${pid} 失败: ${err.message}`, 'gateway');
                }
                resolve();
            });
        }));

        await Promise.all(killPromises);
    }

    // 等待端口释放（带超时）
    async _waitForPortFree(port, timeoutMs = 10000) {
        const startTime = Date.now();
        const checkInterval = 500;

        while (Date.now() - startTime < timeoutMs) {
            const pids = await this._findPortPids(port);
            if (pids.length === 0) {
                return true;
            }
            await new Promise(r => setTimeout(r, checkInterval));
        }

        return false;
    }

    // 启动 Gateway
    async startGateway() {
        this.log('info', '正在启动 Gateway...', 'gateway');

        // 启动前确保端口没被占用
        const pids = await this._findPortPids(18789);
        if (pids.length > 0) {
            this.log('warn', `启动前发现端口被占用 (PID: ${pids.join(', ')})，先强制清理`, 'gateway');
            await this._forceKillPort(18789);
            const freed = await this._waitForPortFree(18789, 5000);
            if (!freed) {
                this.log('error', '端口清理超时，无法启动 Gateway', 'gateway');
                return { success: false, error: '端口 18789 被占用且无法释放' };
            }
        }

        const openclawPath = path.join(process.env.HOME || process.env.USERPROFILE, '.npm-global', 'node_modules', 'openclaw', 'dist', 'index.js');

        const fs = require('fs');
        if (!fs.existsSync(openclawPath)) {
            this.log('error', `openclaw 不存在: ${openclawPath}`, 'gateway');
            return { success: false, error: `openclaw 不存在: ${openclawPath}` };
        }

        const child = spawn('node', [openclawPath, 'gateway', '--port', '18789'], {
            detached: true,
            stdio: ['ignore', 'ignore', 'pipe'], // 捕获 stderr 用于诊断闪退
            shell: true
        });

        // 收集 stderr 输出（最多保留最后 2KB）
        let stderrBuf = '';
        let exited = false;
        child.stderr.on('data', (chunk) => {
            stderrBuf = (stderrBuf + chunk.toString()).slice(-2048);
        });
        child.on('exit', (code) => {
            exited = true;
            if (code !== null && code !== 0) {
                const reason = stderrBuf.trim() || `exit code ${code}`;
                this.log('error', `Gateway 进程异常退出 (code ${code}): ${reason}`, 'gateway');
            }
        });

        child.unref();

        // 轮询等待启动完成（最长 15 秒）
        const startTime = Date.now();
        const maxWait = 15000;
        const pollInterval = 1000;

        while (Date.now() - startTime < maxWait) {
            // 进程已退出说明闪退了，不用继续等
            if (exited) {
                const reason = stderrBuf.trim() || '进程异常退出';
                this.log('error', `Gateway 闪退: ${reason}`, 'gateway');
                return { success: false, error: `Gateway 闪退: ${reason}` };
            }
            await new Promise(r => setTimeout(r, pollInterval));
            const status = await this.checkGateway();
            if (status.status === 'running') {
                this.log('success', `Gateway 启动成功 (${Math.round((Date.now() - startTime) / 1000)}s)`, 'gateway');
                return { success: true };
            }
        }

        const timeoutReason = stderrBuf.trim();
        const errorDetail = timeoutReason
            ? `启动超时 (${maxWait / 1000}s), stderr: ${timeoutReason}`
            : `启动超时 (${maxWait / 1000}s)`;
        this.log('error', `Gateway ${errorDetail}`, 'gateway');
        return { success: false, error: errorDetail };
    }

    // 停止 Gateway — 强制杀死并确认端口释放
    async stopGateway() {
        this.log('info', '正在停止 Gateway...', 'gateway');

        await this._forceKillPort(18789);

        // 等待端口真正释放
        const freed = await this._waitForPortFree(18789, 8000);
        if (!freed) {
            this.log('error', '停止 Gateway 超时，端口仍被占用', 'gateway');
            // 最后一搏：再杀一次
            await this._forceKillPort(18789);
            await new Promise(r => setTimeout(r, 2000));
        }

        this.log('success', 'Gateway 已停止', 'gateway');
        this.services.gateway.status = 'stopped';
        this.emit('status-change', {
            service: 'gateway',
            previousStatus: 'running',
            currentStatus: 'stopped'
        });
        return { success: true };
    }

    // 重启 Gateway（带并发锁，防止多处同时触发）
    async restartGateway() {
        if (this._restartLock) {
            this.log('warn', '重启已在进行中，跳过重复请求', 'gateway');
            return { success: false, error: '重启正在进行中' };
        }

        this._restartLock = true;
        this.log('info', '正在重启 Gateway...', 'gateway');

        try {
            await this.stopGateway();
            // stopGateway 已确认端口释放，无需额外等待
            return await this.startGateway();
        } finally {
            this._restartLock = false;
        }
    }

    // 获取所有服务状态
    getStatus() {
        return {
            gateway: { ...this.services.gateway },
            timestamp: Date.now()
        };
    }

    // 获取服务运行时间
    getUptime(service) {
        const svc = this.services[service];
        if (!svc || svc.status !== 'running' || !svc.uptime) {
            return 0;
        }
        return Date.now() - svc.uptime;
    }

    // 格式化运行时间
    formatUptime(ms) {
        if (!ms) return '-';
        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);

        if (hours > 0) {
            return `${hours}h ${minutes % 60}m`;
        } else if (minutes > 0) {
            return `${minutes}m ${seconds % 60}s`;
        } else {
            return `${seconds}s`;
        }
    }
}

module.exports = ServiceManager;
