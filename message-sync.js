// 真正的消息同步系统 - 通过轮询会话历史
const EventEmitter = require('events');

class MessageSyncSystem extends EventEmitter {
    constructor(openclawClient) {
        super();
        this.openclawClient = openclawClient;
        this.isConnected = true;
        this.messageHistory = [];
        this.lastMessageId = null;
        this.pollInterval = null;
    }

    connect() {
        console.log('✅ 消息同步系统已启动(会话监听模式)');
        this.isConnected = true;
        this.emit('connected');
        
        // 开始轮询会话消息
        this.startPolling();
    }

    startPolling() {
        // 每3秒检查一次新消息
        this.pollInterval = setInterval(() => {
            this.checkNewMessages();
        }, 3000);
    }

    async checkNewMessages() {
        // 这里应该调用 OpenClaw API 获取会话历史
        // 但目前 API 可能不支持,所以先做一个框架
        // 实际实现需要 OpenClaw 暴露会话历史接口
        
        // TODO: 实现真正的消息轮询
        // const history = await this.openclawClient.getSessionHistory();
        // 检查新消息并触发事件
    }

    handleMessage(message) {
        // 处理新消息
        this.messageHistory.push({
            timestamp: Date.now(),
            sender: message.sender || '用户',
            content: message.content,
            channel: message.channel || 'lark'
        });

        this.emit('new_message', {
            sender: message.sender || '用户',
            content: message.content,
            channel: message.channel || 'lark'
        });
    }

    // 手动触发消息(用于测试)
    simulateMessage(sender, content) {
        this.handleMessage({ sender, content });
    }

    getRecentMessages(count = 10) {
        return this.messageHistory.slice(-count);
    }

    disconnect() {
        if (this.pollInterval) {
            clearInterval(this.pollInterval);
            this.pollInterval = null;
        }
        this.isConnected = false;
    }
}

module.exports = MessageSyncSystem;
