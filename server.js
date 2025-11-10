const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 3000;

// MIME类型映射
const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.wav': 'audio/wav',
    '.mp4': 'video/mp4',
    '.woff': 'application/font-woff',
    '.ttf': 'application/font-ttf',
    '.eot': 'application/vnd.ms-fontobject',
    '.otf': 'application/font-otf',
    '.wasm': 'application/wasm'
};

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url);
    let pathname = parsedUrl.pathname;

    // 处理根路径
    if (pathname === '/') {
        pathname = '/pages/dashboard.html';
    }

    // 处理特定的路由
    if (pathname === '/store-analysis.html') {
        pathname = '/pages/门店指标走势分析.html';
    } else if (pathname === '/nurse-radar.html') {
        pathname = '/pages/CC/护理师雷达图.html';
    } else if (pathname === '/ranking-table.html') {
        pathname = '/pages/ranking-table.html';
    }

    // 构建文件路径
    const safePath = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, '');
    const filePath = path.join(__dirname, safePath);

    // 获取文件扩展名
    const ext = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[ext] || 'application/octet-stream';

    // API路由
    if (pathname === '/api/status') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            status: 'running',
            timestamp: new Date().toISOString(),
            server: 'Node.js HTTP Server'
        }));
        return;
    }

    // 读取文件
    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                // 文件不存在
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end(`
                    <html>
                    <head><title>404 - 文件未找到</title></head>
                    <body>
                        <h1>404 - 文件未找到</h1>
                        <p>请求的文件 ${pathname} 不存在</p>
                        <p><a href="/">返回首页</a></p>
                    </body>
                    </html>
                `);
            } else {
                // 服务器错误
                res.writeHead(500, { 'Content-Type': 'text/html' });
                res.end(`
                    <html>
                    <head><title>500 - 服务器错误</title></head>
                    <body>
                        <h1>500 - 服务器错误</h1>
                        <p>服务器内部错误: ${error.code}</p>
                    </body>
                    </html>
                `);
            }
        } else {
            // 成功返回文件
            let finalContentType = contentType;
            if (ext === '.html') {
                finalContentType = 'text/html; charset=utf-8';
            } else if (ext === '.js') {
                finalContentType = 'text/javascript; charset=utf-8';
            } else if (ext === '.css') {
                finalContentType = 'text/css; charset=utf-8';
            }

            res.writeHead(200, {
                'Content-Type': finalContentType,
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization'
            });
            res.end(content, 'utf-8');
        }
    });
});

// 获取本机IP地址
function getLocalIPAddress() {
    const { networkInterfaces } = require('os');
    const nets = networkInterfaces();

    for (const name of Object.keys(nets)) {
        for (const net of nets[name]) {
            if (net.family === 'IPv4' && !net.internal) {
                return net.address;
            }
        }
    }
    return 'localhost';
}

// 启动服务器
server.listen(PORT, '0.0.0.0', () => {
    const localIP = getLocalIPAddress();
    console.log('='.repeat(50));
    console.log('🚀 数据分析仪表板服务器已启动');
    console.log('='.repeat(50));
    console.log(`📱 本地访问: http://localhost:${PORT}`);
    console.log(`🌐 局域网访问: http://${localIP}:${PORT}`);
    console.log('='.repeat(50));
    console.log('💡 提示: 确保防火墙允许3000端口访问');
    console.log('📊 导航页面: http://localhost:' + PORT);
    console.log('🏪 门店分析: http://localhost:' + PORT + '/store-analysis.html');
    console.log('📊 数据分析: http://localhost:' + PORT + '/pages/门店指标走势分析.html');
    console.log('🏆 排行榜: http://localhost:' + PORT + '/ranking-table.html');
    console.log('='.repeat(50));
});

// 优雅关闭
process.on('SIGINT', () => {
    console.log('\n🛑 正在关闭服务器...');
    server.close(() => {
        console.log('✅ 服务器已关闭');
        process.exit(0);
    });
});