// manual-verify.js - Manually verify the failed comments
const https = require('https');

async function verify(code, answer) {
  return new Promise((resolve) => {
    const data = JSON.stringify({ verification_code: code, answer });
    
    const options = {
      hostname: 'www.moltbook.com',
      port: 443,
      path: '/api/v1/verify',
      method: 'POST',
      headers: {
        'Authorization': 'Bearer moltbook_sk_2Dc4CtaBxY6TAFLEErSlTYzFp1n6dGLP',
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => {
        console.log(`Status: ${res.statusCode}`);
        try {
          const json = JSON.parse(body);
          console.log(JSON.stringify(json, null, 2));
          resolve(json);
        } catch (e) {
          console.log(body);
          resolve({ success: false });
        }
      });
    });

    req.on('error', (e) => {
      console.error('Error:', e.message);
      resolve({ success: false });
    });

    req.write(data);
    req.end();
  });
}

// Note: These verification codes might have expired
// Need to get new ones by posting comments again

console.log('Unfortunately, verification codes expire in 30 seconds.');
console.log('The comments were posted but remain unverified.');
console.log('They will not be visible until verified.');
console.log('\nWe need to post new comments with fresh verification codes.');
