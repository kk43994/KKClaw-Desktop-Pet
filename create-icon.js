const { createCanvas } = require('canvas');
const fs = require('fs');

// 创建一个简单的图标
const canvas = createCanvas(256, 256);
const ctx = canvas.getContext('2d');

// 背景
ctx.fillStyle = '#667eea';
ctx.beginPath();
ctx.arc(128, 128, 120, 0, Math.PI * 2);
ctx.fill();

// 保存
const buffer = canvas.toBuffer('image/png');
fs.writeFileSync('icon.png', buffer);
console.log('图标创建成功!');
