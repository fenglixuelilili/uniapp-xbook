# uniapp-xbook 绘本/书本 翻页
------
# 简介
 uniapp-xbook是一个模拟书本、绘本翻页，书本的页内容完全自定义，根据数据不限页数，支持语音，语音重新播放，自动翻页，手动翻页，重复播放等功能
 
## 运行本项目

## 注意事项（重要）
### 项目本身是由npm的方式构建的，由于上传插件之后DCloud自动解析成非npm项目，完整项目请到 https://github.com/fenglixuelilili/uniapp-xbook 地址下载-对应下方文档
### 下载之后的项目可以直接在HBuilderX中运行

## 安装依赖
```
npm i
```

### 运行至小程序端
```
npm run dev:mp-weixin
```
### 如何使用，应用到自己的项目中？
1. 将utils文件夹中的文件内容复制到自己的项目中，并且在main.js中引入
<pre>
    <code>
			在main.js中引入：
			import xwutlis from './utlis'
			//将方法引入到Vue原型上用来全局访问
			Vue.prototype.$xw = {}
			for (let fn in xwutlis) {
				Vue.prototype.$xw[fn] = xwutlis[fn]
			}
    </code>
</pre>

2. 将store中的数据引入到项目中 &emsp;

<pre>
<code>
import Vuex from 'vuex'
import Vue from 'vue'
Vue.use(Vuex)
const store = new Vuex.Store({
state: {
	visableNoCourse: false,
	loading: false,
	// 平台
	platform: uni.getSystemInfoSync().platform,
	// 绘本相关
	book: {
		// 多少秒出现小手
		coursetime: 1000,
		iscourse: false,
		auto: true,
		src: ''
	}
},
mutations: {},
actions: {}
})
export default store
</code>
</pre>

3.将核心页面引入pages/cursordetail/books.vue &emsp;

4.将components相关组件全部引入到 ，其中books为核心翻页组件&emsp;

## 数据结构

```
data 数组中每一个对象代表一本书，content_list字段中每一个对象代表的是每一页（可以自定义）
除content_list之外的字段，可以去除（根据业务来），不影响正常使用

data = [
	{
		content_list: [
			{
				image_url:
				'https://image.xwsxedu.com/f7e6017273c4f54e449cd72b7200780a.jpg',
				voice_url:
				'https://voice.xwsxedu.com/303fcfec1697ecd89ed21764626e8b74.mp3'
			}
		],
		create_time: 1606550952,
		describe: 'C版5-6岁体验课第4节',
		picture_book_id: 'F436q2EXGc',
		state: 1,
		title: '吨吨号上丢失的货箱',
		update_time: 1608198299
	}
]

将数据赋值给 this.getBook_init（data） 函数

```

## 绘本相关

### 如何自定义每页内容？

	在component中的books/commentpage.vue 组件，根据需求写入自己的样式即可
	
### 每一页语音播放完成的回调地址在哪里？
	在component中的books/books.vue 搜索组件中的 callback 函数
### 如何更改翻页动画交互方式？
	在component中的books/books.vue中寻找.animate,.animateRight css类，分别代表后退动画，与前进动画
	
### 顶部的三个按键是干什么的？
	分别代表返回，自动播放与手动播放切换，音频重新播放功能，（三个功能在pages/cursordetail/books.vue中可进行屏蔽，不影响正常使用）


