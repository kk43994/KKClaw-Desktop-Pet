// 桌面通知客户端 - 让主会话可以推送通知到桌面
const http = require('http');

class DesktopNotifier {
    constructor(port = 18788) {
        this.port = port;
        this.server = null;
        this.callbacks = {
            'user-message': null,
            'agent-response': null,
            'status-change': null
        };
    }

    start() {
        this.server = http.createServer((req, res) => {
            // 设置 CORS
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

            if (req.method === 'OPTIONS') {
                res.writeHead(200);
                res.end();
                return;
            }

            if (req.method === 'POST' && req.url === '/notify') {
                let body = '';
                req.on('data', chunk => {
                    body += chunk.toString();
                });
                req.on('end', () => {
                    try {
                        const data = JSON.parse(body);
                        this.handleNotification(data);
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ ok: true }));
                    } catch (err) {
                        console.error('通知处理失败:', err);
                        res.writeHead(400);
                        res.end(JSON.stringify({ error: err.message }));
                    }
                });
            } else {
                res.writeHead(404);
                res.end();
            }
        });

        this.server.listen(this.port, '127.0.0.1', () => {
            console.log(`✅ 桌面通知服务器启动: http://127.0.0.1:${this.port}`);
        });
    }

    handleNotification(data) {
        const { type, payload } = data;
        console.log('📢 收到通知:', type, payload);

        if (this.callbacks[type]) {
            this.callbacks[type](payload);
        }
    }

    on(event, callback) {
        this.callbacks[event] = callback;
    }

    stop() {
        if (this.server) {
            this.server.close();
            this.server = null;
        }
    }
}

module.exports = DesktopNotifier;
