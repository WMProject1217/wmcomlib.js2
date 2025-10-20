/*
* Copyright(c) A.K.A wmcomlib.js2 JavaScript Function Library
* WMProject1217 Studios 2024
* FileName: _init_.js
* FileVersion: 0.2.1
* FileDescription: 初始化系统
* Author: WMProject1217
* LatestCommit: 2025-10-9
*
* FOR THE DAWN THAT SHALL ARRIVE!
*/

// 注意：如果你使用 WMWebAppBootLoader 构造页面，则不要引入此脚本。因为 WMWebAppBootLoader 生成的页面上已经嵌入本脚本的内容。

// 在 Chromium 85 之前的版本，该函数未添加，需要额外添加
// 但由于本库里的调用当前基于该方式构造，在 Chromium 85 或更新的版本上使用时仍然需要此修改
String.prototype.replaceAll = function(s1, s2) { return this.replace(new RegExp(s1, "gm"), s2); }

// 睡睡！
window.sleep = function(milliseconds) {
    // 延迟几秒，然后继续后面的指令，此函数不会阻塞其他定时函数和渲染函数运行
    // (int)milliseconds 毫秒数
    // async, 无返回
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

// 本史山的大部分库都会向 document.styleSheets[0] 注入样式，因此必须在不存在时创建它
document.styleSheets[0] || document.head.appendChild(document.createElement('style'));

// 虽然说是 _init_，但实际上只是在初始化 WorldTree。
// 树结构是该系统的基础，本项目的 WorldTree 基本上只有节点命名和函数命名上与 WiMiOS 内核中 WorldTree 部分对应。

// 这必须是全局的喵！
window._genesis_ = {};

// 这是放配置的节点，其中的节点按照某种标准规划，每个最小部分可单独保存和载入
// 但咱拆的太散了，需要加载一个叫 ConfigManager 的库才行
_genesis_.config = {};

// 设备节点
_genesis_.device = {};

// 这是放环境变量的节点
_genesis_.environment = {};

// 于原始的设计上，这些库载入内存后，接口仅导出到 lib 中
// 但在这里，除了此处加入的几个对象之外，皆是影子...
_genesis_.lib = {};

// lib.base 是库管理器的接口，包含库管理器函数的导出
// 既然是 JavaScript，咱就草率一些帕！
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
                // 调用标准库模块的初始化函数，并传递当前环境的根上下文
                if (typeof library._init_ === 'function') { await library._init_(_genesis_); }

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
            if (typeof library._unload_ === 'function') { try { await library._unload_(); } catch(error) { console.error(error); } }

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

// 库实际上保存于此
_genesis_.lib.base.Librarys = new Map();

// 草率的Application支持，这和 lib.base 原理一致，咱就不搓注释了（
_genesis_.Application = new Map();
_genesis_.lib.Application = {
    status_busy: false,
    async Load(url) {
        try {
            let applicationdx = await import(url);
            if (this.Validate(applicationdx)) {
                if (typeof _genesis_.Application.get(applicationdx.id) != "undefined") {
                    delete applicationdx;
                    console.warn(`[lib.Application]应用程序 ${url} (${applicationdx.id}) 已被加载过。`);
                    return applicationdx.id;
                }
                if (typeof applicationdx._init_ === 'function') { this.status_busy = true; await applicationdx._init_(window._genesis_); this.status_busy = false; }

                _genesis_.Application.set(applicationdx.id, applicationdx);
                console.log(`[lib.Application]应用程序 ${url} (${applicationdx.id}) 已加载。`);
                return applicationdx.id;
            } else {
                console.error(`[lib.Application]应用程序 ${url} 不合法。`);
                return null;
            }
        } catch (error) {
            console.error(`[lib.Application]无法加载 ${url} 上的应用程序: `, error);
            this.status_busy = false;
            return null;
        }
    },
    async Unload(applicationId) {
        if (_genesis_.Application.has(applicationId)) {
            let applicationdx = _genesis_.Application.get(applicationId);

            if (typeof applicationdx._unload_ === 'function') { this.status_busy = true; try { await applicationdx._unload_(); } catch(error) { console.error(error); } this.status_busy = false; }

            _genesis_.Application.delete(applicationId);
            console.log(`[lib.Application]应用程序 ${applicationId} 已成功卸载。`);
        } else {
            console.error(`[lib.Application]找不到应用程序 ${applicationId}。`);
        }
    },
    Validate(applicationdx) {
        return applicationdx && 
            typeof applicationdx._unload_ === 'function' &&
            typeof applicationdx._init_ === 'function' &&
            typeof applicationdx.id === 'string' &&
            typeof applicationdx.name === 'string' &&
            typeof applicationdx.version === 'string' &&
            typeof applicationdx.description === 'string';
    }
};



// 要给小可爱们一些惊喜哦♪
/*private static final String[] */ const PlayerJoin_TipTextList = [
    "Ciallo～(∠・ω< )⌒★", 

    // HK3RD
    "把这个不完美的世界，变成你所期望的样子！",
    "姬子温柔的看着你，不再言语",
    "嗨♪想我了吗~", 
    "芽衣姐....我....不想死......", 
    "鸟，为什么会飞？",
    "比起这个世界，你更重要！",
    "再见了，我的理解者",
    "我守住了，身为姐姐的骄傲",
    "这就是......最后一课了......",
    "现在，我终于可以骄傲的对他们说，大家，久等了",
    "再见了，我的大发明家",
    "师傅，立雪只能陪您到这儿了",
    "科斯魔很怕孤单，我只是不想让他在梦里也是一个人",
    "这就是......律者的宿命吗？",

    // GI
    "让世界，彻底遗忘我",
    "再见，那维莱特，希望你喜欢这五百年来的戏份",
    "蛋，糖，杏仁，大小姐要自己带了",
    "我果然......没在被神明注视着啊",

    // HKSR
    "敬，不完美的明天",
    "再见，卡卡瓦夏......",
    "魔↗术↘技巧",
    "明天见，是世上最伟大的预言",
    "阿雅...你能听到吗？再和我...说句话吧......求你了......", 

    // WMFX
    "明天，终将到来", 
    "不可以，绝对不可以在这里结束！",
    "我在呢，一直都在"
];

addEventListener("DOMContentLoaded", () => {
    const PlayerJoinTipText = PlayerJoin_TipTextList[parseInt(Math.random() * (PlayerJoin_TipTextList.length - 1))];;
    console.log(`/*
* Copyright(c) A.K.A wmcomlib.js2 JavaScript Function Library
* WMProject1217 Studios 2024
*
* FOR THE DAWN THAT SHALL ARRIVE!
*/

` + PlayerJoinTipText);
    if (typeof window.WMMessageSystem != 'undefined') {
        window.WMMessageSystem.LogMessage._init_();
        window.WMMessageSystem.LogMessage.send(`Copyright(c) A.K.A wmcomlib.js2 JavaScript Function Library<br>WMProject1217 Studios 2024<br>` + PlayerJoinTipText, 1);
    }
});
