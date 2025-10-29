# SaveManager.js 0.1.0 接口文档
*描述: 存档、加载档案、操作COOKIE、WebStorage和IndexedDB。*

SaveManager.js 是 wmcomlib.js2 的一部分，在使用标准框架加载后，以下的接口可用: 
```
async ConfigLoadFromJSON(pJson)
async ConfigSaveToJSON()
async ConfigSaveToCookie(id, days = 30, path = '/')
async ConfigLoadFromCookie(id)
async ConfigSaveToLocalStorage(id)
async ConfigLoadFromLocalStorage(id)
async ConfigSaveToIndexedDB(id)
async ConfigLoadFromIndexedDB(id)

CookieWrite(name, value, days = 30, path = '/')
CookieRead(name)
CookieDelete(name, path = '/')
LocalStorageWrite(key, value)
LocalStorageRead(key)
LocalStorageDelete(key)
LocalStorageClear()
SessionStorageWrite(key, value)
SessionStorageRead(key)
async IndexedDBOpen(dbname = "SaveManager")
async IndexedDBClose()
async IndexedDBWrite(store, key, value)
async IndexedDBRead(store, key)
async IndexedDBDelete(store, key)

DumpCookie()
DumpWebStorage()
async DumpIndexedDB()
```

下面提供每个函数的详细说明。

### async ConfigLoadFromJSON(pJson)
将JSON格式的存档数据合并进 _genesis\_.save
***参数***
(string)pJson 装有JSON结构的字符串。
***返回***
(number)0

### async ConfigSaveToJSON()
将 _genesis\_.save 转储为JSON字符串。
***参数***
无参数。
***返回***
(string) 装有JSON结构的字符串。
如果发生错误，则返回 null。

### async ConfigSaveToCookie(id, days = 30, path = '/')
将存档保存到Cookie。
***参数***
(string)id 指定存档的id，需要为没有空格和符号的ASCII字符串。
(?number)days 指定存档保存的最大天数，默认为 30 天。
(?string)path 指定存档Cookie保存的路径。
***返回***
(number)0
如果发生错误，则返回 -1。

### async ConfigLoadFromCookie(id)
从Cookie读取存档。
***参数***
(string)id 指定存档的id。
***返回***
(number)0
如果发生错误，则返回 -1。

### async ConfigSaveToLocalStorage(id)
将存档保存到LocalStorage。
***参数***
(string)id 指定存档的id，需要为没有空格和符号的ASCII字符串。
***返回***
(number)0
如果发生错误，则返回 -1。


### async ConfigLoadFromLocalStorage(id)
从LocalStorage读取存档。
***参数***
(string)id 指定存档的id。
***返回***
(number)0
如果发生错误，则返回 -1。

### async ConfigSaveToIndexedDB(id)
将存档保存到IndexedDB。
如果没有打开任何IndexedDB，则会立即调用 IndexedDBOpen() 打开数据库。
***参数***
(string)id 指定存档的id，需要为没有空格和符号的ASCII字符串。
***返回***
(number)
如果成功，则返回 0。
如果发生内部错误，则返回 -1。
如果写入失败，则返回 -2。

### async ConfigLoadFromIndexedDB(id)
从IndexedDB读取存档。
如果没有打开任何IndexedDB，则会立即调用 IndexedDBOpen() 打开数据库。
***参数***
(string)id 指定存档的id。
***返回***
(number)
如果成功，则返回 0。
如果发生内部错误，则返回 -1。



### CookieWrite(name, value, days = 30, path = '/')
将值写入到指定的Cookie。
***参数***
(string)name 键的名称，需要为没有空格和符号的ASCII字符串。
(string)value 要写入的值，需要为没有空格和符号的ASCII字符串。
(?number)days 保存的最大天数，默认为 30 天。
(?string)path Cookie保存的路径。
***返回***
(number)0

### CookieRead(name)
从指定的Cookie读取值。
***参数***
(string)name 键的名称。
***返回***
(string) 键的值。
如果发生错误，则返回 null。

### CookieDelete(name, path = '/')
删除指定的Cookie。
***参数***
(string)name 键的名称。
(?string)path Cookie保存的路径。
***返回***
(number)0

### LocalStorageWrite(key, value)
将值写入到LocalStorage中指定的键。
***参数***
(string)key 键的名称，需要为没有空格和符号的ASCII字符串。
(string)value 要写入的值，需要为没有空格和符号的ASCII字符串。
***返回***
(number)
如果成功，返回 0，否则返回非零值。

### LocalStorageRead(key)
从LocalStorage中指定的键读取值。
***参数***
(string)key 键的名称。
***返回***
(string) 键的值。
如果发生错误，则返回 null。

### LocalStorageDelete(key)
删除LocalStorage中指定的键。
***参数***
(string)key 键的名称。
***返回***
无返回。

### LocalStorageClear()
<span style="color: #000000; background-color: #EECCCC; padding: 8px; border-left: solid 4px #EE0000;">该操作危险，请确定你知道自己在做什么！</span>  

清空LocalStorage，这会删除LocalStorage中的所有内容。
***参数***
无参数。
***返回***
无返回。

### SessionStorageWrite(key, value)
<span style="color: #000000; background-color: #EEEECC; padding: 8px; border-left: solid 4px #CCCC00;">SessionStorage 仅用于保存临时数据，在页面被关闭后自动清除。</span>  

将值写入到SessionStorage中指定的键。
***参数***
(string)key 键的名称，需要为没有空格和符号的ASCII字符串。
(string)value 要写入的值，需要为没有空格和符号的ASCII字符串。
***返回***
(number)
如果成功，返回 0，否则返回非零值。

### SessionStorageRead(key)
<span style="color: #000000; background-color: #EEEECC; padding: 8px; border-left: solid 4px #CCCC00;">SessionStorage 仅用于保存临时数据，在页面被关闭后自动清除。</span>  

从SessionStorage中指定的键读取值。
***参数***
(string)key 键的名称。
***返回***
(string) 键的值。
如果发生错误，则返回 null。

### async IndexedDBOpen(dbname = "SaveManager")
打开一个IndexedDB数据库。
如果数据库没有创建，会自动创建数据库并在其中创建 default 储存。
如果打算处理返回值，则仅需校验其是否为 null。本模块的其他函数使用内部保存的指针操作，不需要保留返回值。
同一时间内能且只能打开一个数据库。
***参数***
(?string)dbname 数据库的名称。
***返回***
(pointer) 一个指向已打开数据库的指针。
如果发生错误，则返回 null。

### async IndexedDBClose()
关闭已打开的IndexedDB数据库。
***参数***
无参数。
***返回***
(number)
如果成功，则返回 0。
如果发现未打开任何数据库，则返回 -1。

### async IndexedDBWrite(store, key, value)
向当前已打开的IndexedDB数据库中写入值。
***参数***
(string)store 储存的名称，需要为没有空格和符号的ASCII字符串。如果不知道应使用哪个储存，请使用 default。
(string)key 键的名称，需要为没有空格和符号的ASCII字符串。
(string)value 要写入的值，需要为没有空格和符号的ASCII字符串。
***返回***
(number)
如果成功，则返回 0。
如果发现未打开任何数据库，则返回 -1。
如果写入失败，则返回 -2。

### async IndexedDBRead(store, key)
从当前已打开的IndexedDB数据库中读取值。
***参数***
(string)store 储存的名称。如果不知道应使用哪个储存，请使用 default。
(string)key 键的名称。
***返回***
(string) 键的值。
如果发生错误，则返回 null。
如果键不存在，则返回 undefined。

### async IndexedDBDelete(store, key)
从当前已打开的IndexedDB数据库中删除键。
***参数***
(string)store 储存的名称。如果不知道应使用哪个储存，请使用 default。
(string)key 键的名称。
***返回***
(number)
如果成功，则返回 0。
如果发现未打开任何数据库，则返回 -1。
如果写入失败，则返回 -2。



### DumpCookie()
该函数立即转储所有Cookie。
***参数***
无参数。
***返回***
(object) 包含转储数据结构的对象。

### DumpWebStorage()
该函数立即转储所有LocalStorage和SessionStorage。
***参数***
无参数。
***返回***
(object) 包含转储数据结构的对象。

### async DumpIndexedDB()
该函数立即转储所有IndexedDB。
***参数***
无参数。
***返回***
(object) 包含转储数据结构的对象。

