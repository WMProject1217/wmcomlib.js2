/*
* Copyright(c) A.K.A wmcomlib.js JavaScript Function Library v2
* WMProject1217 Studios 2023
* FileName: SaveManager.js
* FileVersion: 0.1.0
* FileDescription: 存档子系统
* Author: WMProject1217
* LatestCommit: 2025-7-2
*
* FOR THE DAWN THAT SHALL ARRIVE!
*/

export const id = 'SaveManager';
export const name = 'SaveManager';
export const namext = '存档子系统';
export const version = '0.1.0';
export const description = '存档、加载档案、操作COOKIE、WebStorage和IndexedDB。';
export const author = 'WMProject1217';

let SystemContext;
let IndexedDB_db = null;
let IndexedDB_isOpening = false;

export async function _init_(context) {
    SystemContext = context;
    _genesis_.save = {};
    console.log('[SaveManager]Initializing...');
}

export async function _unload_() {
    console.log('[SaveManager]Unloading...');
}



export function CookieWrite(name, value, days = 30, path = '/') {
    let expires = '';
    if (days) {
        let datedx = new Date();
        datedx.setTime(datedx.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = `; expires=${datedx.toUTCString()}`;
    }
    document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}${expires}; path=${path}`;
    return 0;
}

export function CookieRead(name) {
    let nameDX = `${encodeURIComponent(name)}=`;
    let cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i];
        while (cookie.charAt(0) === ' ') {
            cookie = cookie.substring(1, cookie.length);
        }
        if (cookie.indexOf(nameDX) === 0) {
            return decodeURIComponent(cookie.substring(nameDX.length, cookie.length));
        }
    }
    return null;
}

export function CookieDelete(name, path = '/') {
    CookieWrite(name, '', -1, path);
}

export function LocalStorageWrite(key, value) {
    try {
        localStorage.setItem(key, value);
        return 0;
    } catch (e) {
        console.error("Fail to write to LocalStorage.", e);
        return -1;
    }
}

export function LocalStorageRead(key) {
    try {
        let value = localStorage.getItem(key);
        return value !== null ? value : null;
    } catch (e) {
        console.error("Fail to read from LocalStorage.", e);
        return null;
    }
}

export function LocalStorageDelete(key) {
    localStorage.removeItem(key);
}

export function LocalStorageClear() {
    localStorage.clear();
}

export function SessionStorageWrite(key, value) {
    try {
        sessionStorage.setItem(key, value);
        return 0;
    } catch (e) {
        console.error("Fail to write to SessionStorage.", e);
        return 1;
    }
}

export function SessionStorageRead(key) {
    try {
        return sessionStorage.getItem(key);
    } catch (e) {
        console.error("Fail to read from SessionStorage", e);
        return null;
    }
}

export async function IndexedDBOpen(dbname = "SaveManager") {
    if (IndexedDB_db) { return new Promise((resolve) => { resolve(IndexedDB_db); }); };
    if (IndexedDB_isOpening) { return new Promise((resolve) => { resolve(null); }); }
    IndexedDB_isOpening = true;
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(dbname);
        request.onerror = (event) => {
            IndexedDB_isOpening = false;
            console.error("Fail to open IndexedDB.", event.target.error);
            resolve(null);
        };
        request.onsuccess = (event) => {
            IndexedDB_db = event.target.result;
            IndexedDB_isOpening = false;
            IndexedDB_db.onclose = () => { IndexedDB_db = null; };
            //IndexedDB_db.onversionchange = () => { IndexedDB_db.close(); IndexedDB_db = null; };
            resolve(IndexedDB_db);
        };
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains('default')) {
                db.createObjectStore('default', { keyPath: 'id' });
            }
        };
    });
}

export function IndexedDBClose() {
    if (!IndexedDB_db) { return new Promise((resolve) => { resolve(-1); }); };
    return new Promise((resolve) => {
        IndexedDB_db.close();
        IndexedDB_db = null;
        resolve(0);
    });
}

export function IndexedDBWrite(store, key, value) {
    if (!IndexedDB_db) { return new Promise((resolve) => { resolve(-1); }); }
    return new Promise((resolve, reject) => {
        const transaction = IndexedDB_db.transaction(store, 'readwrite');
        const objectStore = transaction.objectStore(store);
        const request = objectStore.put({ id: key, value });
        request.onerror = (event) => { console.error("Fail to write to IndexedDB.", event.target.error); resolve(-2); };
        request.onsuccess = () => { resolve(0); };
    });
}

export function IndexedDBRead(store, key) {
    if (!db) { return new Promise((resolve) => { resolve(null); }); }
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(store, 'readonly');
        const objectStore = transaction.objectStore(store);
        const request = objectStore.get(key);
        request.onerror = (event) => { console.error("Fail to read from IndexedDB.", event.target.error); resolve(null); };
        request.onsuccess = (event) => { const result = event.target.result; resolve(result ? result.value : undefined); };
    });
}

export function IndexedDBDelete(store, key) {
    if (!db) { return new Promise((resolve) => { resolve(-1); }); }
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(store, 'readwrite');
        const objectStore = transaction.objectStore(store);
        const request = objectStore.delete(key);
        request.onerror = (event) => { console.error("Fail to write to IndexedDB.", event.target.error); resolve(-2); };
        request.onsuccess = () => { resolve(0); };
    });
}



function NodeTreeDeepMerge(target, source) {
    for (const key in source) {
        if (source.hasOwnProperty(key)) {
            if (source[key] && typeof source[key] === 'object' && target[key] && typeof target[key] === 'object') {
                NodeTreeDeepMerge(target[key], source[key]);
            } else {
                target[key] = source[key];
            }
        }
    }
}

export async function ConfigLoadFromJSON(pJson) {
    let pSaveData = JSON.parse(pJson);
    NodeTreeDeepMerge(_genesis_.save, pSaveData);
    return 0;
}

export async function ConfigSaveToJSON() {
    // This function may throw errors when you save BigInt or contains a circular reference in it.
    try {
        let pJson = JSON.stringify(_genesis_.save);
        return pJson;
    } catch (error) {
        console.error("Fail to convert to JSON.", error);
        return null;
    }
}

export async function ConfigSaveToCookie(id, days = 30, path = '/') {
    let pJson = await ConfigSaveToJSON();
    if (pJson == null) { return -1; }
    return CookieWrite("save_" + id, pJson, days, path);
}

export async function ConfigLoadFromCookie(id) {
    let pJson = CookieRead("save_" + id);
    if (pJson == null) { return -1; }
    let retcode = await ConfigLoadFromJSON(pJson);
    return retcode;
}

export async function ConfigSaveToLocalStorage(id) {
    let pJson = await ConfigSaveToJSON();
    if (pJson == null) { return -1; }
    return LocalStorageWrite("save_" + id, pJson);
}

export async function ConfigLoadFromLocalStorage(id) {
    let pJson = LocalStorageRead("save_" + id);
    if (pJson == null) { return -1; }
    let retcode = await ConfigLoadFromJSON(pJson);
    return retcode;
}

export async function ConfigSaveToIndexedDB(id) {
    if (!IndexedDB_db) { await IndexedDBOpen(); }
    let pJson = await ConfigSaveToJSON();
    if (pJson == null) { return 1; }
    let retcode = await IndexedDBWrite("default", "save_" + id, pJson);
    return retcode;
}

export async function ConfigLoadFromIndexedDB(id) {
    if (!IndexedDB_db) { await IndexedDBOpen(); }
    let pJson = await IndexedDBRead("default", "save_" + id);
    if (pJson == null) { return -1; }
    let retcode = await ConfigLoadFromJSON(pJson);
    return retcode;
}



function GetCookieItemDetails(name) {
    let cookie = document.cookie.split('; ').find(row => row.startsWith(name + '='));
    if (!cookie) return {};
    let parts = cookie.split(';').map(part => part.trim());
    let details = {};
    for (let i = 1; i < parts.length; i++) {
        const [key, value] = parts[i].split('=');
        const lowerKey = key.toLowerCase();
        if (lowerKey === 'expires') {
            details.expires = value ? new Date(value) : null;
        } else if (lowerKey === 'domain') {
            details.domain = value;
        } else if (lowerKey === 'path') {
            details.path = value;
        } else if (lowerKey === 'secure') {
            details.secure = true;
        } else if (lowerKey === 'httponly') {
            details.httpOnly = true;
        } else if (lowerKey === 'samesite') {
            details.sameSite = value;
        }
    }
    return details;
}

export function DumpCookie() {
    let cookies = document.cookie.split('; ');
    let cookieArray = [];
    cookies.forEach(cookie => {
        const parts = cookie.split('=');
        const name = parts.shift();
        const value = parts.join('=');
        const cookieDetails = GetCookieItemDetails(name);
        cookieArray.push({
            name: name,
            value: value,
            domain: cookieDetails.domain,
            path: cookieDetails.path,
            expires: cookieDetails.expires,
            secure: cookieDetails.secure,
            httpOnly: cookieDetails.httpOnly,
            sameSite: cookieDetails.sameSite
        });
    });
    return cookieArray;
}

export function DumpWebStorage() {
    let storageData = { localStorage: {}, sessionStorage: {} };
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        storageData.localStorage[key] = localStorage.getItem(key);
    }
    for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        storageData.sessionStorage[key] = sessionStorage.getItem(key);
    }
    return storageData;
}

async function ExportObjectStore(db, storeName) {
    let transaction = db.transaction(storeName, 'readonly');
    let store = transaction.objectStore(storeName);
    let data = [];
    return new Promise((resolve, reject) => {
        const cursorRequest = store.openCursor();
        cursorRequest.onerror = () => reject(cursorRequest.error);
        cursorRequest.onsuccess = (event) => {
            const cursor = event.target.result;
            if (cursor) {
                data.push({ key: cursor.key, value: cursor.value });
                cursor.continue();
            } else {
                resolve(data);
            }
        };
    });
}

export async function DumpIndexedDB() {
    let databases = await indexedDB.databases();
    let result = {};
    for (const dbInfo of databases) {
        const dbName = dbInfo.name;
        result[dbName] = {};
        const db = await new Promise((resolve, reject) => {
            const request = indexedDB.open(dbName);
            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result);
        });
        for (const storeName of Array.from(db.objectStoreNames)) {
            result[dbName][storeName] = await ExportObjectStore(db, storeName);
        }
        db.close();
    }
    return result;
}
