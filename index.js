// TODO: 

const objects = {
    "main": {
        "attack": ["card", 5],
        "noble": ["card", 3],
        "skill": ["button", 9],
        "m_skill": ["button", 3],
        "select": ["button", 1],
        "master": ["button", 1],
    },
    "sub": {
        "skill_target": ["button", 3],
        "ochange_target": ["button", 6],
        "ochange_ok": ["button", 1],
        "decide": ["button", 1],
        "renda": ["button", 1],
        "yes": ["button", 1],
        "apple": ["button", 1],
        "support": ["button", 1],
    }
}

let headerText = "loop 200\n\n"
let outPutTexArray = [];
let footerText = "";

let mainArea = document.getElementById("mainArea");
let subArea = document.getElementById("subArea");
let outputTextArea = document.getElementById("outputTextArea");

let loopNumBox = document.getElementById("loopNumBox");
let NPWaitTimeBox = document.getElementById("NPWaitTimeBox");
let NPWaitAddButton = document.getElementById("NPWaitAddButton");
let turnButton = document.getElementById("turnButton");

loopNumBox.addEventListener("input", () => {
    headerText = `loop ${loopNumBox.value}\n`;
    changeOutputText();
});

NPWaitAddButton.addEventListener("click", () => {
    outPutTexArray.push(`wait ${npWaitTime}\n`);
    changeOutputText();
});

turnButton.addEventListener("click", () => {
    // rendaのkeyを取得
    let rendaKey = getCookie("renda1");
    if (rendaKey === null || rendaKey === "") {
        rendaKey = "renda1キーを設定してください";
    }
    let text = `keyDown ${rendaKey}\nkeyUp ${rendaKey}\nwait 5500\nkeyDown ${rendaKey}\nkeyUp ${rendaKey}\nwait 3500\n`;
// keyDown Space
// keyUp Space
// wait 5500
// keyDown Space
// keyUp Space
// wait 3500
    outPutTexArray.push(text);
    changeOutputText();
});

let configButton = document.getElementById("configButton");
let isDoubleButton = document.getElementById("isDoubleButton");



let npWaitTime = 14000;

NPWaitTimeBox.addEventListener("input", () => {
    npWaitTime = NPWaitTimeBox.value !== "" && !isNaN(NPWaitTimeBox.value) ? NPWaitTimeBox.value : 14000;
});

let isConfigMode = false;
let isDouble = true;

configButton.checked = false;
configButton.defaultChecked = false;
isDoubleButton.checked = true;
isDoubleButton.defaultChecked = true;

configButton.addEventListener("change", (e) => {
    let inputKeyBoxes = document.getElementsByClassName("inputKeyBox");
    isConfigMode = e.target.checked;
    for (let i = 0; i < inputKeyBoxes.length; i++) {
        inputKeyBoxes[i].disabled = !isConfigMode;
    }
    // invisibleButton の表示・非表示を切り替える
    let invisibleButtons = document.getElementsByClassName("invisibleButton");
    for (let i = 0; i < invisibleButtons.length; i++) {
        invisibleButtons[i].classList.toggle("displayNone");
    }
});

isDoubleButton.addEventListener("change", (e) => {
    isDouble = e.target.checked;
});

for (const kind in objects) {
    for (const key in objects[kind]) {
        const count = objects[kind][key][1];
        for (let i = 1; i <= count; i++) {
            let card = document.createElement('div');
            card.classList.add(objects[kind][key][0]);
            card.classList.add(key + i);
            let inputKeyBox = document.createElement('input');
            inputKeyBox.type = 'text';
            inputKeyBox.classList.add('inputKeyBox');
            inputKeyBox.placeholder = key + i;
            inputKeyBox.id = key + i;
            inputKeyBox.title = key + i;
            inputKeyBox.disabled = !isConfigMode;
            // もし cookie に保存されていたら、それを表示する
            const cookie = getCookie(key + i);
            if (cookie) {
                inputKeyBox.value = cookie;
            }
            inputKeyBox.addEventListener("input", () => {
                // cookie に保存する
                setCookie(key + i, inputKeyBox.value);
            });
            // 当たり判定用の透明なボタンを作成
            let invisibleButton = document.createElement('button');
            invisibleButton.classList.add('invisibleButton');
            invisibleButton.textContent = "";
            invisibleButton.addEventListener("click", () => {
                if (!isConfigMode) {
                    // Config モードでない場合の処理
                    if (inputKeyBox.value === "") { return; }
                    outPutTexArray.push(makeCommand(inputKeyBox.value, inputKeyBox.id));
                    changeOutputText();
                    }
            });
            card.appendChild(invisibleButton);
            card.appendChild(inputKeyBox);
            switch (kind) {
                case "main":
                    mainArea.appendChild(card);
                    break;
                case "sub":
                    subArea.appendChild(card);
                    break;
            }
        }
    }
}

const initialHeight = outputTextArea.scrollHeight;

outputTextArea.addEventListener("input", () => {
    const newHeight = outputTextArea.scrollHeight;
    if (Math.abs(newHeight - initialHeight) == 0) {
        outputTextArea.style.height = "auto";
        outputTextArea.style.height = newHeight + "px";
    }
});

document.addEventListener("DOMContentLoaded", () => {
    outputTextArea.style.height = "auto";
    outputTextArea.style.height = outputTextArea.scrollHeight + "px";
    // outPutTextArea の初期値を設定する
    let decide1 = getCookie("decide1");
    let yes1 = getCookie("yes1");
    let apple1 = getCookie("apple1");
    let support1 = getCookie("support1");
    let renda1 = getCookie("renda1");

    footerText = `\n#--end--\n# 画面飛ばす\nloop 28\nkeyDown Enter\nkeyUp Enter\nwait 400\nloopEnd\n# end\nwait 500\n
# 連続出撃\nkeyDown ${yes1}\nkeyUp ${yes1}\nwait 1000\n#\n# リンゴ\nkeyDown ${apple1}\nkeyUp ${apple1}\nwait 500\nkeyDown ${yes1}\nkeyUp ${yes1}\nwait 6000\n#\n# サポート一番上\nkeyDown ${support1}\nkeyUp ${support1}\nwait 5000\n#\nkeyDown ${renda1}\nkeyUp ${renda1}\nwait 3000\n#\nloopEnd\n`;
    changeOutputText();
});

function changeOutputText() {
    outputTextArea.value = headerText + outPutTexArray.join("") + footerText;
    // textArea の高さを自動調整する
    outputTextArea.style.height = "auto";
    outputTextArea.style.height = outputTextArea.scrollHeight + "px";
}

function makeCommand(key, keyID) {
    let isDoubleLocal = isDouble;
    let time1 = 250;
    let time2 = 1300;
    // 特例だけはここで処理する
    switch (keyID) {
        case "select1":
            time1 = 500;
            isDoubleLocal = false;
            break;
    }
    let text = "";
    if (isDoubleLocal) {
        text = `keyDown ${key}\nkeyUp ${key}\nwait ${time1}#\nkeyDown ${key}\nkeyUp ${key}\nwait ${time2}\n###\n`;
    } else {
        text = `keyDown ${key}\nkeyUp ${key}\nwait ${time1}\n#\n`;
    }
    return text;
}

function setCookie(key, value) {
    // 有効期限はなし(100年)
    document.cookie = key + "=" + encodeURIComponent(value) + "; SameSite=Strict; max-age=3153600000; ";
}

function getCookie(name) {
    var cookieName = name + "=";
    var cookies = document.cookie.split(';');
    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i].trim();
        if (cookie.indexOf(cookieName) === 0) {
            return decodeURIComponent(cookie.substring(cookieName.length, cookie.length));
        }
    }
    return null;
}

// 入力の部分のズーム対策
var ua = navigator.userAgent.toLowerCase();
var isiOS = (ua.indexOf('iphone') > -1) || (ua.indexOf('ipad') > -1);
if (isiOS) {
    var viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
        var viewportContent = viewport.getAttribute('content');
        viewport.setAttribute('content', viewportContent + ', user-scalable=no');
    }
}
