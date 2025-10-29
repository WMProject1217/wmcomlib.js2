# AssetsLoader.js 0.2.4 接口文档
*描述: 预加载文件。*

AssetsLoader.js 是 wmcomlib.js2 的一部分，在使用标准框架加载后，以下的接口可用: 
```
(新增) RemoveFileFromList(name)
SetErrorHandler(funcdx = function(str, e = "") { console.error(str, e); })
AddFileToList(url, name = undefined)
async LoadFileInListById(id)
async LoadAllFileInList()
RequireFileUrl(name)
RequireFileData(name)
async RequireFileUrlByFileUrl(url)
```

下面提供每个函数的详细说明。

### (新增) RemoveFileFromList(name)
销毁 objecturl，然后移除文件以便释放内存。
***参数***
(string)name 列表中文件的名称。
***返回***
(number) 如果成功，返回0，否则返回非零值。

### SetErrorHandler(funcdx = function(str, e = "") { console.error(str, e); })
设置错误处理器。
***参数***
(?function)funcdx 提供一个函数，用作错误处理。
***返回***
无返回。

### AddFileToList(url, name = undefined)
将文件添加到文件列表，此函数不会触发加载。
***参数***
(string)url 文件的url。
(?string)name 列表中文件的名称。
***返回***
(number)id 文件的序号。

### async LoadFileInListById(id)
加载列表中的单个文件。
如果发生错误，则会调用错误处理器。
***参数***
(string)id 文件的序号。
***返回***
无返回。

### async LoadAllFileInList()
遍历列表，如果有文件未加载，则对其调用LoadFileInListById。
***参数***
无参数。
***返回***
无返回。

### RequireFileUrl(name)
获取一个已预加载文件的地址。
***参数***
(string)name 列表中文件的名称。
***返回***
(string) 一个指向已加载文件的对象的blob url。
如果未找到，则返回 undefined。

### RequireFileData(name)
获取一个已预加载文件的内容。
***参数***
(string)name 列表中文件的名称。
***返回***
(object) 已加载文件的数据。
如果未找到，则返回 undefined。

### async RequireFileUrlByFileUrl(url)
使用文件的url获取文件的地址。
如果文件已经加载，立即返回其blob url。
如果文件尚未加载，则立即开始加载它，加载完成后返回其blob url。
***参数***
(string)url 文件的url。
***返回***
(string) 一个指向已加载文件的对象的blob url。
