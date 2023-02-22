# ChatChain
browser extension works like langchain but with ChatGPT(WIP)
nowtimes, only support Translate input to English on ChatChain with Google Translate


你可能发现ChatGPT 的英文问题会得到更好的回复，所以可以把中文翻译成英文之后再翻译回来，这个脚本可以自动完成这个功能。

该脚本拦截聊天输入框的提交按钮，当用户按下该按钮时，它将使用Google翻译将输入的文本翻译成英文。翻译后的文本将作为聊天消息发送。

该脚本还设置了变异观察器，以监视DOM的更改并重新翻译回复。

由于翻译会影响对话进入翻译模式，因此该脚本使用Google翻译而不是ChatGPT本身。目前，由于Google的API限制，该脚本只支持短文本，通常只能翻译一句话。

您可以使用前缀 "'默认模式|', 'default|', 'd|' 跳过翻译，使用前缀 ['切换模式', 'toggle', 't'] 切换翻译模式。


The script is a work in progress and may have some issues. The author's email is provided in case of any bugs or suggestions.