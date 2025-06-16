/*
* Copyright(c) A.K.A wmcomlib.js Moduled JavaScript Function Library
* WMProject1217 Studios 2024
* FileName: Module_WindowDanmaku.js
* FileVersion: 0.1.3
* FileDescription: 快速动态动画子系统
* Author: WMProject1217
* LatestCommit: 2025-6-10
*/

export const id = 'WMWindowDanmaku';
export const name = 'WMWindowDanmaku';
export const version = '0.1.3';
export const description = 'Moduled WMWindowDanmaku.js';

let SystemContext;
let Container;

export async function _init_(context) {
    SystemContext = context;
    console.log('[WMWindowDanmaku]Initializing...');
    if (typeof Container == "undefined") {
        if (document.getElementById("WMWindowDanmaku_Container") == null) {
            Container = document.createElement("div");
            Container.className = "WMWindowDanmaku_Container";
            Container.id = "WMWindowDanmaku_Container";
            Container.style.zIndex = 3000;
            Container.style.position = "fixed";
            Container.style.top = "0px";
            Container.style.left = "0px";
            Container.style.width = "100vw";
            Container.style.height = "100vh";
            Container.style.userSelect = "none";
            Container.style.pointerEvents = "none";
            document.body.appendChild(Container);
        } else {
            Container = document.getElementById("WMWindowDanmaku_Container");
        }
    }
}

export async function _unload_() {
    if (typeof Container == "undefined") {
        Container.remove();
    } else {
        if (document.getElementById("WMWindowDanmaku_Container") != null) {
            document.getElementById("WMWindowDanmaku_Container").remove();
        }
    }
    console.log('[WMWindowDanmaku]Unloading...');
}

export async function showDanmaku(data, toplist = ["0px", "500px"], leftlist = ["0px", "250px"], opacitylist = ["0", "1"], colorlist = ["#FFFFFF", "#FFFFFF"], fontsizelist = ["24px", "24px"], transitionplist = ["top", "left", "opacity", "color", "font-size"], transitiontlist = [".5s", "3s"], stdpre = "") {
    var divx = document.createElement("div");
    divx.style = stdpre;
    divx.style.position = "fixed";
    divx.style.top = toplist[0];
    divx.style.left = leftlist[0];
    divx.style.opacity = opacitylist[0];
    divx.style.color = colorlist[0];
    divx.style.fontSize = fontsizelist[0];
    divx.style.transitionProperty = transitionplist.join(" ");
    divx.style.transitionDuration = transitiontlist[0];
    divx.innerHTML = data;
    Container.appendChild(divx);
    await sleep(16);
    for (var i = 1; i < toplist.length; i++) {
        divx.style.top = toplist[i];
        divx.style.left = leftlist[i];
        divx.style.opacity = opacitylist[i];
        divx.style.color = colorlist[i];
        divx.style.fontSize = fontsizelist[i];
        await sleep((parseFloat(transitiontlist[i]) * ((transitiontlist[i].substr(-1, 1) == "s") ? 1000 : 1)));
        await sleep(16);
    }
    divx.remove();
    return;
}