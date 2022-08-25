const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const { join } = require('path');

const app = express();
app.use(express.static(join(__dirname, 'admin')));

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let clients = null
wss.on('connection', function connection(ws) {
    console.log('开始连接！');

    ws.on('message', function incoming(data) {
        //  解析 Buffer
        const buffer = Buffer.from(data);
        let message = buffer.toString();
        if (message === 'ping') {
            console.log(`[${new Date().toLocaleString()}][心跳检测] ping~ pong~`)
            /**
             * 把消息发送到所有的客户端
             * wss.clients获取所有链接的客户端
             */
            wss.clients.forEach(function each(client) {
                client.send("pong");
            });
        }
        if (message.startsWith("https://tp-pay.snssdk.com/cashdesk")) {
            console.log("----------------------------\n")
            console.log(message)
            console.log("\n----------------------------")
        }
    });
    clients = wss.clients
});

// 路由
app.get('/api/send', (req, res) => {
    const { price } = req.query;
    clients.forEach((client) => {
        client.send(JSON.stringify({ type: "price", price }));
    })
    res.json({
        code: 100,
        message: '发送成功'
    })
});
// 连接状态
app.get('/api/linked', (req, res) => {
    res.json({
        code: 100,
        data: !!clients,
        message: ''
    })
});


server.listen(8084, function listening() {
    console.log('服务器启动成功！');
});