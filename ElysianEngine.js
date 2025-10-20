/*
* Copyright(c) A.K.A wmcomlib.js JavaScript Function Library v2
* WMProject1217 Studios 2024
* FileName: ElysianEngine.js
* FileVersion: 1.6.5
* FileDescription: 剧情播放子系统
* Author: WMProject1217
* LatestCommit: 2025-10-4
*
* FOR THE DAWN THAT SHALL ARRIVE!
*/

export const id = 'ElysianEngine';
export const name = 'ElysianEngine.js';
export const version = '1.6.5';
export const description = 'Moduled ElysianEngine.js';
export const author = 'WMProject1217';

let SystemContext;
let GlobalMethod_SyncResolve;
let GlobalMethod_AsyncCallback;
let GlobalStatus_IsSyncMode = 0;

export async function _init_(context) {
    SystemContext = context;
    console.log('[ElysianEngine]Initializing...');
    let styleSheet = document.styleSheets[0];
    let styles = `
.ElysianEngine_Container {
    user-select: none;
    border: none;
    padding: 0;
    margin: 0;
    z-index: 1800;
}

.ElysianEngine_Container .status0 {
    opacity: 0;
}

.ElysianEngine_Container .status1 {
    opacity: 1;
    transition-property: opacity;
    transition-duration: .3s;
}

.ElysianEngine_Container .status2 {
    opacity: 0;
    transition-property: opacity;
    transition-duration: .3s;
}

.ElysianEngine_Container .status3 {
    opacity: 1;
}

.ElysianEngine_Container .canvas {
    position: fixed;
    z-index: 1800;
}

.ElysianEngine_Container .canvas.noresize {
    top: 0px;
    left: 0px;
}

.ElysianEngine_Container .canvas.stretch {
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    margin: auto;
    height: 100vh;
    width: 100vw;
    object-fit: contain;
}

.ElysianEngine_Container .canvas.fitheight {
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    margin: auto;
    height: 100vh;
    width: 177.77vh;
}

.ElysianEngine_Container .canvas.fitwidth {
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    margin: auto;
    height: 56.25vw;
    width: 100vw;
}

.ElysianEngine_Container .talkbox {
    position: fixed;
    bottom: 0px;
    left: 0px;
    height: 25vh;
    width: 100vw;
    background-color: rgba(0, 0, 0, .38);
    z-index: 1804;
}

.ElysianEngine_Container .talkbox .name {
    font-family: "Microsoft YaHei UI", 'pagefont_default';
    width: 100vw;
    margin-top: 10px;
    margin-bottom: 10px;
    font-size: 3.3vh;
    text-align: center;
    font-weight: bold;
    color: rgb(252, 224, 88); 
    text-shadow: 1px 1px 1px rgb(150, 127, 53);
}

.ElysianEngine_Container .talkbox .line {
    width: 100vw; 
    height: 2px; 
    background-color: rgba(255, 255, 255, .1);
}

.ElysianEngine_Container .talkbox .data {
    font-family: "Microsoft YaHei UI", 'pagefont_default';
    width: 80vw;
    margin-left: 10vw; 
    margin-top: 8px; 
    font-size: 2.9vh; 
    text-align: left; 
    font-weight: bold; 
    color: rgb(233, 222, 226); 
    text-shadow: 1px 1px 1px rgb(125, 107, 125);
}

.ElysianEngine_Container .operatecatch {
    position: fixed;
    top: 0px;
    left: 0px;
    height: 100vh;
    width: 100vw;
    z-index: 1809;
}

.ElysianEngine_Container .choosebox {
    position: fixed;
    bottom: 25vh;
    right: 0px;
    height: auto;
    width: min-content;
    z-index: 1811;
}

.ElysianEngine_Container .choosebox .item {
    font-family: "印品鸿蒙体", 'pagefont_default';
    display: block;
    cursor: pointer;
    border: 2px solid #AFAFAF;
    background-color: rgba(0, 0, 0, .38);
    color: #FFFFFF;
    outline: 0;
    min-height: 5.4vh;
    width: 34vw;
    margin: 1vh;
    padding: 0.5vh 0.5vh 0.5vh 2vh;
    text-align: left;
    font-size: 3vh;
    float: left;
    transition-property: background-color, border, color, box-shadow;
    transition-duration: .3s;
    text-shadow: 1px 1px 8px rgba(0, 0, 0, .15);
}

.ElysianEngine_Container .choosebox .item:hover:enabled {
    background-color: #FFFFFF;
    border: 2px solid #9F9F9F;
    color: #000000;
    box-shadow: 1px 1px 30px rgba(0, 0, 0, .15), 0 6px 15px rgba(36, 37, 38, .15), inset 5px 5px 15px transparent;
}

.ElysianEngine_Container .choosebox .item:active:enabled {
    background-color: #D9D9D9;
}`;
    let styleRules = styles.split('}').map(rule => rule.trim()).filter(rule => rule.length > 0);
    styleRules.forEach(rule => {
        try {
            let fullRule = rule + '}';
            styleSheet.insertRule(fullRule, styleSheet.cssRules.length);
        } catch (e) {
            console.error('Failed to insert rule:', rule, e);
        }
    });
}

export async function _unload_() {
    if (ElysianEngine.lock_blockInitialize != 0) { ElysianEngine.remove(); }
    console.log('[ElysianEngine]Unloading...');
    let styleSheet = document.styleSheets[0];
    let rules = styleSheet.cssRules || styleSheet.rules;
    for (let i = rules.length - 1; i >= 0; i--) {
        let rule = rules[i];
        if (rule.selectorText && rule.selectorText.includes('.ElysianEngine_Container')) {
            styleSheet.deleteRule(i);
        }
    }
}

export function PlayScriptAsync(data, callback, config = null) {
    if (ElysianEngine.lock_blockInitialize == 0) {
        ElysianEngine._init_(config);
        GlobalStatus_IsSyncMode = 0;
        GlobalMethod_AsyncCallback = callback;
        ElysianEngine.loadscriptData(data);
    } else {
        return null;
    }
}

export function PlayScriptSync(data, config = null) {
    if (ElysianEngine.lock_blockInitialize == 0) {
        ElysianEngine._init_(config);
        GlobalStatus_IsSyncMode = 1;
        ElysianEngine.loadscriptData(data);
        return new Promise((resolve) => { GlobalMethod_SyncResolve = resolve; });
    } else {
        return new Promise((resolve) => { resolve(); });
    }
}

let ElysianEngine = {
    //Base Functions, these functions can also serve other scripts
    FormatizePath: function(path) {
        //标准化路径
        //(string)path 路径
        //返回 (string) 路径
        if ((typeof path) != "string") { return ""; }
        return path.replaceAll("\\\\", "/").replaceAll("//", "/").replaceAll("\"", "");
    },
    GetFileNameViaPath: function(path) {
        //通过路径获取文件名
        //(string)path 路径
        //返回 (string) 文件名
        if ((typeof path) != "string") { return ""; }
        this.temp_stringlist = path.split("/");
        return this.temp_stringlist[this.temp_stringlist.length - 1];
    },
    GetMIMETypeViaName: function(name) {
        //通过图像文件的文件名获取MIME类型
        //(string)name 文件名
        //返回 (string) MIME类型
        if ((typeof name) != "string") { return ""; }
        this.temp_stringlist = path.split(".");
        this.temp_string = this.temp_stringlist[this.temp_stringlist.length - 1];
        if (this.temp_string == "bmp") {
            return "image/bmp";
        } else if (this.temp_string == "jpg") {
            return "image/jpeg";
        } else if (this.temp_string == "jpeg") {
            return "image/jpeg";
        } else if (this.temp_string == "jpe") {
            return "image/jpeg";
        } else if (this.temp_string == "png") {
            return "image/png";
        } else if (this.temp_string == "webp") {
            return "image/webp";
        } else if (this.temp_string == "ico") {
            return "image/x-icon";
        } else {
            return "";
        }
    },
    loadImageObjectViaPath: function(src) {
        //通过路径加载Image对象
        //(string)src 路径
        //返回 (Image) Image对象
        return new Promise((resolve, reject) => {
            const image = new Image();
            image.onload = () => resolve(image);
            image.onerror = () => reject(new Error('FAIL TO LOAD IMAGE'));
            image.src = src;
        });
    },
    readBlobTextViaFileReader: function(file) {
        //通过FileReader读取Blob对象中的文本
        //(Blob)file Blob对象
        //返回 (string) 结果
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = () => reject(new Error('FAIL TO READ FILE'));
            reader.readAsText(file);
        });
    },
    sleep: function(milliseconds) {
        //延迟几秒，然后继续后面的指令，此函数不会阻塞其他定时函数和渲染函数运行
        //(int)milliseconds 毫秒数
        //无返回
        return new Promise((resolve) => setTimeout(resolve, milliseconds));
    },
    //Feature Functions, these functions serve main features
    lock_blockInitialize: 0,
    lock_blockLoadNewScript: 0,
    lock_transformingElements: 0,
    lock_blockAllUserAction: 0,
    lock_blockScripterContinue: 0,

    //talk
    showtalk_part0: async function(name) {
        if (this.ep_talkbox_name.classList.contains("status3")) {
            //It has shown
            if (this.ep_talkbox_name.innerHTML != name) {
                //The name is not the same
                this.ep_talkbox_name.classList.remove("status3");
                this.ep_talkbox_name.classList.add("status2");
                await this.sleep(300);
                this.ep_talkbox_name.innerHTML = name;
                this.ep_talkbox_name.classList.remove("status2");
                this.ep_talkbox_name.classList.add("status0");
                await this.sleep(20);
                this.ep_talkbox_name.classList.remove("status0");
                this.ep_talkbox_name.classList.add("status1");
                await this.sleep(300);
                this.ep_talkbox_name.classList.remove("status1");
                this.ep_talkbox_name.classList.add("status3");
            } else {
                //The name is same
                //DO NOTHING
            }
        } else if (this.ep_talkbox_name.classList.contains("status0")) {
            //It has not been shown
            this.ep_talkbox_name.innerHTML = name;
            this.ep_talkbox_name.classList.remove("status0");
            this.ep_talkbox_name.classList.add("status1");
            await this.sleep(300);
            this.ep_talkbox_name.classList.remove("status1");
            this.ep_talkbox_name.classList.add("status3");
        } else {
            //It is unknown if it has shown
            console.warn("FUCK!");
            this.ep_talkbox_name.className = "name status0";
            await this.sleep(20);
            this.ep_talkbox_name.classList.remove("status0");
            this.ep_talkbox_name.classList.add("status1");
            await this.sleep(300);
            this.ep_talkbox_name.classList.remove("status1");
            this.ep_talkbox_name.classList.add("status3");
        }
    },
    showtalk_part1: async function(name) {
        if (name == "") {
            if (this.ep_talkbox_line.classList.contains("status3")) {
                //It has shown
                this.ep_talkbox_line.classList.remove("status3");
                this.ep_talkbox_line.classList.add("status2");
                await this.sleep(300);
                this.ep_talkbox_line.classList.remove("status2");
                this.ep_talkbox_line.classList.add("status0");
            } else if (this.ep_talkbox_line.classList.contains("status0")) {
                //It has not been shown
                //DO NOTHING
            } else {
                //It is unknown if it has shown
                console.warn("FUCK!");
                this.ep_talkbox_line.className = "line status3";
                await this.sleep(20);
                this.ep_talkbox_line.classList.remove("status3");
                this.ep_talkbox_line.classList.add("status2");
                await this.sleep(300);
                this.ep_talkbox_line.classList.remove("status2");
                this.ep_talkbox_line.classList.add("status0");
            }
        } else {
            await this.sleep(300);
            if (this.ep_talkbox_line.classList.contains("status0")) {
                //It has not been shown
                this.ep_talkbox_line.classList.remove("status0");
                this.ep_talkbox_line.classList.add("status1");
                await this.sleep(300);
                this.ep_talkbox_line.classList.remove("status1");
                this.ep_talkbox_line.classList.add("status3");
            } else if (this.ep_talkbox_line.classList.contains("status3")) {
                //It has shown
                //DO NOTHING
            } else {
                //It is unknown if it has shown
                console.warn("FUCK!");
                this.ep_talkbox_line.className = "line status0";
                await this.sleep(20);
                this.ep_talkbox_line.classList.remove("status0");
                this.ep_talkbox_line.classList.add("status1");
                await this.sleep(300);
                this.ep_talkbox_line.classList.remove("status1");
                this.ep_talkbox_line.classList.add("status3");
            }
        }
    },
    showtalk_part2: async function(data) {
        if (this.ep_talkbox_data.classList.contains("status3")) {
            //It has shown
            this.ep_talkbox_data.classList.remove("status3");
            this.ep_talkbox_data.classList.add("status2");
            await this.sleep(300);
            this.ep_talkbox_data.classList.remove("status2");
            this.ep_talkbox_data.classList.add("status0");
        } else if (this.ep_talkbox_data.classList.contains("status0")) {
            //It has not been shown
            //DO NOTHING
        } else {
            //It is unknown if it has shown
            console.warn("FUCK!");
            this.ep_talkbox_data.className = "data status0";
        }
        this.ep_talkbox_data.innerHTML = data;
        await this.sleep(20);
        this.ep_talkbox_data.classList.remove("status0");
        this.ep_talkbox_data.classList.add("status1");
        await this.sleep(300);
        this.ep_talkbox_data.classList.remove("status1");
        this.ep_talkbox_data.classList.add("status3");
    },
    showtalk: async function(name, data) {
        if (this.lock_transformingElements == 1) {
            console.warn("FUCK: LOCKED - TRANSFORMING ELEMENTS");
            return;
        }
        this.lock_transformingElements = 1;
        if (this.ep_talkbox.classList.contains("status0")) {
            //It has not been shown
            this.ep_talkbox.classList.remove("status0");
            this.ep_talkbox.classList.add("status1");
            setTimeout(() => {
                this.ep_talkbox.classList.remove("status1");
                this.ep_talkbox.classList.add("status3");
            }, 300);
        } else if (this.ep_talkbox.classList.contains("status3")) {
            //It has shown
            //DO NOTHING
        } else {
            //It is unknown if it has shown
            console.warn("FUCK");
            this.ep_talkbox.className = "talkbox status0";
            await this.sleep(20);
            this.ep_talkbox.classList.remove("status0");
            this.ep_talkbox.classList.add("status1");
            setTimeout(() => {
                this.ep_talkbox.classList.remove("status1");
                this.ep_talkbox.classList.add("status3");
            }, 300);
        }
        this.showtalk_part0(name);
        this.showtalk_part1(name);
        this.showtalk_part2(data);
        await this.sleep(640);
        this.lock_transformingElements = 0;
    },
    hidetalk: async function() {
        if (this.lock_transformingElements == 1) {
            console.warn("FUCK: LOCKED - TRANSFORMING ELEMENTS");
            return;
        }
        this.lock_transformingElements = 1;
        if (this.ep_talkbox.classList.contains("status0")) {
            //It has not been shown
            //DO NOTHING
        } else if (this.ep_talkbox.classList.contains("status3")) {
            //It has shown
            this.ep_talkbox.classList.remove("status3");
            this.ep_talkbox.classList.add("status2");
            await this.sleep(300);
            this.ep_talkbox.classList.remove("status2");
            this.ep_talkbox.classList.add("status0");
        } else {
            //It is unknown if it has shown
            console.warn("FUCK");
            this.ep_talkbox.className = "talkbox status3";
            await this.sleep(20);
            this.ep_talkbox.classList.remove("status3");
            this.ep_talkbox.classList.add("status2");
            await this.sleep(300);
            this.ep_talkbox.classList.remove("status2");
            this.ep_talkbox.classList.add("status0");
        }
        this.ep_talkbox_name.className = "name status0";
        this.ep_talkbox_line.className = "line status0";
        this.ep_talkbox_data.className = "data status0";
        this.lock_transformingElements = 0;
    },

    //canvas
    showcanvas: async function(mode, width, height) {
        if (!this.ep_canvas.classList.contains(mode)) {
            this.ep_canvas.classList.add(mode);
        }
        if (this.ep_canvas.width != parseInt(width)) {
            this.ep_canvas.width = (parseInt(width) > 0) ? parseInt(width) : 1280;
        }
        if (this.ep_canvas.height != parseInt(height)) {
            this.ep_canvas.height = (parseInt(height) > 0) ? parseInt(height) : 720;
        }
        this.ep_canvas.style.display = "block";
    },
    hidecanvas: async function() {
        this.ep_canvas.style.display = "none";
        this.ep_canvas.className = "canvas";
    },
    canvas_drawImage: function(imageobject, cuttop, cutleft, cutwidth, cutheight, outputtop, outputleft, outputwidth, outputheight) {
        this.p_canvascontext.drawImage(imageobject, cuttop, cutleft, cutwidth, cutheight, outputtop, outputleft, outputwidth, outputheight);
    },
    canvas_drawBackgroundColor: function(color) {
        this.p_canvascontext.fillStyle = color;
        this.p_canvascontext.beginPath();
        this.p_canvascontext.rect(0, 0, this.ep_canvas.width, this.ep_canvas.height);
        this.p_canvascontext.fill();
    },
    canvas_drawBackgroundColorPS: async function(color, batchsize = 8) {
        this.temp_dbips_y = 0;
        while (this.temp_dbips_y < this.ep_canvas.height) {
            this.p_canvascontext.fillStyle = color;
            this.p_canvascontext.beginPath();
            this.p_canvascontext.rect(0, this.temp_dbips_y, this.ep_canvas.width, batchsize);
            this.p_canvascontext.fill();
            if (this.temp_dbips_y + batchsize >= this.ep_canvas.height) {
                if (this.ep_canvas.height - this.temp_dbips_y > 0) {
                    this.p_canvascontext.fillStyle = color;
                    this.p_canvascontext.beginPath();
                    this.p_canvascontext.rect(0, this.temp_dbips_y, this.ep_canvas.width, this.ep_canvas.height - this.temp_dbips_y);
                    this.p_canvascontext.fill();
                }
            }
            this.temp_dbips_y = this.temp_dbips_y + batchsize;
            await this.sleep(1);
        }
    },
    canvas_drawBackgroundImagePS: async function(imageobject, batchsize = 8) {
        this.temp_dbips_y = 0;
        this.temp_dbips_dlx = (this.ep_canvas.height / imageobject.naturalHeight);
        this.temp_dbips_ew = this.ep_canvas.width;
        while (this.temp_dbips_y < imageobject.naturalHeight) {
            this.p_canvascontext.drawImage(imageobject, 0, this.temp_dbips_y, imageobject.naturalWidth, batchsize, 0, this.temp_dbips_y * this.temp_dbips_dlx, this.temp_dbips_ew, batchsize * this.temp_dbips_dlx);
            this.temp_dbips_y = this.temp_dbips_y + batchsize;
            await this.sleep(1);
        }
    },

    //bgm
    audio_bgmplay: async function(src) {
        if (this.audio_bgmplayhandle == undefined) {
            if (src.substr(src.length - 3, 3) == "mid") {
                this.audio_bgmplaymidi = 1;
                this.audio_bgmplaymidisrc = src;
                this.audio_bgmplayhandle = WMMIDISynth;
                this.audio_bgmplayhandle.rstinit();
                this.audio_bgmplayhandle.setLoop(1);
                this.audio_bgmplayhandle.setVoices(64);
                this.tempd = () => { return new Promise((resolve, reject) => {
                    this.MIDILoadCallBack = () => { resolve() };
                }); };
                this.audio_bgmplayhandle.loadMIDIUrl(src, this.MIDILoadCallBack);
                await this.tempd;
                await this.sleep(100);
                this.audio_bgmplayhandle.playMIDI();
            } else {   
                this.audio_bgmplaymidi = 0;
                this.audio_bgmplayhandle = new Audio(src);
                this.audio_bgmplayhandle.volume = this.config.audio_bgmvolume;
                this.audio_bgmplayhandle.loop = 1;
                this.audio_bgmplayhandle.play();
            }
        } else {
            if (src.substr(src.length - 3, 3) == "mid") {
                this.audio_bgmplaymidi = 1;
                this.audio_bgmplaymidisrc = src;
                if (this.audio_bgmplaymidi == 0) {
                    this.audio_bgmplayhandle = WMMIDISynth;
                    this.audio_bgmplayhandle.rstinit();
                    this.audio_bgmplayhandle.setLoop(1);
                    this.audio_bgmplayhandle.setVoices(64);
                    this.tempd = () => { return new Promise((resolve, reject) => {
                        this.MIDILoadCallBack = () => { resolve() };
                    }); };
                    this.audio_bgmplayhandle.loadMIDIUrl(src, this.MIDILoadCallBack);
                    await this.tempd;
                    await this.sleep(100);
                    this.audio_bgmplayhandle.playMIDI();
                } else {
                    this.audio_bgmplayhandle.stopMIDI();
                    await this.sleep(100);
                    this.tempd = () => { return new Promise((resolve, reject) => {
                        this.MIDILoadCallBack = () => { resolve() };
                    }); };
                    this.audio_bgmplayhandle.loadMIDIUrl(src, this.MIDILoadCallBack);
                    await this.tempd;
                    await this.sleep(100);
                    this.audio_bgmplayhandle.playMIDI();
                }
            } else {
                this.audio_bgmplaymidi = 0;
                if (this.audio_bgmplaymidi == 0) {
                    this.audio_bgmplayhandle.pause();
                    this.audio_bgmplayhandle.src = src;
                    this.audio_bgmplayhandle.volume = this.config.audio_bgmvolume;
                    this.audio_bgmplayhandle.loop = 1;
                    this.audio_bgmplayhandle.play();
                } else {
                    this.audio_bgmplayhandle.stopMIDI();
                    await this.sleep(100);
                    this.audio_bgmplayhandle = new Audio(src);
                    this.audio_bgmplayhandle.volume = this.config.audio_bgmvolume;
                    this.audio_bgmplayhandle.loop = 1;
                    this.audio_bgmplayhandle.play();
                }
            }
        }
    },
    audio_bgmpause: function() {
        if (this.audio_bgmplayhandle != undefined) {
            if (this.audio_bgmplaymidi == 0) {
                this.audio_bgmplayhandle.pause();
            } else {
                this.audio_bgmplayhandle.stopMIDI();
            }
        }
    },
    audio_bgmresume: function() {
        if (this.audio_bgmplayhandle != undefined) {
            if (this.audio_bgmplaymidi == 0) {
                this.audio_bgmplayhandle.play();
            } else {
                this.audio_bgmplayhandle.playMIDI();
            }
        }
    },
    audio_bgmhalt: async function() {
        if (this.audio_bgmplayhandle != undefined) {
            if (this.audio_bgmplaymidi == 0) {
                this.audio_bgmplayhandle.pause();
            } else {
                this.audio_bgmplayhandle.stopMIDI();
                await this.sleep(100);
            }
            delete this.audio_bgmplayhandle;
            this.audio_bgmplayhandle = undefined;
        }
    },

    //bgs
    audio_bgsplay: function(src) {
        this.temp_audio_bgsplay = new Audio(src);
        this.temp_audio_bgsplay.volume = this.config.audio_bgsvolume;
        this.temp_audio_bgsplay.loop = 0;
        this.temp_audio_bgsplay.play();
    },

    //voice
    audio_voiceplay: function(src) {
        if (this.config.audio_voiceplaymode == 0) {
            if (this.audio_voiceplayhandle == undefined) {
                this.audio_voiceplayhandle = new Audio(src);
            } else {
                this.audio_voiceplayhandle.pause();
                this.audio_voiceplayhandle.src = src;
            }
            this.audio_voiceplayhandle.volume = this.config.audio_voicevolume;
            this.audio_voiceplayhandle.loop = 0;
            this.audio_voiceplayhandle.play();
        } else {
            this.temp_audio_voiceplay = new Audio(src);
            this.temp_audio_voiceplay.volume = this.config.audio_voicevolume;
            this.temp_audio_voiceplay.loop = 0;
            this.temp_audio_voiceplay.play();
        }
    },
    audio_voicepause: function() {
        if (this.config.audio_voiceplaymode != 0) {
            console.error("FUCK: UNABLE TO CONTROL VOICE PLAY IN MODE 1");
            return;
        }
        if (this.audio_voiceplayhandle != undefined) {
            this.audio_voiceplayhandle.pause();
        }
    },
    audio_voiceresume: function() {
        if (this.config.audio_voiceplaymode != 0) {
            console.error("FUCK: UNABLE TO CONTROL VOICE PLAY IN MODE 1");
            return;
        }
        if (this.audio_voiceplayhandle != undefined) {
            this.audio_voiceplayhandle.play();
        }
    },
    audio_voicehalt: function() {
        if (this.config.audio_voiceplaymode != 0) {
            console.error("FUCK: UNABLE TO CONTROL VOICE PLAY IN MODE 1");
            return;
        }
        if (this.audio_voiceplayhandle != undefined) {
            this.audio_voiceplayhandle.pause();
            delete this.audio_voiceplayhandle;
            this.audio_voiceplayhandle = undefined;
        }
    },

    //choose
    showchoose: async function(items = [], callback = () => {}) {
        /*if (this.lock_transformingElements == 1) {
            console.warn("FUCK: LOCKED - TRANSFORMING ELEMENTS");
            return;
        }*/
        if (this.ep_choosebox.innerHTML != "") {
            console.warn("FUCK: CHOOSE BOX HAS SHOWN");
            return;
        }
        //this.lock_transformingElements = 1;
        for (var i = 0; i < items.length; i++) {
            this.temp_createitem = document.createElement("button");
            this.temp_createitem.className = "item";
            this.temp_createitem.innerHTML = items[i];
            const var_temp = i;
            this.temp_createitem.onclick = () => {
                this.hidechoose();
                callback(var_temp);
            }
            this.ep_choosebox.appendChild(this.temp_createitem);
        }
        this.ep_choosebox.className = "choosebox status0";
        this.ep_choosebox.style.display = "block";
        await this.sleep(20);
        this.ep_choosebox.classList.remove("status0");
        this.ep_choosebox.classList.add("status1");
        await this.sleep(300);
        this.ep_choosebox.classList.remove("status1");
        this.ep_choosebox.classList.add("status3");
        //this.lock_transformingElements = 0;
    },
    hidechoose: async function() {
        /*if (this.lock_transformingElements == 1) {
            console.warn("FUCK: LOCKED - TRANSFORMING ELEMENTS");
            return;
        }*/
        if (this.ep_choosebox.innerHTML == "") {
            console.warn("FUCK: CHOOSE BOX NOT SHOWN");
            return;
        }
        //this.lock_transformingElements = 1;
        this.ep_choosebox.classList.remove("status3");
        this.ep_choosebox.classList.add("status2");
        await this.sleep(300);
        this.ep_choosebox.classList.remove("status2");
        this.ep_choosebox.classList.add("status0");
        await this.sleep(20);
        this.ep_choosebox.style.display = "none";
        this.ep_choosebox.innerHTML = "";
        //this.lock_transformingElements = 0;
    },
    //Main Process
    loadscript: async function(src) {
        //加载脚本
        //无返回
        if (this.lock_blockLoadNewScript == 1) {
            console.error("FUCK: DO NOT LOAD ANOTHER SCRIPT WHEN A SCRIPT RUNNING");
            return;
        }
        this.lock_blockLoadNewScript = 1;
        await _genesis_.lib.AssetsLoader.RequireFileUrlByFileUrl(this.FormatizePath(src));
        this.tempscript = await this.readBlobTextViaFileReader(_genesis_.lib.AssetsLoader.RequireFileData(this.FormatizePath(src)));
        this.scriptlist = this.tempscript.split("\r\n");
        if (this.scriptlist[0].substr(0, 8) != "!#wmgesh") {
            console.warn("FUCK: NOT STANDARD WMGESH SCRIPT.");
        }
        this._scripttick_();
    },
    loadscriptData: async function(data) {
        //加载脚本
        //无返回
        if (this.lock_blockLoadNewScript == 1) {
            console.error("FUCK: DO NOT LOAD ANOTHER SCRIPT WHEN A SCRIPT RUNNING");
            return;
        }
        this.lock_blockLoadNewScript = 1;
        this.tempscript = data;
        this.scriptlist = this.tempscript.split("\n");
        if (this.scriptlist[0].substr(0, 8) != "!#wmgesh") {
            console.warn("FUCK: NOT STANDARD WMGESH SCRIPT.");
        }
        this._scripttick_();
    },
    operatecatch_click: function() {
        if (this.lock_transformingElements != 0) {
            console.warn("FUCK: LOCKED - TRANSFORMING ELEMENTS");
            return;
        }
        if (this.lock_blockAllUserAction != 0) {
            console.warn("FUCK: LOCKED - USER ACTION BLOCKED");
            return;
        }
        if (this.requestUserAction == 1) {
            this.requestUserAction = 0;
            this.UserActionCallBack();
        }
    },
    _useraction_: function() {
        return new Promise((resolve, reject) => {
            this.UserActionCallBack = () => { resolve() };
        });
    },
    _scripttick_: async function() {
        this.script_csp = 0;
        this.script_labellist = [];
        this.variblelist = [];
        for (var i = 0; i < this.scriptlist.length; i++) {
            if (this.scriptlist[i].substr(0, 1) == ":") {
                this.script_labellist[this.script_labellist.length] = [this.scriptlist[i].substr(1), i];
            }
        }
        while (this.script_csp < this.scriptlist.length) {
            this.scriptline = this.scriptlist[this.script_csp];
            for (var i = 0; i < this.variblelist.length; i++) {
                this.scriptline = this.scriptline.replaceAll("\\${" + this.variblelist[i][0] + "}", this.variblelist[i][1]);
            }
            //console.log(this.scriptline)
            if (this.scriptline.substr(0, 1) == "[") {
                if (this.scriptline.includes("]")) {
                    this.scriptcache_a = this.scriptline.substr(1).split("]");
                    this.showtalk(this.scriptcache_a[0], this.scriptcache_a[1].replaceAll("\\\\n", "<br>"));
                    this.requestUserAction = 1;
                    await this._useraction_();
                }
            }
            if (this.scriptline == "hidetalk") {
                await this.hidetalk();
            }
            if (this.scriptline.substr(0, 5) == "goto ") {
                this.temptarget = -1;
                this.tempstr = this.scriptline.substr(5);
                for (var i = 0; i < this.script_labellist.length; i++) {
                    if (this.script_labellist[i][0] == this.tempstr) {
                        this.temptarget = this.script_labellist[i][1];
                    }
                }
                if (this.temptarget >= 0) {
                    this.script_csp = this.temptarget;
                } else {
                    console.error("Fatal Error\nInvalid Label.\nAt script[line " + this.script_csp + "]");
                    if (this.config.script_onerrorresumenext != 1) {
                        console.error("Script Halted.");
                        return;
                    }
                }
                await this.sleep(this.config.script_ticktimeout);
                continue;
            }
            if (this.scriptline == "start menu") {
                this.temp_iseof = 0;
                this.temp_csp = this.script_csp + 1;
                this.menu_items = []
                while (this.temp_iseof == 0) {
                    if (this.temp_csp >= this.scriptlist.length) {
                        console.error("Fatal Error\nInvalid Menu.\nAt script[line " + this.script_csp + "]");
                        console.error("Script Halted.");
                        return;
                    }
                    if (this.scriptlist[this.temp_csp] == "end menu") {
                        this.temp_iseof = 1;
                        this.script_csp = this.temp_csp;
                        break;
                    }
                    this.tempb = this.scriptlist[this.temp_csp];
                    for (var i = 0; i < this.variblelist.length; i++) {
                        this.tempb = this.tempb.replaceAll("\\${" + this.variblelist[i][0] + "}", this.variblelist[i][1]);
                    }    
                    this.menu_items[this.menu_items.length] = this.tempb.split("    ");
                    this.temp_csp = this.temp_csp + 1;
                }
            }
            if (this.scriptline.substr(0, 7) == "choose ") {
                this.tempa = () => { return new Promise((resolve, reject) => {
                    this.UserChooseCallBack = () => { resolve() };
                }); };
                this.temp_chooselist = [];
                this.temp_choosenumber = 0;
                for (var i = 0; i < this.menu_items.length; i++) {
                    this.temp_chooselist[this.temp_chooselist.length] = this.menu_items[i][1];
                }
                this.showchoose(this.temp_chooselist, (id) => {
                    this.UserChooseCallBack();
                    this.temp_choosenumber = id;
                });
                await this.tempa();
                this.UserChooseCallBack = function() {};
                this.temp_seta = 0;
                for (var x = 0; x < this.variblelist.length; x++) {
                    if (this.scriptline.substr(7) == this.variblelist[x][0]) {
                        this.temp_seta = 1;
                        this.variblelist[x][1] = this.menu_items[this.temp_choosenumber][0];
                    }
                }
                if (this.temp_seta == 0) {
                    this.variblelist[this.variblelist.length] = [this.scriptline.substr(7), this.menu_items[this.temp_choosenumber][0]];
                }
            }
            if (this.scriptline.substr(0, 11) == "showcanvas ") {
                this.temp_split = this.scriptline.substr(11).split(",");
                this.showcanvas(this.temp_split[0], parseInt(this.temp_split[1]), parseInt(this.temp_split[2]));
            }
            if (this.scriptline == "hidecanvas") {
                this.hidecanvas();
            }
            if (this.scriptline.substr(0, 29) == "canvas_drawBackgroundImagePS ") {
                var pathdx = this.config.script_chroot + this.scriptline.substr(29);
                if (typeof _genesis_.lib.AssetsLoader != 'undefined') { pathdx = await _genesis_.lib.AssetsLoader.RequireFileUrlByFileUrl(this.config.script_chroot + this.scriptline.substr(29)); }
                await this.canvas_drawBackgroundImagePS(await this.loadImageObjectViaPath(pathdx), 16);
            }
            if (this.scriptline.substr(0, 27) == "canvas_drawBackgroundColor ") {
                this.canvas_drawBackgroundColor(this.scriptline.substr(27));
            }
            if (this.scriptline.substr(0, 29) == "canvas_drawBackgroundColorPS ") {
                await this.canvas_drawBackgroundColorPS(this.scriptline.substr(29), 16);
            }
            if (this.scriptline.substr(0, 6) == "sleep ") {
                await this.sleep(parseInt(this.scriptline.substr(6)));
            }
            if (this.scriptline.substr(0, 14) == "audio_bgmplay ") {
                this.audio_bgmplay(this.config.script_chroot + this.scriptline.substr(14));
            }
            if (this.scriptline == "audio_bgmpause") {
                this.audio_bgmpause()
            }
            if (this.scriptline == "audio_bgmresume") {
                this.audio_bgmresume();
            }
            if (this.scriptline == "audio_bgmhalt") {
                this.audio_bgmhalt();
            }
            if (this.scriptline.substr(0, 14) == "audio_bgsplay ") {
                this.audio_bgsplay(this.config.script_chroot + this.scriptline.substr(14));
            }
            if (this.scriptline.substr(0, 16) == "audio_voiceplay ") {
                this.audio_voiceplay(this.config.script_chroot + this.scriptline.substr(16));
            }
            if (this.scriptline == "audio_voicepause") {
                this.audio_voicepause();
            }
            if (this.scriptline == "audio_voiceresume") {
                this.audio_voiceresume();
            }
            if (this.scriptline == "audio_voicehalt") {
                this.audio_voicehalt();
            }
            if (this.scriptline.substr(0, 3) == "js ") {
                try {
                    eval(this.scriptline.substr(3));
                } catch (e) {
                    console.error("Fatal Error\n" + e.stack + "\nAt eval();\nAt script[line " + this.script_csp + "]");
                }
            }
            if (this.scriptline.substr(0, 4) == "set ") {
                this.temp_set = this.scriptline.substr(4).split("=");
                this.temp_seta = 0;
                for (var x = 0; x < this.variblelist.length; x++) {
                    if (this.temp_set[0] == this.variblelist[x][0]) {
                        this.temp_seta = 1;
                        this.variblelist[x][1] = this.temp_set[1];
                    }
                }
                if (this.temp_seta == 0) {
                    this.variblelist[this.variblelist.length] = this.temp_set;
                }
            }
            if (this.scriptline == "exit") {
                this.event_onexit();
                await this.sleep(this.config.script_ticktimeout);
                this._remove_();
                return;
            }
            await this.sleep(this.config.script_ticktimeout);
            this.script_csp = this.script_csp + 1;
        }
        this.event_onexit();
        await this.sleep(this.config.script_ticktimeout);
        this._remove_();
    },
    defaultconfig: {
        script_chroot: "./",
        script_onerrorresumenext: 0,
        script_ticktimeout: 1,
        save_disablecookie: 1,
        save_nodemodechroot: "./saves/",
        audio_voiceplaymode: 0,
        audio_voicevolume: 1,
        audio_bgmvolume: 1,
        audio_bgsvolume: 1
    },
    _remove_: async function() {
        //卸载系统
        //无返回
        if (this.lock_blockInitialize == 0) {
            console.warn("FUCK: SYSTEM NOT INITIALIZED");
            return;
        }
        this.lock_blockInitialize = 0;
        this.hidecanvas();
        await this.sleep(40);
        await this.hidechoose();
        await this.sleep(40);
        await this.hidetalk();
        await this.sleep(40);
        this.audio_bgmhalt();
        this.audio_voicehalt();
        await this.sleep(100);
        this.ep_container.remove();
        this.variblelist = [];
    },
    _init_: async function(config = null) {
        //初始化系统
        //无返回
        if (this.lock_blockInitialize == 1) {
            console.warn("FUCK: SYSTEM INITIALIZED");
            return;
        }
        this.lock_blockInitialize = 1;
        //initialize environment
        if (config == null) {
            this.config = this.defaultconfig
        } else {
            this.config = config;
        }
        this.lock_blockLoadNewScript = 0;
        this.lock_transformingElements = 0;
        this.lock_blockAllUserAction = 0;
        this.lock_blockScripterContinue = 0;
        this.requestUserAction = 0;
        this.UserActionCallBack = function() {};
        this.event_onexit = function() {
            this.lock_blockLoadNewScript = 0;
            if (GlobalStatus_IsSyncMode == 0) { GlobalMethod_AsyncCallback(); }
            if (GlobalStatus_IsSyncMode == 1) { GlobalMethod_SyncResolve(); }
        };
        this.scriptlist = [];
        this.audio_bgmplayhandle = undefined;
        this.audio_bgmplaymidi = 0;
        this.audio_bgmplaymidisrc = "";
        if (this.config.audio_voiceplaymode == 0) {
            this.audio_voiceplayhandle = undefined;
        }
        //create container, she contains all
        this.ep_container = document.createElement("div");
        this.ep_container.id = "ElysianEngine_Container";
        this.ep_container.className = "ElysianEngine_Container";
        document.body.appendChild(this.ep_container)
        //create canvas, this canvas for Image Functions only.
        this.ep_canvas = document.createElement("canvas");
        this.ep_canvas.className = "canvas";
        this.ep_canvas.style.display = "none";
        this.ep_container.appendChild(this.ep_canvas);
        this.p_canvascontext = this.ep_canvas.getContext("2d");
        //create talkbox, this box will contain talk
        this.ep_talkbox = document.createElement("div");
        this.ep_talkbox.classList.add("talkbox");
        this.ep_talkbox.classList.add("status0");
        this.ep_talkbox_name = document.createElement("div");
        this.ep_talkbox_name.classList.add("name");
        this.ep_talkbox_name.classList.add("status0");
        this.ep_talkbox_line = document.createElement("div");
        this.ep_talkbox_line.classList.add("line");
        this.ep_talkbox_line.classList.add("status0");
        this.ep_talkbox_data = document.createElement("div");
        this.ep_talkbox_data.classList.add("data");
        this.ep_talkbox_data.classList.add("status0");
        this.ep_talkbox.appendChild(this.ep_talkbox_name);
        this.ep_talkbox.appendChild(this.ep_talkbox_line);
        this.ep_talkbox.appendChild(this.ep_talkbox_data);
        this.ep_container.appendChild(this.ep_talkbox);
        //create choosebox, the choose buttons create here
        this.ep_choosebox = document.createElement("div");
        this.ep_choosebox.classList.add("choosebox");
        this.ep_choosebox.classList.add("status0");
        this.ep_choosebox.style.display = "none";
        this.ep_container.appendChild(this.ep_choosebox);
        //create operatecatch, this box catch all user mouse/touch actions
        this.ep_operatecatch = document.createElement("div");
        this.ep_operatecatch.className = "operatecatch";
        this.ep_operatecatch.onclick = () => { this.operatecatch_click(); };
        this.ep_container.appendChild(this.ep_operatecatch);
        return;
    }
}
