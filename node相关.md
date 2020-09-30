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

Koa 执行下一个中间件需要调用 `next()`

```js
app.use(async (ctx, next)=>{
    // 调用下一个中间件
    await next();
    console.log(1);
    ctx.body = 'Hello Zhihu API';
});
app.use(async (ctx)=>{
    console.log(2);
})
```

### 洋葱模型

洋葱模型是一种中间件流程控制方式。

![img](assets/9566895-a1d3c5a8db4a088d.webp)

```js
const Koa = require('koa');
const app = new Koa();

app.use(async (ctx, next) => {
  console.log('中间件 1 进入');
  await next();
  console.log('中间件 1 退出');
});

app.use(async (ctx, next) => {
  console.log('中间件 2 进入');
  await next();
  console.log('中间件 2 退出');
});

app.use(async (ctx, next) => {
  console.log('中间件 3');
});

app.listen(3000);
```

结果：

```js
中间件 1 进入
中间件 2 进入
中间件 3 
中间件 2 退出
中间件 1 退出
```

## 路由

### 路由是什么？

- 决定了不同 URL 是如何被不同地执行的
- 在 Koa 中，是一个中间件

### 为什么要用路由？

- 如果没有路由？
  - 所有请求都做了相同的事
  - 所有的请求都会返回相同的结果

### 路由存在的意义

- 处理不同的 URL
- 处理不同的 HTTP 方法
- 解析 URL 上的参数