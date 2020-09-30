## Koa 简介（抠啊）

- 基于 Node.js 的下一代 Web 框架
  - 基于 Node.js：Node.js 模块
  - 下一代：蚕食第一代 Web 框架 Express 的市场
  - Web 框架：不是命令行工具、不是算法
- 官网简介：Koa 是一个新的 web 框架
  - **由 Express 幕后的原班人马打造**
  -  **Web 应用和 API 开发领域**
  - **更小、更富有表现力、更健壮**
  - **利用 async 函数 ，丢弃回调函数****，
  - **增强错误处理（try catch）**。
  - **Koa 没有捆绑任何中间件**
  - **快速而愉快的编写服务端应用程序**

## 操作步骤

- 初始化项目
- 安装 Koa
- 编写 Hello World
- 学习自动重启 —— `nodemon 模块`

![code](assets/code.png)

补：开发环境下，自动重启模块安装时加 `--dev`



## async 使用

正常使用异步函数，会有嵌套关系。

```js
fetch( ' //api.github.com/users ' ).then(res => res.json()).then(json=>{
    console.log(json);
    fetch( '//api.github.com/users/lewis617' ).then(res => res.json()).then(json2 =>{
        console.log(json2);
    })
})
```

使用 async 语法

```js
(async () =>{
	const res = await fetch( '//api.github.com/users');
	const json = await res.json();
	console.log(json);
	const res2 = await fetch( ' //api.github.com/users/lewis617');
	const json2 = await res2.json();
    console.log(json2);
})()

```

## Koa 中间件与洋葱模型

