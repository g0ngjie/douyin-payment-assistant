
// 检测是否为pc环境
export function getPcEl() {
    const rechargePcBox = document.querySelector("#root > div > div.page-box.douyin > div");
    // console.log("[debug]rechargePcBox:", rechargePcBox)
    return rechargePcBox
}

// 检测是否为手机环境
export function getMobEl() {
    const rechargeMobBox = document.querySelector("#root > div > div.scroll > div.recharge-user-container");
    return rechargeMobBox
}

// 检测当前页面是否是用户已登陆状态
export function isLogin() {
    const pcEl = getPcEl();
    if (pcEl) {
        // pc端 判断是否登陆
        // 查看是否存在login-container 容器，如果有则存在未登陆状态
        const findPcLogin = pcEl.querySelector(".login-container");
        // console.log("[debug]findPcLogin:", findPcLogin)
        if (findPcLogin) return false
    }

    const mobEl = getMobEl();
    if (mobEl) {
        // mob端 判断是否登陆
        // 查看是否存在header-container 容器，如果有则存在未登陆状态
        const findMobLogin = mobEl.querySelector(".header-container");
        // console.log("[debug]findMobLogin:", findMobLogin)
        if (findMobLogin) return false
    }
    return true
}

// 检测是否为付款页面
export function isPaySubmit() {
    return window.location.href.includes("https://tp-pay.snssdk.com/cashdesk")
}

// 检测当前页面是否是支付页面
export function isPayPage() {
    return window.location.href.includes("https://www.douyin.com/pay")
}

// 等待dom加载完成
export function waitForDomLoaded() {
    return new Promise(resolve => {
        if (document.readyState !== "loading") {
            resolve()
        } else {
            document.addEventListener("DOMContentLoaded", () => {
                resolve()
            })
        }
    })
}