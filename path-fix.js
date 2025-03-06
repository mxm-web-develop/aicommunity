const fs = require('fs');
const path = require('path');

// 读取 server.js
const serverPath = path.join(__dirname, 'deploy', 'server.js');
let content = fs.readFileSync(serverPath, 'utf8');

// 修改路径引用，确保指向正确的 .next 目录
content = content.replace(/\.next/g, `../.next`);

// 写回文件
fs.writeFileSync(serverPath, content);
console.log('✅ server.js 路径已修复');
