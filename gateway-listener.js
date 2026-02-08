// OpenClaw Gateway WebSocket 监听器 - 主动监听飞书对话
const WebSocket = require('ws');
const EventEmitter = require('events');

class GatewayListener extends EventEmitter {
    constructor(gatewayUrl = 'ws://127.0.0.1:18789', token = null) {
        super();
        this.gatewayUrl = gatewayUrl;
        this.token = token;
        this.ws = null;
        this.reconnectInterval = null;
        this.reconnectDelay = 5000; // 5秒后重连
        this.isIntentionalClose = false;
    }

    connect() {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            console.log('⚠️ WebSocket 已连接');
            return;
        }

        console.log('🔌 连接到 OpenClaw Gateway:', this.gatewayUrl);

        try {
            // 构建 WebSocket URL，带 token 认证
            const wsUrl = this.token
                ? `${this.gatewayUrl}?token=${this.token}`
                : this.gatewayUrl;

            this.ws = new WebSocket(wsUrl);

            this.ws.on('open', () => {
                console.log('✅ Gateway WebSocket 已连接');
                this.emit('connected');

                // 订阅飞书消息流
                this.subscribe();
            });

            this.ws.on('message', (data) => {
                try {
                    const message = JSON.parse(data.toString());
                    this.handleMessage(message);
                } catch (err) {
                    console.error('解析消息失败:', err.message);
                }
            });

            this.ws.on('close', () => {
                console.log('🔌 Gateway WebSocket 已断开');
                this.emit('disconnected');

                // 自动重连
                if (!this.isIntentionalClose) {
                    this.scheduleReconnect();
                }
            });

            this.ws.on('error', (err) => {
                console.error('❌ Gateway WebSocket 错误:', err.message);
                this.emit('error', err);
            });

        } catch (err) {
            console.error('连接失败:', err.message);
            this.scheduleReconnect();
        }
    }

    subscribe() {
        // 订阅消息流
        // 具体格式需要看 OpenClaw Gateway 的 WebSocket API
        // 这里先发一个订阅请求
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify({
                type: 'subscribe',
                channels: ['lark', 'agent-response']
            }));
        }
    }

    handleMessage(message) {
        console.log('📩 收到 Gateway 消息:', message.type);

        // 根据消息类型触发不同事件
        switch (message.type) {
            case 'user_message':
                this.emit('user-message', {
                    sender: message.sender || '用户',
                    content: message.content,
                    channel: message.channel || 'lark'
                });
                break;

            case 'agent_response':
                this.emit('agent-response', {
                    content: message.content,
                    session: message.session
                });
                break;

            case 'session_event':
                this.emit('session-event', message);
                break;

            default:
                // console.log('未处理的消息类型:', message.type);
                break;
        }
    }

    scheduleReconnect() {
        if (this.reconnectInterval) {
            clearTimeout(this.reconnectInterval);
        }

        console.log(`🔄 ${this.reconnectDelay / 1000} 秒后重连...`);
        this.reconnectInterval = setTimeout(() => {
            this.connect();
        }, this.reconnectDelay);
    }

    disconnect() {
        this.isIntentionalClose = true;

        if (this.reconnectInterval) {
            clearTimeout(this.reconnectInterval);
            this.reconnectInterval = null;
        }

        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
    }

    isConnected() {
        return this.ws && this.ws.readyState === WebSocket.OPEN;
    }
}

module.exports = GatewayListener;
