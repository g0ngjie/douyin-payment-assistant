import { getPcEl, isPaySubmit } from "./state";

// 点击自定义金额
export function clickCustomAmount(price) {
    if (isPaySubmit()) return
    const mobSelector = '#root > div div.custom-btn'
    const pcSelector = '#root > div div.customer-recharge'
    const customSelector = !!getPcEl() ? pcSelector : mobSelector

    // 点击自定义金额
    document.querySelector(customSelector)?.click()
    // 操作金额
    setTimeout(() => {
        !!getPcEl() ? pcAmount(price) : mobAmount(price)
    }, 500);
}

function setNativeValue(element, value) {
    const valueSetter = Object.getOwnPropertyDescriptor(element, 'value').set;
    const prototype = Object.getPrototypeOf(element);
    const prototypeValueSetter = Object.getOwnPropertyDescriptor(prototype, 'value').set;

    if (valueSetter && valueSetter !== prototypeValueSetter) {
        prototypeValueSetter.call(element, value);
    } else {
        valueSetter.call(element, value);
    }
}

function fireKeyEvent(element, evtType, keyChar) {
    element.focus();
    let KeyboardEventInit = { key: keyChar, code: "", location: 0, repeat: false, isComposing: false };
    let evtObj = new KeyboardEvent(evtType, KeyboardEventInit);
    element.dispatchEvent(evtObj);
}

// 键盘输入
export function inputKey(keyCode) {
    const ke = new KeyboardEvent('keydown', {
        bubbles: true, cancelable: true, keyCode: keyCode
    });
    document.body.dispatchEvent(ke);
}

// pc金额操作
// FIXME: 注意！ PC端目前暂未调试，请使用移动端
function pcAmount(price) {
    const inputSelector = 'div.money-container > div > input'
    const input = document.querySelector(inputSelector)
    input.setAttribute("value", price)
    // inputKey(49)
    // inputKey(50)

    // input.addEventListener('keydown', function (e) {
    //     input.value += e.key;
    // }, false);

    // fireKeyEvent(input, "keydown", price);
    // setTimeout(() => {
    //     const input = document.querySelector(inputSelector)
    //     setNativeValue(input, price)
    // }, 1000);
    // input.value = price
    // input.dispatchEvent(new Event('input'))
    // input.dispatchEvent(new Event('change'))

    // 支付按钮
    const paySelector = 'div.pay-info.douyin > div.pay-button'
    const payBtn = document.querySelector(paySelector)
    payBtn.setAttribute("class", "pay-button")
    // payBtn.click()
}


// mob金额操作
async function mobAmount(price) {
    const priceStr = price + ""
    for (let i = 0; i < priceStr.length; i++) {
        const numStr = priceStr[i];
        await sleepSync(100)
        mobKeyboard(+numStr)
    }
    await sleepSync(100)
    const submitSelector = "div.number-btn > div.recharge-btn"
    const submitEl = document.querySelector(submitSelector)
    submitEl.click()
}

// 移动端输入键盘
function mobKeyboard(num) {
    const containerSelector = "div.number-container > div.number-box"
    const containerEl = document.querySelector(containerSelector)
    const childrenEl = containerEl.children
    if (+num > 9) return
    if (+num === 0) {
        childrenEl[9].click()
    } else {
        childrenEl[+num - 1].click()
    }
}

function sleepSync(time) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve()
        }, time);
    })
}

// Dom 增加蒙层
export function appendMask() {
    const container = document.createElement("div")
    container.style.cssText = `
        width: 100%;
        height: 100%;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 10000;
        background: rgba(0,0,0,.5);
        display: flex;
        justify-content: center;
        padding-top: 300px;
    `
    const labelText = document.createElement("span")
    labelText.style.cssText = `
        font-size: 30px;
        color: #FFF;
        font-weight: bold;
    `
    labelText.innerText = "自动化作业中..."
    container.appendChild(labelText)
    document.documentElement.appendChild(container)
}