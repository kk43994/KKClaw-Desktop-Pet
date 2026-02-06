// 简单测试脚本
const http = require('http');

const tests = [
    {
        type: 'user-message',
        payload: { sender: '测试', content: '简单测试' }
    },
    {
        type: 'agent-response',
        payload: { content: '这是回复测试' }
    }
];

function sendNotification(data) {
    const postData = JSON.stringify(data);
    
    const options = {
        hostname: '127.0.0.1',
        port: 18788,
        path: '/notify',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData)
        }
    };

    return new Promise((resolve, reject) => {
        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                console.log(`✅ 发送成功: ${postData.substring(0, 50)}...`);
                resolve(data);
            });
        });

        req.on('error', reject);
        req.write(postData);
        req.end();
    });
}

async function runTests() {
    for (const test of tests) {
        await sendNotification(test);
        await new Promise(resolve => setTimeout(resolve, 2000));
    }
}

runTests().catch(console.error);
