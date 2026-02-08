// OpenClaw 连接模块
const OPENCLAW_HOST = 'http://127.0.0.1:18789';
const OPENCLAW_TOKEN = process.env.OPENCLAW_GATEWAY_TOKEN || 'f341263d57a0efcbc83c69c6d9e2b2e0f885aaacb35572dd';

class OpenClawClient {
    constructor() {
        this.connected = false;
        this.sessionKey = null;
        this.lastCheckTime = 0;
        this.checkInterval = 10000; // 10秒检查一次,不要太频繁
        this.onError = null; // 错误回调，用于触发服务管理器检测
    }

    // 设置错误回调
    setErrorHandler(handler) {
        this.onError = handler;
    }

    async checkConnection() {
        // 避免频繁检查
        const now = Date.now();
        if (now - this.lastCheckTime < this.checkInterval && this.connected) {
            return this.connected;
        }
        this.lastCheckTime = now;

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 2000);

            const testResponse = await fetch(`${OPENCLAW_HOST}/`, {
                method: 'GET',
                signal: controller.signal
            }).catch(() => null);

            clearTimeout(timeoutId);

            this.connected = testResponse !== null;
            return this.connected;
        } catch (err) {
            this.connected = false;
            return false;
        }
    }

    async sendMessage(message) {
        try {
            const response = await fetch(`${OPENCLAW_HOST}/v1/chat/completions`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${OPENCLAW_TOKEN}`,
                    'Content-Type': 'application/json',
                    'x-openclaw-agent-id': 'main'
                },
                body: JSON.stringify({
                    model: 'openclaw:main',
                    messages: [
                        { role: 'user', content: message }
                    ],
                    stream: false
                })
            });

            if (!response.ok) {
                const errorMsg = `连接失败 (${response.status})`;
                // 触发服务检测
                if (this.onError) {
                    this.onError(errorMsg);
                }
                this.connected = false;
                return errorMsg;
            }

            this.connected = true;
            const data = await response.json();
            return data.choices?.[0]?.message?.content || '无响应';
        } catch (err) {
            console.error('发送消息失败:', err);
            this.connected = false;
            // 触发服务检测
            if (this.onError) {
                this.onError(err.message);
            }
            return `错误: ${err.message}`;
        }
    }

    async getStatus() {
        return this.connected ? 'connected' : 'disconnected';
    }
}

module.exports = OpenClawClient;
