/*
* Copyright(c) A.K.A wmcomlib.js JavaScript Function Library v2
* WMProject1217 Studios 2023
* FileName: Beep.js
* FileVersion: 0.4.0
* FileDescription: 简单波形合成子系统
* Author: WMProject1217
* LatestCommit: 2025-7-2
*
* FOR THE DAWN THAT SHALL ARRIVE!
*/

export const id = 'WMBeep';
export const name = 'WMBeep';
export const version = '0.4.0';
export const description = 'Moduled WMBeep.js';
export const author = 'WMProject1217';

let SystemContext;
let ossquare0 = null;
let ossquare1 = null;
let ossquare2 = null;
let ossquare3 = null;
let ossquare4 = null;
let ossquare5 = null;
let ossquare6 = null;
let ossquare7 = null;
/*let ossquare8 = null;
let ossquare9 = null;
let ossquare10 = null;
let ossquare11 = null;
let ossquare12 = null;
let ossquare13 = null;
let ossquare14 = null;
let ossquare15 = null;*/
let callidc = 0;
let csp = 0;
let trackplaymode = 0;
let timemode = 100;
let osmode = "square";
let notelist = null;

export async function _init_(context) {
    SystemContext = context;

    // 初始化WMBeep执行环境
    // 无参数
    // 无返回
    ossquare0 = new window.AudioContext();
    ossquare1 = new window.AudioContext();
    ossquare2 = new window.AudioContext();
    ossquare3 = new window.AudioContext();
    ossquare4 = new window.AudioContext();
    ossquare5 = new window.AudioContext();
    ossquare6 = new window.AudioContext();
    ossquare7 = new window.AudioContext();
    /*ossquare8 = new window.AudioContext();
    ossquare9 = new window.AudioContext();
    ossquare10 = new window.AudioContext();
    ossquare11 = new window.AudioContext();
    ossquare12 = new window.AudioContext();
    ossquare13 = new window.AudioContext();
    ossquare14 = new window.AudioContext();
    ossquare15 = new window.AudioContext();*/
    callidc = 0;
    csp = 0;
    trackplaymode = 0;
    timemode = 100;
    osmode = "square";
    notelist = [];
    console.log("wmbeep.js Version 0.4.0")
    console.log("WMProject1217 Studios 2023")
    console.log('[WMBeep]Initializing...');
}

export function setNoteList(nl) {
    notelist = nl;
}

export function setCSP(val) {
    csp = val;
}

export async function _unload_() {
    console.log('[WMBeep]Unloading...');
}

export function Note2Frequency(noteid) {
    // 将标准音符字符串转换为震荡频率
    // (string) noteid 标准音符字符串
    // 返回 (int)
    if (noteid == "C0") {
        return 16.35;
    } else if (noteid == "C#0") {
        return 17.32;
    } else if (noteid == "Db0") {
        return 17.32;
    } else if (noteid == "D0") {
        return 18.35;
    } else if (noteid == "D#0") {
        return 19.45;
    } else if (noteid == "Eb0") {
        return 19.45;
    } else if (noteid == "E0") {
        return 20.6;
    } else if (noteid == "F0") {
        return 21.83;
    } else if (noteid == "F#0") {
        return 23.12;
    } else if (noteid == "Gb0") {
        return 23.12;
    } else if (noteid == "G0") {
        return 24.5;
    } else if (noteid == "G#0") {
        return 25.96;
    } else if (noteid == "Ab0") {
        return 25.96;
    } else if (noteid == "A0") {
        return 27.5;
    } else if (noteid == "A#0") {
        return 29.14;
    } else if (noteid == "Bb0") {
        return 29.14;
    } else if (noteid == "B0") {
        return 30.87;
    } else if (noteid == "C1") {
        return 32.7;
    } else if (noteid == "C#1") {
        return 34.65;
    } else if (noteid == "Db1") {
        return 34.65;
    } else if (noteid == "E1") {
        return 41.2;
    } else if (noteid == "F1") {
        return 43.65;
    } else if (noteid == "F#1") {
        return 46.25;
    } else if (noteid == "Gb1") {
        return 46.25;
    } else if (noteid == "G1") {
        return 49;
    } else if (noteid == "G#1") {
        return 51.91;
    } else if (noteid == "Ab1") {
        return 51.91;
    } else if (noteid == "A1") {
        return 55;
    } else if (noteid == "A#1") {
        return 58.27;
    } else if (noteid == "Bb1") {
        return 58.27;
    } else if (noteid == "B1") {
        return 61.74;
    } else if (noteid == "C2") {
        return 65.41;
    } else if (noteid == "C#2") {
        return 69.3;
    } else if (noteid == "Db2") {
        return 69.3;
    } else if (noteid == "D2") {
        return 73.42;
    } else if (noteid == "D#2") {
        return 77.78;
    } else if (noteid == "Eb2") {
        return 77.78;
    } else if (noteid == "E2") {
        return 82.41;
    } else if (noteid == "F2") {
        return 87.31;
    } else if (noteid == "F#2") {
        return 92.5;
    } else if (noteid == "Gb2") {
        return 92.5;
    } else if (noteid == "G2") {
        return 98;
    } else if (noteid == "G#2") {
        return 103.83;
    } else if (noteid == "Ab2") {
        return 103.83;
    } else if (noteid == "A2") {
        return 110;
    } else if (noteid == "A#2") {
        return 116.54;
    } else if (noteid == "Bb2") {
        return 116.54;
    } else if (noteid == "B2") {
        return 123.47;
    } else if (noteid == "C3") {
        return 130.81;
    } else if (noteid == "C#3") {
        return 138.59;
    } else if (noteid == "Db3") {
        return 138.59;
    } else if (noteid == "D3") {
        return 146.83;
    } else if (noteid == "D#3") {
        return 155.56;
    } else if (noteid == "Eb3") {
        return 155.56;
    } else if (noteid == "E3") {
        return 164.81;
    } else if (noteid == "F3") {
        return 174.61;
    } else if (noteid == "F#3") {
        return 185;
    } else if (noteid == "Gb3") {
        return 185;
    } else if (noteid == "G3") {
        return 196;
    } else if (noteid == "G#3") {
        return 207.65;
    } else if (noteid == "Ab3") {
        return 207.65;
    } else if (noteid == "A3") {
        return 220;
    } else if (noteid == "A#3") {
        return 233.08;
    } else if (noteid == "Bb3") {
        return 233.08;
    } else if (noteid == "B3") {
        return 246.94;
    } else if (noteid == "C4") {
        return 261.63;
    } else if (noteid == "C#4") {
        return 277.18;
    } else if (noteid == "Db4") {
        return 277.18;
    } else if (noteid == "D4") {
        return 293.66;
    } else if (noteid == "D#4") {
        return 311.13;
    } else if (noteid == "Eb4") {
        return 311.13;
    } else if (noteid == "E4") {
        return 329.63;
    } else if (noteid == "F4") {
        return 349.23;
    } else if (noteid == "F#4") {
        return 369.99;
    } else if (noteid == "Gb4") {
        return 369.99;
    } else if (noteid == "G4") {
        return 392;
    } else if (noteid == "G#4") {
        return 415.3;
    } else if (noteid == "Ab4") {
        return 415.3;
    } else if (noteid == "A4") {
        return 440;
    } else if (noteid == "A#4") {
        return 466.16;
    } else if (noteid == "Bb4") {
        return 466.16;
    } else if (noteid == "B4") {
        return 493.88;
    } else if (noteid == "C5") {
        return 523.25;
    } else if (noteid == "C#5") {
        return 554.37;
    } else if (noteid == "Db5") {
        return 554.37;
    } else if (noteid == "D5") {
        return 587.33;
    } else if (noteid == "D#5") {
        return 622.25;
    } else if (noteid == "Eb5") {
        return 622.25;
    } else if (noteid == "E5") {
        return 659.25;
    } else if (noteid == "F5") {
        return 698.46;
    } else if (noteid == "F#5") {
        return 739.99;
    } else if (noteid == "Gb5") {
        return 739.99;
    } else if (noteid == "G5") {
        return 783.99;
    } else if (noteid == "G#5") {
        return 830.61;
    } else if (noteid == "Ab5") {
        return 830.61;
    } else if (noteid == "A5") {
        return 880;
    } else if (noteid == "A#5") {
        return 832.33;
    } else if (noteid == "Bb5") {
        return 932.33;
    } else if (noteid == "B5") {
        return 987.77;
    } else if (noteid == "C6") {
        return 1046.5;
    } else if (noteid == "C#6") {
        return 1108.73;
    } else if (noteid == "Db6") {
        return 1108.73;
    } else if (noteid == "D6") {
        return 1174.66;
    } else if (noteid == "D#6") {
        return 1244.51;
    } else if (noteid == "Eb6") {
        return 1244.51;
    } else if (noteid == "E6") {
        return 1318.51;
    } else if (noteid == "F6") {
        return 1396.91;
    } else if (noteid == "F#6") {
        return 1479.98;
    } else if (noteid == "Gb6") {
        return 1479.98;
    } else if (noteid == "G6") {
        return 1567.98;
    } else if (noteid == "G#6") {
        return 1661.22;
    } else if (noteid == "Ab6") {
        return 1661.22;
    } else if (noteid == "A6") {
        return 1760;
    } else if (noteid == "A#6") {
        return 1864.66;
    } else if (noteid == "Bb6") {
        return 1864.66;
    } else if (noteid == "B6") {
        return 1975.53;
    } else if (noteid == "C7") {
        return 2093;
    } else {
        return 0;
    }
}

function getcallid() {
    // 返回一个可用于播放震荡的音频元素
    // 无参数
    // 返回 (object)window.AudioContext
    if (callidc < 7) {
        callidc = callidc + 1;
    } else {
        callidc = 0;
    }
    if (callidc == 0) {
        return ossquare0;
    } else if (callidc == 1) {
        return ossquare1;
    } else if (callidc == 2) {
        return ossquare2;
    } else if (callidc == 3) {
        return ossquare3;
    } else if (callidc == 4) {
        return ossquare4;
    } else if (callidc == 5) {
        return ossquare5;
    } else if (callidc == 6) {
        return ossquare6;
    } else if (callidc == 7) {
        return ossquare7;
    }/* else if (callidc == 8) {
        return ossquare8;
    } else if (callidc == 9) {
        return ossquare9;
    } else if (callidc == 10) {
        return ossquare10;
    } else if (callidc == 11) {
        return ossquare11;
    } else if (callidc == 12) {
        return ossquare12;
    } else if (callidc == 13) {
        return ossquare13;
    } else if (callidc == 14) {
        return ossquare14;
    } else if (callidc == 15) {
        return ossquare15;
    }*/ else {
        return ossquare0;
    }
}

export function Play(freq, hltime, type = "square") {
    // 非连续性的播放一个震荡
    // (long)freq 震荡频率
    // (long)hltime 持续时间，单位秒
    // (string)type 振荡器类型，省略此参数使用方波
    // 无返回
    let context = getcallid();
    let os = context.createOscillator();
    os.type = type;
    os.frequency.value = freq;
    os.connect(context.destination);
    os.start();
    os.stop(context.currentTime + hltime - 0.001);
}

export function PlayX(freq, hltime, type = "square") {
    // 连续性的播放一个震荡
    // (long)freq 震荡频率
    // (long)hltime 持续时间，单位秒
    // (string)type 振荡器类型，省略此参数使用方波
    // 无返回
    let context = getcallid();
    let os = context.createOscillator();
    os.type = type;
    os.frequency.value = freq;
    os.connect(context.destination);
    os.start();
    os.stop(context.currentTime + hltime);
}

export function PlayWMBP() {
    // 播放一个储存在notelist[]中的wmbpt文件
    // 无参数
    // 无返回
    let nowline = notelist[csp];
    let waitdelay = 0;
    if (trackplaymode == 0) {
        if (nowline.substr(0, 5) == "NAME=") {
            console.log(csp + " " + "Name: " + nowline.substr(5));
        }
        if (nowline.substr(0, 7) == "AUTHOR=") {
            console.log(csp + " " + "Author: " + nowline.substr(7));
        }
        if (nowline == "TRACK START") {
            trackplaymode = 1;
            console.log(csp + " " + "TRACK START");
        }
    } else if (trackplaymode == 1) {
        if (nowline.substr(0, 4) == "set ") {
            let setstrcx = nowline.substr(4);
            let setsplit = setstrcx.split("=");
            if (setsplit[0] == "osmode") {
                osmode = setsplit[1];
                console.log(csp + " " + "osmode=" + osmode);
            }
            if (setsplit[0] == "timemode") {
                timemode = parseInt(setsplit[1]);
                console.log(csp + " " + "timemode=" + timemode);
            }
        }
        if (nowline.substr(0, 5) == "play ") {
            let playstr = nowline.substr(5);
            let playsplit = playstr.split(",");
            let playfreq = Note2Frequency(playsplit[0]);
            let playtime = playsplit[1];
            waitdelay = playtime;
            Play(playfreq, timemode * waitdelay / 1000, osmode)
            console.log(csp + " " + "play " + playsplit[0] + " freq=" + playfreq + ",time=" + playtime);
        }
        if (nowline.substr(0, 6) == "playx ") {
            let playstr = nowline.substr(6);
            let playsplit = playstr.split(",");
            let playfreq = Note2Frequency(playsplit[0]);
            let playtime = playsplit[1];
            waitdelay = 0;
            PlayX(playfreq, timemode * playtime / 1000, osmode)
            console.log(csp + " " + "playx " + playsplit[0] + " freq=" + playfreq + ",time=" + playtime);
        }
        if (nowline.substr(0, 6) == "playi ") {
            let playstr = nowline.substr(6);
            let playsplit = playstr.split(",");
            let playfreq = Note2Frequency(playsplit[0]);
            let playtime = playsplit[1];
            let playtype = playsplit[2];
            waitdelay = 0;
            PlayX(playfreq, timemode * playtime / 1000, playtype)
            console.log(csp + " " + "playi " + playsplit[0] + " freq=" + playfreq + ",time=" + playtime + ",type=" + playtype);
        }
        if (nowline.substr(0, 5) == "wait ") {
            let hltime = parseFloat(nowline.substr(5));
            waitdelay = hltime;
            console.log(csp + " " + "wait " + hltime);
        }
        if (nowline == "TRACK END") {
            trackplaymode = 0;
            console.log(csp + " " + "TRACK END");
        }
    }
    //console.log(nowline)
    if (csp < notelist.length - 1) {
        csp = csp + 1;
        setTimeout(() => { PlayWMBP() }, timemode * waitdelay)
    }
}
