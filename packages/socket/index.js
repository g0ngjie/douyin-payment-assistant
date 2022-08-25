
let websocket = null;
let lockReconnect = false;  //避免ws重复连接
let userId = null;
let errCounter = 0; // 错误连接计数器
let reConnTimeoutId = null

//连接webSocket
export function connectSocket(id) {
    //判断当前浏览器是否支持WebSocket, 主要此处要更换为自己的地址
    if ('WebSocket' in window) {
        if (id) userId = id;
        try {
            const url = __DOUYIN_PAYMENT_WS_URL__ || "ws://localhost:8084"
            websocket = new WebSocket(url);
            initEvent();
        } catch (e) {
            reconnect();
            console.log(e);
        }
    } else {
        alert('Not support websocket')
    }
}

function initEvent() {
    //连接发生错误的回调方法
    websocket.onerror = function (e) {
        errCounter++
        reconnect();
        console.log("连接错误!");
    };

    //连接成功建立的回调方法
    websocket.onopen = function (event) {
        heartCheck.reset().start();      //心跳检测重置
    }

    //接收到消息的回调方法
    websocket.onmessage = function (event) {
        heartCheck.reset().start();
        console.log("收到消息啦:" + event.data);
        errCounter = 0
        if (event.data !== "pong") actionFor(event.data);
    }

    //连接关闭的回调方法
    websocket.onclose = function (e) {
        reconnect();
        console.log("连接关闭!" + new Date().toLocaleString());
    }
}

//监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
onbeforeunload = function () {
    websocket?.close();
}

//操作Dom元素
function actionFor(data) {
    postMessage({
        type: "notice:for:document:to:server:msg",
        value: data
    })
}

// 服务器请求异常
function noticeErr() {
    postMessage({
        type: "notice:for:document:to:server:err",
        value: null
    })
}

//关闭连接
function closeWebSocket() {
    websocket.close();
}

//发送消息
export function send(message) {
    websocket.send(message);
}

//重连
function reconnect() {
    if (lockReconnect) return;
    lockReconnect = true;
    reConnTimeoutId = setTimeout(function () {     //没连接上会一直重连，设置延迟避免请求过多
        // 最大连接尝试5次
        if (errCounter >= 5) {
            clearTimeout(reConnTimeoutId)
            console.log("终止连接尝试!")
            lockReconnect = false
            noticeErr()
        } else {
            connectSocket();
            lockReconnect = false;
        }
    }, 2000);
}

//心跳检测
const heartCheck = {
    timeout: 5000,        //1分钟发一次心跳
    timeoutObj: null,
    serverTimeoutObj: null,
    reset: function () {
        clearTimeout(this.timeoutObj);
        clearTimeout(this.serverTimeoutObj);
        return this;
    },
    start: function () {
        const self = this;
        this.timeoutObj = setTimeout(function () {
            //这里发送一个心跳，后端收到后，返回一个心跳消息，
            //onmessage拿到返回的心跳就说明连接正常
            send("ping");
            self.serverTimeoutObj = setTimeout(function () {//如果超过一定时间还没重置，说明后端主动断开了
                websocket.close();     //如果onclose会执行reconnect，我们执行ws.close()就行了.如果直接执行reconnect 会触发onclose导致重连两次
            }, self.timeout)
        }, this.timeout)
    }
}