/*
* Copyright(c) A.K.A wmcomlib.js JavaScript Function Library v2
* WMProject1217 Studios 2024
* FileName: VideoPlayer.js
* FileVersion: 0.1.11
* FileDescription: 视频渲染子系统
* Author: WMProject1217
* LatestCommit: 2025-10-12
*
* PRO MANE QUOD VENTVRVM EST!
*/

export const id = 'VideoPlayer';
export const name = 'VideoPlayer';
export const namext = '视频渲染子系统';
export const author = 'WMProject1217';
export const version = '0.1.11';
export const description = 'This library is the WMWindowSystem branch for the JavaScript DOM system.';

// 系统上下文，由上级调用者提供
let SystemContext;

// 容器对象，由上级调用者提供
let Object_Container = null;

// 视频对象、弹幕解析器对象和canvas对象，以及canvas对象的上下文
let Object_Video = null;
let Object_DanmakuParser = null;
let Object_Canvas = null;
let Context_Canvas = null;

// 弹幕列表
let List_Danmaku = null;
let List_DanmakuRender = null;

// 视频和弹幕加载状态
let Status_VideoLoaded = 0;
let Status_DanmakuLoaded = 0;

// 当前的视频宽高和canvas宽高
let Status_VideoWidth = 1280;
let Status_VideoHeight = 720;
let Status_CanvasWidth = 1280;
let Status_CanvasHeight = 720;

// RenderBorder 用于决定视频画面在canvas上的绘制位置
let Status_RenderBorder_x = 0;
let Status_RenderBorder_y = 0;
let Status_RenderBorder_w = 0;
let Status_RenderBorder_h = 0;

// 关机状态计数器
let Status_Shutdown = 0;

// 弹幕循环
let Timer_DanmakuLoop = null;

// 弹幕占用记录表
let RenderLoop_DanmakuTextLineUsageTop = null;
let RenderLoop_DanmakuTextLineUsageBottom = null;
let RenderLoop_DanmakuTextLineUsageMoving = null;

export async function _init_(context) { 
    SystemContext = context;
    Object_Container = null;
    Object_Video = null;
    Object_DanmakuParser = new DOMParser();
    Object_Canvas = null;
    Context_Canvas = null;
    List_Danmaku = null;
    List_DanmakuRender = null;
    Status_VideoWidth = 1280;
    Status_VideoHeight = 720;
    Status_CanvasWidth = 1280;
    Status_CanvasHeight = 720;
    Status_RenderBorder_x = 0;
    Status_RenderBorder_y = 0;
    Status_RenderBorder_w = 0;
    Status_RenderBorder_h = 0;
    Status_Shutdown = 0;
    Timer_DanmakuLoop = null;
    RenderLoop_DanmakuTextLineUsageTop = new Set();
    RenderLoop_DanmakuTextLineUsageBottom = new Set();
    RenderLoop_DanmakuTextLineUsageMoving = new Map();
}

export async function _unload_() {
    if (Status_Shutdown == -1) { Status_Shutdown = 1; while (Status_Shutdown != 2) { await sleep(16); } }
    if (typeof Object_Video != null) { Object_Video.pause(); Object_Video.remove(); }
    if (typeof Object_Canvas != null) { Object_Canvas.remove(); }
    if (typeof Timer_DanmakuLoop != null) { clearInterval(Timer_DanmakuLoop); }
}

// 合成 RenderBorder，每当canvas或视频尺寸变化，都应修改状态然后调用此函数
function GenerateRenderBorder() {
    let originalRatio = Status_VideoWidth / Status_VideoHeight;
    let containerRatio = Status_CanvasWidth / Status_CanvasHeight;
    if (originalRatio > containerRatio) {
        Status_RenderBorder_w = Status_CanvasWidth;
        Status_RenderBorder_h = Status_CanvasWidth / originalRatio;
    } else {
        Status_RenderBorder_h = Status_CanvasHeight;
        Status_RenderBorder_w = Status_CanvasHeight * originalRatio;
    }
    Status_RenderBorder_x = parseInt((Status_CanvasWidth - Status_RenderBorder_w) / 2);
    Status_RenderBorder_y = parseInt((Status_CanvasHeight - Status_RenderBorder_h) / 2);
    Status_RenderBorder_w = parseInt(Status_RenderBorder_w);
    Status_RenderBorder_h = parseInt(Status_RenderBorder_h);
}

// 当修改canvas大小时调用此函数
export function ChangeCanvasSize(width, height) {
    Object_Canvas.width = width;
    Object_Canvas.height = height;
    Status_CanvasWidth = width;
    Status_CanvasHeight = height;
    GenerateRenderBorder();
}

function RenderLoop_DrawTextLine(fontsize, color, text, x, y) {
    Context_Canvas.font = fontsize + "px pagefont_default";
    Context_Canvas.shadowColor = 'rgba(0, 0, 0, 0.5)';
    Context_Canvas.shadowOffsetX = 1;
    Context_Canvas.shadowOffsetY = 1;
    Context_Canvas.shadowBlur = 10;
    Context_Canvas.fillStyle = color;
    Context_Canvas.textAlign = "left";
    Context_Canvas.textBaseline = "top";
    Context_Canvas.fillText(text, x, y);
}

function RenderLoop_DrawTextLineCentered(fontsize, color, text, position) {
    Context_Canvas.font = fontsize + "px pagefont_default";
    Context_Canvas.shadowColor = 'rgba(0, 0, 0, 0.5)';
    Context_Canvas.shadowOffsetX = 1;
    Context_Canvas.shadowOffsetY = 1;
    Context_Canvas.shadowBlur = 10;
    Context_Canvas.fillStyle = color;
    Context_Canvas.textAlign = "center";
    Context_Canvas.textBaseline = "top";
    Context_Canvas.fillText(text, parseInt(Status_CanvasWidth / 2), position);
}

function RenderLoop_DanmakuMoving_FindAvailableLine(danmakuStartTime, danmakuWidth, danmakuDuration) {
    // 计算弹幕的移动速度（像素/秒）
    // const danmakuSpeed = (Status_CanvasWidth + danmakuWidth) / danmakuDuration;
    // 计算弹幕完全离开屏幕的时间
    // const exitTime = danmakuStartTime + (Status_CanvasWidth + danmakuWidth) / danmakuSpeed;
    
    let bestLine = -1;
    let minOverlap = Infinity;
    let earliestAvailableLine = -1;
    let earliestAvailableTime = Infinity;

    let RenderLoop_MaxDanmakuLines = parseInt(Status_CanvasHeight / 32);
    
    // 检查所有可能的行
    for (let line = 0; line < RenderLoop_MaxDanmakuLines; line++) {
        const lineUsage = RenderLoop_DanmakuTextLineUsageMoving.get(line);
        
        if (!lineUsage || lineUsage.endTime <= danmakuStartTime) {
            // 如果行完全空闲，直接返回
            earliestAvailableLine = line;
            break;
        }
        
        // 计算重叠程度（时间重叠）
        const overlap = Math.max(0, lineUsage.endTime - danmakuStartTime);
        
        if (overlap < minOverlap) {
            minOverlap = overlap;
            bestLine = line;
        }
        
        // 同时记录最早可用的行
        if (lineUsage.endTime < earliestAvailableTime) {
            earliestAvailableTime = lineUsage.endTime;
            earliestAvailableLine = line;
        }
    }
    
    // 优先返回完全空闲的行
    if (earliestAvailableLine !== -1 && 
        (!RenderLoop_DanmakuTextLineUsageMoving.has(earliestAvailableLine) || 
         RenderLoop_DanmakuTextLineUsageMoving.get(earliestAvailableLine).endTime <= danmakuStartTime)) {
        return earliestAvailableLine;
    }
    
    // 如果没有完全空闲的行，返回重叠最小的行
    if (bestLine !== -1) {
        return bestLine;
    }
    
    // 如果所有行都满了，返回最早可用的行
    return earliestAvailableLine !== -1 ? earliestAvailableLine : 0;
}

// 渲染循环
// [time, type(WM), fontsize, color(WM), text]
// type(WM) 0 => 滚动弹幕, 1 => 顶部弹幕, 2 => 底部弹幕, 3 => 逆向弹幕, 16 => 特殊弹幕(BiliBili), 17 => 精确弹幕(BiliBili), 18 => BAS弹幕(BiliBili)
function RenderLoop() {
    //if (Object_Video.paused || Object_Video.ended) return;
    if (Status_Shutdown == 1) { Status_Shutdown = 2; return; }
    if (Object_Video.ended && (Config_Current.LoopWhenEnd == 1)) {
        Object_Video.currentTime = 0;
        Object_Video.play();
    }
    Context_Canvas.fillStyle = "#000000";
    Context_Canvas.fillRect(0, 0, Status_CanvasWidth, Status_CanvasHeight);
    if (Status_VideoLoaded == 1) {
        Context_Canvas.drawImage(Object_Video, 0, 0, Status_VideoWidth, Status_VideoHeight, Status_RenderBorder_x, Status_RenderBorder_y, Status_RenderBorder_w, Status_RenderBorder_h);
    }
    if (Config_Current.ShowDanmaku == 1 && Status_DanmakuLoaded == 1) {
        //fucked.innerHTML = Object_Video.currentTime.toFixed(2) + ", Danmakus: " + List_DanmakuRender.length + " ,TopDanmakuUsage: " + RenderLoop_DanmakuTextLineUsageTop.size + " ,BottomDanmakuUsage: " + RenderLoop_DanmakuTextLineUsageBottom.size;
        List_DanmakuRender.forEach((value, index) => {
            switch(List_Danmaku[value[0]][1]) {
                case 0:
                    if (value.length > 1) {
                        // 时间 DanmakuMovingDanmakuTime 内，元素从 left = Status_CanvasWidth 移动到 left = -width，因此总共需要移动 (Status_CanvasWidth + width) 像素
                        // 按照时间比例计算
                        //let leftdx = Status_CanvasWidth - (Status_CanvasWidth + value[1]) * ((Object_Video.currentTime - List_Danmaku[value[0]][0]) / Config_Current.DanmakuMovingDanmakuTime);
                        let leftdx = Status_CanvasWidth + (-value[1] - Status_CanvasWidth) * (Object_Video.currentTime - List_Danmaku[value[0]][0]) / Config_Current.DanmakuMovingDanmakuTime;
                        RenderLoop_DrawTextLine(List_Danmaku[value[0]][2], List_Danmaku[value[0]][3], List_Danmaku[value[0]][4], leftdx, 8 + List_DanmakuRender[index][2] * 32);
                    } else {
                        Context_Canvas.font = List_DanmakuRender[index][2] + "px pagefont_default";
                        const textWidth = Context_Canvas.measureText(List_Danmaku[value[0]][4]).width;
                        List_DanmakuRender[index][1] = textWidth;
                        
                        // 寻找合适的行
                        const selectedLine = RenderLoop_DanmakuMoving_FindAvailableLine(
                            List_Danmaku[value[0]][0], 
                            textWidth, 
                            Config_Current.DanmakuMovingDanmakuTime
                        );
                        
                        List_DanmakuRender[index][2] = selectedLine;
                        
                        // 记录该行的占用情况
                        const exitTime = List_Danmaku[value[0]][0] + 
                            (Status_CanvasWidth + textWidth) / 
                            ((Status_CanvasWidth + textWidth) / Config_Current.DanmakuMovingDanmakuTime);
                        
                        RenderLoop_DanmakuTextLineUsageMoving.set(selectedLine, {
                            startTime: List_Danmaku[value[0]][0],
                            endTime: exitTime,
                            width: textWidth
                        });
                        
                        RenderLoop_DrawTextLine(List_Danmaku[value[0]][2], List_Danmaku[value[0]][3], List_Danmaku[value[0]][4], Status_CanvasWidth, 8 + selectedLine * 32);
                    }
                    //fucked.innerHTML = fucked.innerHTML + List_Danmaku[value[0]].join(",") + "<br>";
                    break;
                case 1:
                    if (value.length > 1) {
                        // 按照已有行绘制
                        RenderLoop_DrawTextLineCentered(List_Danmaku[value[0]][2], List_Danmaku[value[0]][3], List_Danmaku[value[0]][4], 8 + value[1] * 32);
                    } else {
                        // 寻找空闲行并绘制上
                        let currentIndex = 0;
                        let finalIndex = 0;
                        while (RenderLoop_DanmakuTextLineUsageTop.has(currentIndex)) { currentIndex++; finalIndex++; if ((8 + finalIndex * 32) > Status_CanvasHeight) { finalIndex = 0; } }
                        RenderLoop_DanmakuTextLineUsageTop.add(currentIndex);
                        List_DanmakuRender[index][1] = finalIndex;
                        RenderLoop_DrawTextLineCentered(List_Danmaku[value[0]][2], List_Danmaku[value[0]][3], List_Danmaku[value[0]][4], 8 + value[1] * 32);
                    }
                    //fucked.innerHTML = fucked.innerHTML + List_Danmaku[value[0]].join(",") + "<br>";
                    break;
                case 2:
                    if (value.length > 1) {
                        // 按照已有行绘制
                        RenderLoop_DrawTextLineCentered(List_Danmaku[value[0]][2], List_Danmaku[value[0]][3], List_Danmaku[value[0]][4], Status_CanvasHeight - value[1] * 32 - 25 - 8);
                    } else {
                        // 寻找空闲行并绘制上
                        let currentIndex = 0;
                        let finalIndex = 0;
                        while (RenderLoop_DanmakuTextLineUsageBottom.has(currentIndex)) { currentIndex++; finalIndex++; if ((8 + finalIndex * 32) > Status_CanvasHeight) { finalIndex = 0; } }
                        RenderLoop_DanmakuTextLineUsageBottom.add(currentIndex);
                        List_DanmakuRender[index][1] = finalIndex;
                        RenderLoop_DrawTextLineCentered(List_Danmaku[value[0]][2], List_Danmaku[value[0]][3], List_Danmaku[value[0]][4], Status_CanvasHeight - value[1] * 32 - 25 - 8);
                    }
                    //fucked.innerHTML = fucked.innerHTML + List_Danmaku[value[0]].join(",") + "<br>";
                    break;
                case 3:
                    if (value.length > 1) {
                        // 时间 DanmakuMovingDanmakuTime 内，元素从 left = -width 移动到 left = Status_CanvasWidth ，因此总共需要移动 (Status_CanvasWidth + width) 像素
                        // 按照时间比例计算
                        //let leftdx = (Status_CanvasWidth + value[1]) * ((Object_Video.currentTime - List_Danmaku[value[0]][0]) / Config_Current.DanmakuMovingDanmakuTime) - value[2];
                        let leftdx = -value[1] + (Status_CanvasWidth + value[1]) * (Object_Video.currentTime - List_Danmaku[value[0]][0]) / Config_Current.DanmakuMovingDanmakuTime;
                        RenderLoop_DrawTextLine(List_Danmaku[value[0]][2], List_Danmaku[value[0]][3], List_Danmaku[value[0]][4], leftdx, 8 + List_DanmakuRender[index][2] * 32);
                    } else {
                        // 需要评估文本宽度并存入
                        Context_Canvas.font = List_DanmakuRender[index][2] + "px pagefont_default";
                        List_DanmakuRender[index][1] = Context_Canvas.measureText(List_Danmaku[value[0]][4]).width;
                        // 需要获取所在行并存入
                        List_DanmakuRender[index][2] = parseInt(Math.random() * 20);
                        // 最开始时，left 一定为 -width
                        RenderLoop_DrawTextLine(List_Danmaku[value[0]][2], List_Danmaku[value[0]][3], List_Danmaku[value[0]][4], -List_DanmakuRender[index][1], 8 + List_DanmakuRender[index][2] * 32);
                    }
                    //fucked.innerHTML = fucked.innerHTML + List_Danmaku[value[0]].join(",") + "<br>";
                    break;
            }
        });
    }
    requestAnimationFrame(RenderLoop);
}

function DanmakuLoop_EnsureElementFromArray(elementToEnsure, array = List_DanmakuRender) {
    return array.some((element, index) => { return (element[0] == elementToEnsure); });
}

function DanmakuLoop_GetElementIndexFromArray(elementToEnsure, array = List_DanmakuRender) {
    let indexdx = -1;
    if (array.some((element, index) => { indexdx = index; return (element[0] == elementToEnsure); })) {
        return indexdx;
    }
    return null;
}

function DanmakuLoop_RemoveElementFromArray(elementToRemove, array = List_DanmakuRender) {
    let indexdx = -1;
    if (array.some((element, index) => { indexdx = index; return (element[0] == elementToRemove); })) {
        array.splice(indexdx, 1);
    }
    return;
}

// 弹幕处理器循环
// [time, type(WM), fontsize, color(WM), text]
// type(WM) 0 => 滚动弹幕, 1 => 顶部弹幕, 2 => 底部弹幕, 3 => 逆向弹幕, 16 => 特殊弹幕(BiliBili), 17 => 精确弹幕(BiliBili), 18 => BAS弹幕(BiliBili)
function DanmakuLoop() {
    if (Config_Current.ShowDanmaku == 0) { return; }
    List_Danmaku.forEach((value, index) => {
        switch(value[1]) {
            case 0:
                if (((Object_Video.currentTime - value[0]) > 0) && ((Object_Video.currentTime - value[0]) < (Config_Current.DanmakuMovingDanmakuTime + 0.2))) {
                    if (!DanmakuLoop_EnsureElementFromArray(index)) { List_DanmakuRender[List_DanmakuRender.length] = [index]; }
                } else {
                    if (DanmakuLoop_EnsureElementFromArray(index)) { 
                        let objindex = DanmakuLoop_GetElementIndexFromArray(index);
                        if (objindex != null) {
                            if (List_DanmakuRender[objindex].length > 1) {
                                if (RenderLoop_DanmakuTextLineUsageMoving.has(List_DanmakuRender[objindex][2])) {
                                    RenderLoop_DanmakuTextLineUsageMoving.delete(List_DanmakuRender[objindex][2]);
                                }
                            }
                        }
                        DanmakuLoop_RemoveElementFromArray(index); 
                    }
                }
                break;
            case 1:
                if (((Object_Video.currentTime - value[0]) > 0) && ((Object_Video.currentTime - value[0]) < Config_Current.DanmakuTopDanmakuTime)) {
                    if (!DanmakuLoop_EnsureElementFromArray(index)) { List_DanmakuRender[List_DanmakuRender.length] = [index]; }
                } else {
                    if (DanmakuLoop_EnsureElementFromArray(index)) { 
                        let objindex = DanmakuLoop_GetElementIndexFromArray(index);
                        if (objindex != null) {
                            if (List_DanmakuRender[objindex].length > 1) {
                                if (RenderLoop_DanmakuTextLineUsageTop.has(List_DanmakuRender[objindex][1])) {
                                    RenderLoop_DanmakuTextLineUsageTop.delete(List_DanmakuRender[objindex][1]);
                                }
                            }
                        }
                        DanmakuLoop_RemoveElementFromArray(index); 
                    }
                }
                break;
            case 2:
                if (((Object_Video.currentTime - value[0]) > 0) && ((Object_Video.currentTime - value[0]) < Config_Current.DanmakuBottomDanmakuTime)) {
                    if (!DanmakuLoop_EnsureElementFromArray(index)) { List_DanmakuRender[List_DanmakuRender.length] = [index]; }
                } else {
                    if (DanmakuLoop_EnsureElementFromArray(index)) { 
                        let objindex = DanmakuLoop_GetElementIndexFromArray(index);
                        if (objindex != null) {
                            if (List_DanmakuRender[objindex].length > 1) {
                                if (RenderLoop_DanmakuTextLineUsageBottom.has(List_DanmakuRender[objindex][1])) {
                                    RenderLoop_DanmakuTextLineUsageBottom.delete(List_DanmakuRender[objindex][1]);
                                }
                            }
                        }
                        DanmakuLoop_RemoveElementFromArray(index); 
                    }
                }
                break;
            case 3:
                if (((Object_Video.currentTime - value[0]) > 0) && ((Object_Video.currentTime - value[0]) < (Config_Current.DanmakuMovingDanmakuTime + 0.2))) {
                    if (!DanmakuLoop_EnsureElementFromArray(index)) { List_DanmakuRender[List_DanmakuRender.length] = [index]; }
                } else {
                    if (DanmakuLoop_EnsureElementFromArray(index)) { 
                        DanmakuLoop_RemoveElementFromArray(index); 
                    }
                }
                break;
        }
    });
}

let Config_DefaultConfig = {
    VideoType: 0,
    VideoPath: "./video.mp4",
    EnableDanmaku: 1,
    ShowDanmaku: 1,
    DanmakuType: 1,
    DanmakuPath: "./danmaku.xml",
    LoopWhenEnd: 1,
    AutoPlayWhenLoaded: 1,
    DanmakuTopDanmakuTime: 6,
    DanmakuBottomDanmakuTime: 6,
    DanmakuMovingDanmakuTime: 10,
    DisableContainer: 0
};
let Config_Current = null;

export async function Initialize(pCont, config = Config_DefaultConfig) {
    Object_Container = pCont;
    Config_Current = config;
    Status_VideoLoaded = 0;
    Status_DanmakuLoaded = 0;
  
    // 创建canvas元素
    Object_Canvas = document.createElement('canvas');
    Object_Canvas.width = Status_CanvasWidth;
    Object_Canvas.height = Status_CanvasHeight;
    Object_Canvas.style.border = '1px solid black';
  
    // 将canvas元素添加到容器中
    if (Config_Current.DisableContainer != 1) {
        Object_Container.appendChild(Object_Canvas);
    }
  
    // 获取canvas上下文
    Context_Canvas = Object_Canvas.getContext('2d');
    
    // 立即启动渲染循环
    setTimeout(RenderLoop, 1);
    Status_Shutdown = -1;

    /*
    // 初始化弹幕
    if (Config_Current.EnableDanmaku == 1) {
        List_Danmaku = new Array();
        List_DanmakuRender = new Array();
        let DanmakuUrlDX = Config_Current.DanmakuPath;
        if (typeof SystemContext.lib.AssetsLoader != 'undefined') {
            DanmakuUrlDX = await _genesis_.lib.AssetsLoader.RequireFileUrlByFileUrl(Config_Current.DanmakuPath);
        }
        fetch(DanmakuUrlDX)
            .then(response => response.text())
            .then(str => Object_DanmakuParser.parseFromString(str, "text/xml"))
            .then(xmlDoc => {
                Array.from(xmlDoc.getElementsByTagName("i")[0].getElementsByTagName("d")).forEach((value) => {
                    let listx = value.getAttribute("p").split(",");
                    let wmtype = 0;
                    let wmcolor = "RGB(255, 255, 255)";
                    // [time, type(WM), fontsize, color(WM), text]
                    // type(WM) 0 => 滚动弹幕, 1 => 顶部弹幕, 2 => 底部弹幕, 3 => 逆向弹幕, 16 => 特殊弹幕(BiliBili), 17 => 精确弹幕(BiliBili), 18 => BAS弹幕(BiliBili)
                    switch(parseInt(listx[1])) {
                        case 1: wmtype = 0; break;
                        case 4: wmtype = 2; break;
                        case 5: wmtype = 1; break;
                        case 6: wmtype = 3; break;
                        case 7: 
                            if (parseInt(listx[5]) == 0) { wmtype = 16; }
                            if (parseInt(listx[5]) == 1) { wmtype = 17; }
                            break;
                        case 8:
                            if (parseInt(listx[5]) == 2) { wmtype = 18; }
                            break;
                    }
                    let color = parseInt(listx[3]);
                    wmcolor = "RGB(" + ((color >> 16) & 0xFF) + "," + ((color >> 8) & 0xFF) + "," + (color & 0xFF) + ")";
                    List_Danmaku[List_Danmaku.length] = [parseFloat(listx[0]), wmtype, parseInt(listx[2]), wmcolor, value.innerHTML];
                });
                Status_DanmakuLoaded = 1;
                Timer_DanmakuLoop = setInterval(DanmakuLoop, 32);
            });
    }*/
    
    // 创建视频对象
    Object_Video = document.createElement('video');
  
    // 设置视频源
    if (typeof SystemContext.lib["AssetsLoader"] != 'undefined') {
        Object_Video.src = await _genesis_.lib.AssetsLoader.RequireFileUrlByFileUrl(Config_Current.VideoPath);
    } else {
        Object_Video.src = Config_Current.VideoPath;
    }
    Object_Video.crossOrigin = 'anonymous';

    // 初始化弹幕
    if (Config_Current.EnableDanmaku == 1) {
        List_Danmaku = new Array();
        List_DanmakuRender = new Array();
        let response = null;
        
        // 设置视频源
        if (typeof SystemContext.lib["AssetsLoader"] != 'undefined') {
            response = await fetch(await _genesis_.lib.AssetsLoader.RequireFileUrlByFileUrl(Config_Current.DanmakuPath));
        } else {
            response = await fetch(Config_Current.DanmakuPath);
        }
        let str = await response.text();
        let xmlDoc = Object_DanmakuParser.parseFromString(str, "text/xml");
        
        let dElements = xmlDoc.getElementsByTagName("i")[0].getElementsByTagName("d");
        for (let i = 0; i < dElements.length; i++) {
            let value = dElements[i];
            let listx = value.getAttribute("p").split(",");
            let wmtype = 0;
            let wmcolor = "RGB(255, 255, 255)";
            
            // [time, type(WM), fontsize, color(WM), text]
            // type(WM) 0 => 滚动弹幕, 1 => 顶部弹幕, 2 => 底部弹幕, 3 => 逆向弹幕, 16 => 特殊弹幕(BiliBili), 17 => 精确弹幕(BiliBili), 18 => BAS弹幕(BiliBili)
            switch(parseInt(listx[1])) {
                case 1: wmtype = 0; break;
                case 4: wmtype = 2; break;
                case 5: wmtype = 1; break;
                case 6: wmtype = 3; break;
                case 7: 
                    if (parseInt(listx[5]) == 0) { wmtype = 16; }
                    if (parseInt(listx[5]) == 1) { wmtype = 17; }
                    break;
                case 8:
                    if (parseInt(listx[5]) == 2) { wmtype = 18; }
                    break;
            }
            
            let color = parseInt(listx[3]);
            wmcolor = "RGB(" + ((color >> 16) & 0xFF) + "," + ((color >> 8) & 0xFF) + "," + (color & 0xFF) + ")";
            List_Danmaku[List_Danmaku.length] = [parseFloat(listx[0]), wmtype, parseInt(listx[2]), wmcolor, value.innerHTML];
        }
        
        Status_DanmakuLoaded = 1;
        Timer_DanmakuLoop = setInterval(DanmakuLoop, 32);
    }
  
    // 当视频元数据加载完成后，更新尺寸状态数据
    Object_Video.addEventListener('loadedmetadata', function() {
        Status_VideoWidth = Object_Video.videoWidth;
        Status_VideoHeight = Object_Video.videoHeight;
        GenerateRenderBorder();
    });
  
    // 视频可以播放时立即开始播放
    Object_Video.addEventListener('canplay', function() {
        Status_VideoLoaded = 1;
        if (Config_Current.AutoPlayWhenLoaded == 1) {
            Object_Video.play();
        }
    });
}

export function GetObjectVideo() { return Object_Video; }
export function GetObjectCanvas() { return Object_Canvas; }
export function GetCurrentConfig() { return Config_Current; }
