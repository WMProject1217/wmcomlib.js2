/*
* Copyright(c) A.K.A wmcomlib.js Moduled JavaScript Function Library
* WMProject1217 Studios 2024
* FileName: _init_.js
* FileVersion: 0.1.0
* FileDescription: 初始化系统
* Author: WMProject1217
* LatestCommit: 2025-6-30
*/

// 注意：如果你使用 WMWebAppBootLoader 构造页面，则不要引入此脚本。WMWebAppBootLoader 提供了更好的加载方式，本脚本可能与 WMWebAppBootLoader 冲突。

// 在 Chromium 85 之前的版本，该函数未添加，需要额外添加
// 如果仅打算在 Chromium 85 或更新的版本上使用，可以移除本段
String.prototype.replaceAll = function(s1, s2) {
    return this.replace(new RegExp(s1, "gm"), s2);
}

// 睡睡！
window.sleep = function(milliseconds) {
    //延迟几秒，然后继续后面的指令，此函数不会阻塞其他定时函数和渲染函数运行
    //(int)milliseconds 毫秒数
    //无返回
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

window._genesis_ = {};
_genesis_.config = {};
_genesis_.lib = {};
// 生成 lib.base 以便加载和卸载标准模块，对，没错，这个是要由引导程序生成的，没想到帕？
_genesis_.lib.base = {
    // 加载标准库模块
    async LibraryLoad(url) {
        try {
            // 动态加载JS文件
            let library = await import(url);
            // 检查标准库模块是否合法
            if (this.LibraryValidate(library)) {
                if (typeof this.Librarys.get(library.id) != "undefined") {
                    delete library;
                    console.warn(`[lib.base]标准库模块 ${url} (${library.id}) 已被加载过。`);
                    return library.id;
                }
                // 调用标准库模块的初始化函数
                if (typeof library._init_ === 'function') {
                    library._init_(window);
                }

                // 将标准库模块存储在内存中
                this.Librarys.set(library.id, library);
                _genesis_.lib[library.id] = library;
                console.log(`[lib.base]标准库模块 ${url} (${library.id}) 已加载。`);
                return library.id;
            } else {
                console.error(`[lib.base]标准库模块 ${url} 不合法。`);
                return null;
            }
        } catch (error) {
            console.error(`[lib.base]无法加载 ${url} 上的标准库模块: `, error);
            return null;
        }
    },
    // 卸载标准库模块
    async LibraryUnload(libraryId) {
        if (this.Librarys.has(libraryId)) {
            let library = this.Librarys.get(libraryId);

            // 调用标准库模块的卸载函数
            if (typeof library._unload_ === 'function') {
                await library._unload_();
            }

            // 从内存中移除标准库模块
            this.Librarys.delete(libraryId);
            _genesis_.lib[library.id] = null;
            delete _genesis_.lib[library.id];
            console.log(`[lib.base]标准库模块 ${libraryId} 已成功卸载。`);
        } else {
            console.error(`[lib.base]找不到标准库模块 ${libraryId}。`);
        }
    },
    // 获取已加载的标准库模块列表
    LibraryGetList() {
        return Array.from(this.Librarys.keys());
    },
    // 访问标准库模块对象
    LibraryGet(libraryId) {
        return this.Librarys.get(libraryId);
    },
    // 验证标准库模块结构是否合法
    LibraryValidate(library) {
        return library && 
            typeof library._unload_ === 'function' &&
            typeof library._init_ === 'function' &&
            typeof library.id === 'string' &&
            typeof library.name === 'string' &&
            typeof library.version === 'string' &&
            typeof library.description === 'string';
    }
};
_genesis_.lib.base.Librarys = new Map();