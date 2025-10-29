# Beep.js 0.4.0 接口文档
*描述: 进行简单波形合成，播放 WMBP 1.0 格式文件。*

Beep.js 是 wmcomlib.js2 的一部分，在使用标准框架加载后，以下的接口可用: 
```
setNoteList(nl)
setCSP(val)
Note2Frequency(noteid)
Play(freq, hltime, type = "square")
PlayX(freq, hltime, type = "square")
PlayWMBP()
```

下面提供每个函数的详细说明。

### setNoteList(nl)
设置WMBPT表。
***参数***
(array)nl WMBPT按行分割的数组。
***返回***
无返回。

### setCSP(val)
设置执行指针位置。
***参数***
(number)val 指针的新值。
***返回***
无返回。

### Note2Frequency(noteid)
将音符转换为频率。
***参数***
(string)noteid 标准的音符字符串。
***返回***
(number) 频率值。

### Play(freq, hltime, type = "square")
非连续性的播放一个震荡。
***参数***
(number)freq 震荡频率。
(number)hltime 持续时间，单位秒。
(?string)type 振荡器类型，省略此参数使用方波。
***返回***
无返回。

### PlayX(freq, hltime, type = "square")
连续性的播放一个震荡
***参数***
(number)freq 震荡频率。
(number)hltime 持续时间，单位秒。
(?string)type 振荡器类型，省略此参数使用方波。
***返回***
无返回。

### PlayWMBP()
执行notelist中当前指针位置上的指令。如果表没有遍历完成，则会在完成后延迟调用自己。
***参数***
无参数。
***返回***
无返回。
