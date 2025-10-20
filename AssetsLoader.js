/*
* Copyright(c) A.K.A wmcomlib.js JavaScript Function Library v2
* WMProject1217 Studios 2024
* FileName: AssetsLoader.js
* FileVersion: 0.2.4
* FileDescription: 资源加载子系统
* Author: WMProject1217
* LatestCommit: 2025-7-12
*
* FOR THE DAWN THAT SHALL ARRIVE!
*/
export const id = 'AssetsLoader';
export const name = 'AssetsLoader';
export const namext = '资源加载子系统';
export const version = '0.2.4';
export const description = 'Preloading the files.';
export const author = 'WMProject1217';

let SystemContext;
let FileList;
let ErrorHandler;

export async function _init_(context) {
    SystemContext = context;
    FileList = [];
    ErrorHandler = function(str, e = "") { console.error(str, e); };
    console.log('[AssetsLoader]Initializing...');
}

export async function _unload_() {
    console.log('[AssetsLoader]Unloading...');
    // Release all file objects when unloading
    FileList.forEach(file => {
        if (file.data && file.data instanceof Blob && file.readystatus === 2) {
            if (file.objectUrl) {
                URL.revokeObjectURL(file.objectUrl);
            }
        }
    });
    FileList = [];
}

export function SetErrorHandler(funcdx = function(str, e = "") { console.error(str, e); }) {
    ErrorHandler = funcdx;
}

// Object in FileList
class FileDX {
    constructor(url, name = undefined) {
        this.url = url;
        if (name == undefined) {
            this.name = url;
        } else {
            this.name = name;
        }
        this.data = undefined;
        this.objectUrl = undefined;
        this.readystatus = 0; //0 not loaded, 1 loading, 2 loaded, 3 fail, 4 unloaded
    }
}

// This function only works on requesting 'file' protocol in Android WebView which allows file access to local files
function fetchLocal(url) {
    return new Promise(function(resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.onload = function() {
            resolve(xhr.response);
        }
        xhr.onerror = function() {
            reject(new TypeError('Local request failed'));
        }
        xhr.responseType = 'blob';
        xhr.open('GET', url);
        xhr.send();
    });
}

// Add file to list, this function can cover the same name file.
export function AddFileToList(url, name = undefined) {
    if (name == undefined) { name = url; }
    for (var i = 0; i < FileList.length; i++) {
        if (FileList[i].name == name) {
            if (FileList[i].objectUrl) { URL.revokeObjectURL(FileList[i].objectUrl); }
            FileList[i].url = url;
            FileList[i].readystatus = 0;
            FileList[i].data = undefined;
            FileList[i].objectUrl = undefined;
            return i;
        }
    }
    let temp_id = FileList.length;
    FileList[temp_id] = new FileDX(url, name);
    return temp_id;
}

function GetProtocolFromUrl(url) {
    let pos = url.indexOf("://");
    if (pos != -1) {
        return url.substr(0, pos);
    }
    return null;
}

// Load file object in list by id
export async function LoadFileInListById(id) {
    if (id != parseInt(id)) { return; }
    if (id < 0) { return; }
    if (id >= FileList.length) { return; }
    let temp_protocol = GetProtocolFromUrl(FileList[id].url);
    if (temp_protocol == "http:" || temp_protocol == "https:" || temp_protocol == "wmtp:" || temp_protocol == "chrome:" || temp_protocol == "chrome-extension:") {
        // if protocol is supported by fetch, fetch directly
        try {
            let temp_xhr = await fetch(FileList[id].url); 
            if (!temp_xhr.ok) { throw new Error(`HTTP ERROR ${temp_xhr.status}`); }
            FileList[id].data = await temp_xhr.blob();
            FileList[id].readystatus = 2;
        } catch(e) {
            ErrorHandler(e.message + e.stack, e);
        }
    } else if (temp_protocol == "file:") {
        // this only works in Android WebView which allows file access to local files
        try {
            FileList[id].data = await fetchLocal(FileList[id].url);
            FileList[id].readystatus = 2;
        } catch(e) {
            ErrorHandler(e.message + e.stack, e);
        }
    } else {
        if (typeof process != "undefined") {
            if (process.__nwjs == 1) {
                // when protocol not found, and NW.js is detected, use module fs to read
                try {
                    FileList[id].data = _genesis_lib.WMNode.nm_fs.readFileSync(FileList[id].url);
                    FileList[id].readystatus = 2;
                } catch(e) {
                    // try to direct request
                    try {
                        let temp_xhr = await fetch(FileList[id].url); 
                        if (!temp_xhr.ok) { throw new Error(`HTTP ERROR ${temp_xhr.status}`); }
                        FileList[id].data = await temp_xhr.blob();
                        FileList[id].readystatus = 2;
                    } catch(e) {
                        ErrorHandler(e.message + e.stack, e);
                    }
                }
            } else {
                // try to direct request
                try {
                    let temp_xhr = await fetch(FileList[id].url); 
                    if (!temp_xhr.ok) { throw new Error(`HTTP ERROR ${temp_xhr.status}`); }
                    FileList[id].data = await temp_xhr.blob();
                    FileList[id].readystatus = 2;
                } catch(e) {
                    ErrorHandler(e.message + e.stack, e);
                }
            }
        } else {
            // try to direct request
            try {
                let temp_xhr = await fetch(FileList[id].url); 
                if (!temp_xhr.ok) { throw new Error(`HTTP ERROR ${temp_xhr.status}`); }
                FileList[id].data = await temp_xhr.blob();
                FileList[id].readystatus = 2;
            } catch(e) {
                ErrorHandler(e.message + e.stack, e);
            }
        }
    }
    return;
}

export async function LoadAllFileInList() {
    for (var i = 0; i < FileList.length; i++) {
        if (FileList[i].readystatus == 0) {
            await LoadFileInListById(i);
        }
    }
    return;
}

export function RequireFileUrl(name) {
    for (var i = 0; i < FileList.length; i++) {
        if (FileList[i].name == name) {
            if (!FileList[i].objectUrl && FileList[i].data) {
                let file = new File([FileList[i].data], FileList[i].url, { type: FileList[i].data.type });
                FileList[i].objectUrl = window.URL.createObjectURL(file);
            }
            return FileList[i].objectUrl;
        }
    }
    return undefined;
}

export function RequireFileData(name) {
    for (var i = 0; i < FileList.length; i++) {
        if (FileList[i].name == name) {
            return FileList[i].data;
        }
    }
    return undefined;
}

export async function RequireFileUrlByFileUrl(url) {
    for (var i = 0; i < FileList.length; i++) {
        if (FileList[i].url == url) {
            if (!FileList[i].objectUrl && FileList[i].data) {
                let file = new File([FileList[i].data], FileList[i].url, { type: FileList[i].data.type });
                FileList[i].objectUrl = window.URL.createObjectURL(file);
            }
            return FileList[i].objectUrl;
        }
    }
    let fileid = AddFileToList(url);
    await LoadFileInListById(fileid);
    if (FileList[fileid].data) {
        let file = new File([FileList[fileid].data], FileList[fileid].url, { type: FileList[fileid].data.type });
        FileList[fileid].objectUrl = window.URL.createObjectURL(file);
        return FileList[fileid].objectUrl;
    }
    return undefined;
}

export function RemoveFileFromList(name) {
    for (let i = 0; i < FileList.length; i++) {
        if (FileList[i].name === name) {
            if (FileList[i].objectUrl) { URL.revokeObjectURL(FileList[i].objectUrl); }
            FileList.splice(i, 1);
            return 0;
        }
    }
    return 1;
}
