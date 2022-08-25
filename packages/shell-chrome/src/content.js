console.log("douyin-payment-assistant content.js")
import {
    getStorage,
    setStorage,
    initStorage,
    isPaySubmit,
    appendMask,
} from "@dpa/inject-lib";

// 在页面上插入代码
const script = document.createElement("script");
script.setAttribute("type", "module");
script.setAttribute("src", chrome.runtime.getURL("document.js"));
document.documentElement.appendChild(script);

// 添加仪表盘
const dashboard = document.createElement("script");
dashboard.setAttribute("type", "text/javascript");
dashboard.setAttribute("src", chrome.runtime.getURL("webui.umd.cjs"));
document.documentElement.appendChild(dashboard);

initStorage().then(() => {
    dashboard.addEventListener("load", () => {
        const dashboardEl = document.createElement("dpa-dashboard")
        document.documentElement.appendChild(dashboardEl);
        dashboardEl.addEventListener("start", (event) => {
            const [userId] = event?.detail || []
            appendMask()
            setStorage("userId", userId)
            // 转发给document
            postMessage({
                type: "notice:for:document:to:userId",
                value: userId,
            });
        })
    })
    // 支付结果页面
    if (isPaySubmit()) {
        const userId = getStorage('userId', null)
        setTimeout(() => {
            postMessage({
                type: "notice:for:document:to:pay:result:url",
                value: userId
            })
        }, 1000);
    }
})