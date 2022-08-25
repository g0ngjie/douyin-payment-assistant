console.log("douyin-payment-assistant document.js")

import { clickCustomAmount, isLogin, isPayPage } from "@dpa/inject-lib";
import { connectSocket, send } from "@dpa/socket";

window.addEventListener(
    "message",
    function (event) {
        const data = event.data;
        if (data.type === "notice:for:document:to:userId") {
            const userId = data.value
            connectSocket(userId)
        }
        // 监听服务端消息
        if (data.type === "notice:for:document:to:server:msg") {
            const action = data.value
            const json = JSON.parse(action)
            if (json.type === 'price') {
                // 开始操作Dom 操作自定义金额
                // send("okkk")
                if (isPayPage() && isLogin()) {
                    clickCustomAmount(json.price)
                }
            }
        }
        // 监听服务端连接异常
        if (data.type === "notice:for:document:to:server:err") {
            const act = window.confirm("服务器连接异常!")
            if (act) location.reload()
        }
        // 支付结果页面
        if (data.type === 'notice:for:document:to:pay:result:url') {
            const userId = data.value
            connectSocket(userId)
            setTimeout(() => {
                send(window.location.href)
            }, 1000);
        }
    },
    false
);
