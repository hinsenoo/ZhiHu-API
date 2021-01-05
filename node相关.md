

## 项目结构

- app
  - controllers —— 控制器模块
  - routes —— 路由模块
  - models —— 模型集合
  - config.js —— 配置文件
  - index.js —— 项目入口文件
- package.json ：项目配置信息，依赖模块的定义

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

## 编写 Koa 路由中间件

### 操作步骤

- 处理不同的 URL
- 处理不同的 HTTP 方法
- 解析 URL 上的参数

```js
const Koa = require('koa');
const app = new Koa();

// use 使用中间件
app.use(async (ctx)=>{
    if(ctx.url === '/'){
        ctx.body = '这是主页';
    }else if(ctx.url === '/users'){				// 处理不同的 URL
        if(ctx.method === 'GET'){				// 处理不同的 HTTP 方法
            ctx.body = '这是用户列表页';
        }else if(ctx.method === 'POST'){
            ctx.body = '创建用户';
        }else{
            // 405：不允许这个方法
            ctx.status = 405;
        }
    }else if(ctx.url.match(/\/users\/\w+/)){	// 解析 URL 上的参数
        // 匹配正则：\w 匹配字母 + 一个或多个
        // 匹配符合小括号内的内容: userId
        // [
        //     "/users/111",
        //     "111"    
        // ]
        const userId = ctx.url.match(/\/users\/(\w+)/)[1];
        ctx.body = `这是用户 ${userId}`;
    }else {
        // 404：服务器上没有找到请求的资源
        ctx.status = 404;
    }
});

app.listen(3000);
```

## 使用 koa-router 实现路由

- 更优雅的实现路由基本功能
- 演示一些高级路由功能，如前缀、多中间件

```js
const Koa = require('koa');
const Router = require('koa-router');
const app = new Koa();
const router = new Router();
// 前缀替代
const usersRouter = new Router({ prefix: '/users' });

// 多中间件，使用场景：用户校验、数据安全（分层系统里面的安全层);
// 鉴权
const auth = async(ctx, next) => {
    if(ctx.url !== 'users'){
        ctx.throw(401);
    }
};

// 处理不同的 URL
router.get('/', (ctx)=>{
    ctx.body = '这是主页';
});
// 正常写法=============================
// router.get('/users', (ctx)=>{
//     ctx.body = '这是用户列表';
// });

// // 处理不同的 HTTP 方法
// router.post('/users', (ctx)=>{
//     ctx.body = '创建用户';
// });

// // 解析 URL 参数
// router.get('/users/:id', (ctx)=>{
//     ctx.body = `这是用户 ${ctx.params.id}`;
// });

// 前缀写法============================= 
usersRouter.get('/', (ctx)=>{
    ctx.body = '这是用户列表';
});
usersRouter.post('/', (ctx)=>{
    ctx.body = '创建用户';
});
// 多中间件，仿鉴权
usersRouter.get('/:id',auth, (ctx)=>{
    ctx.body = `这是用户 ${ctx.params.id}`;
});

// router.routes() 来加载路由中间件
app.use(router.routes());
// 前缀路由中间件
app.use(usersRouter.routes());


app.listen(3000);
```

## HTTP options方法的作用是什么？

### 为何要了解 options 方法的作用? 

- 这是一道面试题
- 帮助理解 koa-router 的 allowedMethods 的作用

### options 方法的作用

- 检测服务器所支持的请求方法
- CORS 中的预检请求（检测是否允许跨域）

### allowedMethods 的作用

- 响应 options 方法，告诉它所支持的请求方法
  - `app.use(usersRouter.allowedMethods());`
- 相应的返回 405（不允许）和 501（没实现）
  - **405 不允许**：服务器支持该方法，但是还未对该方法进行响应处理。
  - **501 没实现**：服务器本身不支持该方法。



##   RESTful API 最佳实践——增删改查应该返回什么响应？

### 操作步骤

- 实现增删改查
- 返回正确的响应

```js
// 1、获取用户列表
usersRouter.get('/', (ctx) => {
    ctx.body = [
        { name: '李雷' },
        { name: '韩梅梅' }
    ];
});
// 2、新建用户
usersRouter.post('/', (ctx) => {
    ctx.body = { name: '李雷' };
});
// 3、获取用户
usersRouter.get('/:id', (ctx) => {
    ctx.body = { name: '李雷' };
});
// 4、修改用户
usersRouter.put('/:id', (ctx) => {
    ctx.body = { name: '李雷2' };
});
// 5、删除用户
usersRouter.delete('/:id', (ctx) => {
    // 删除成功，但是不返回内容
    ctx.status = 204;
});
```

- `put`：整体替换，`patch`：部分替换

## 控制器简介

### 什么是控制器？

- 拿到路由分配的任务，并执行
- 在 Koa 中，是一个中间件

### 为什么要用控制器？

- 获取 HTTP 请求参数
- 处理业务逻辑
- 发送 HTTP 响应

#### 1. 获取 HTTP 请求参数

- Query String，如 `?q=keyword`
- Router Params，如 `/users/:id`
- Body，如 `{name: "李雷"}`
- Header，如 `Accept（媒体格式）、Cookie`

#### 2. 发送 HTTP 响应

- 发送 Status，如 `200/400` 等
- 发送 Body，如 `{ name: "李雷" }`
- 发送 Header，如 `Allow、Content-Type`

### 编写控制器最佳实践

- 每个资源的控制器放在不同的文件里
- 尽量使用类 + 类方法的形式编写控制器
- 严谨的错误处理

### 获取 HTTP 请求参数

#### 操作步骤

- 学习断点调试
- 获取 query 
- 获取 router params
- 获取 body
  - 需要安装 Koa 中间件 —— `koa-bodyparser`
- 获取 header 

### 发送 HTTP 响应

- 发送 status 
  - `ctx.status = 204;`
- 发送 body
  - `*ctx*.body = { name: '李雷' };`
- 发送 header
  -  `ctx.set('Allow', 'GET, POST');`
- 实现用户的增删改查

```js
// 内存数据库
const db = [{ name: "李雷" }];

usersRouter.get('/', (ctx) => {
    // 设置响应头
    // ctx.set('Allow', 'GET, POST');
    ctx.body = db;
});
// 2、新建用户
usersRouter.post('/', (ctx) => {
    // 从请求体中获取新增加的用户
    db.push(ctx.request.body);
    ctx.body = ctx.request.body;
});
// 3、获取用户
usersRouter.get('/:id', (ctx) => {
    // 字符串转数字
    ctx.body = db[ctx.params.id * 1];
});
// 4、修改用户
usersRouter.put('/:id', (ctx) => {
    db[ctx.params.id * 1] = ctx.request.body;
    ctx.body = ctx.request.body;
});
// 5、删除用户
usersRouter.delete('/:id', (ctx) => {
    // 删除数组中的内容
    db.splice(ctx.params.id * 1,1);
    // 删除成功，但是不返回内容
    ctx.status = 204;
});
```

## 更合理的目录结构

### 操作步骤

- 将路由单独放在一个目录里
- 将控制器单独放在一个目录
- 使用类 + 类方法的方式组织控制器

![1601979928824](assets/1601979928824.png)

路由批量导入并注册：

`./routes/index.js`

```js
// 批量读取目录下的文件，进行注册
const fs = require('fs');

module.exports = (app) => {
    // 同步读取目录
    fs.readdirSync(__dirname).forEach(file => {
        if (file === 'index.js') { return; }
        // 导入路由文件
        const route = require(`./${file}`);
        // 注册路由，并且支持响应 options 方法
        app.use(route.routes()).use(route.allowedMethods());
    })
}
```

`./index.js`

```js
const Koa = require('koa');
const bodyparser = require('koa-bodyparser');
const app = new Koa();
const routing = require('./routes');

// 注册请求体解析中间件
app.use(bodyparser());
// 批量读取注册路由
routing(app);

app.listen(3000, () => console.log('程序启动在 3000 端口'));
```

控制器与路由分离：(采用类写法)

`./controllers/home.js`

```JS
// ES6 类写法
class HomeCtl {
    index(ctx){
        ctx.body = '这是主页';
    }
}

// 实例化类并导出
module.exports = new HomeCtl();
```

`./routes/home.js`

```js
// 主页路由
const Router = require('koa-router');
const router = new Router();
const { index } = require('../controllers/home');

router.get('/', index);

module.exports = router;
```



## 错误处理（异常处理）

### 什么是错误处理？

- 编程语言或计算机硬件里的一种机制
- 处理软件或信息系统中出现的异常状况

### 异常状况

- 运行时错误，都返回 500
- 逻辑错误，如找不到（404）、先决条件失败（412）、无法处理的实体（参数格式不对，422）等
  - `404 Not Found`
  - `412 Precondition Failed`
  - `500 Internal Server Error`

### 为什么要用错误处理？

- 防止程序挂掉
- 告知用户错误信息
- 便于开发者调试

## Koa 自带的错误处理

### 操作步骤

- 制造 404、412、500 三种错误

  - 412 可以手动抛出

    ```js
    ctx.throw(412, '先决条件失败：id 大于等于数组长度了');
    ```

- 了解 Koa 自带的错误处理做了什么

## 自己编写错误处理中间件

### 操作步骤

- 自己编写错误处理中间件

- 制造 404、412、500 三种错误来测试

  ```js
  
  // 编写错误处理中间件
  app.use(async (ctx,next) => {
      try{
          await next();
      }catch(err){
          ctx.status = err.status || err.statusCode || 500;
          ctx.body = {
              message: err.message
          };
      }
  });
  ```

  

## 使用 koa-json-error 进行错误处理

### 操作步骤

- 安装 koa-json-error

- 使用 koa-json-error 的默认配置处理错误

- 修改配置使其在生成环境下禁用错误堆栈的返回

  - 开发环境下：

    ![1601990604299](assets/1601990604299.png)

  - 生产环境下：

    ![1601990636774](assets/1601990636774.png)

  - 通过修改配置：`postFormat`——定制返回格式

    ```js
    app.use(error({
        // 在生产环境禁用错误堆栈的返回
        // 获取环境变量 process.env.NODE_ENV
        // 第二个参数为返回的对象
        postFormat: (e, { stack, ...rest }) => process.env.NODE_ENV  === 'production' ? rest : { stack, ...rest }
    }));
    ```

  - cross-env：跨平台设置环境变量

  - `./package.json`

    ```json
    "scripts": {
        // linux 下可以直接配置环境变量
        //"start": "NODE_ENV=production node app"
        "start": "cross-env NODE_ENV=production node app",
        // 开发环境下
        "dev": "nodemon app"
     },
    ```

    

## 使用 koa-parameter 校验参数

### 操作步骤

- 安装 koa-parameter

- 使用 koa-parameter 校验参数

  `./index,js`

  ```js
  const paramter = require('koa-parameter');
  //...
  // 校验参数中间件（通常用于校验请求体)
  // 传入 app 可以作为去全局方法来使用
  app.use(paramter(app));
  ```

  `./controllers/users.js`

  ```js
  //...
  	created(ctx) {
          // type 数据类型 required 是否必需
          ctx.verifyParams({
              name: {type: 'string', required: true},
              age: {type:'number', required: false}
          });
          // 从请求体中获取新增加的用户
          db.push(ctx.request.body);
          ctx.body = ctx.request.body;
      }
  //...
  ```

  

- 制造 422 错误来测试校验结果

  - name 参数不为 `string`类型

     ![1601991936106](assets/1601991936106.png)

    返回错误：422

    ![1601991968993](assets/1601991968993.png)

  - 没有 name 参数

    ![1601992006701](assets/1601992006701.png)

  - age 参数不为 `number` 类型

    ![1601992068794](assets/1601992068794.png)

    ![1601992079275](assets/1601992079275.png)

## NoSQL 简介

### 什么是 NoSQL？

- 对不同于传统的关系型数据库的数据库管理系统的统称

### NoSQL 数据库的分类

- 列存储（HBase）
- 文档存储（MongoDB）
  - 按 JSON 存储，一个 JSON 就是一个文档，可以把文档想象成表格里的一行（如一个 name 为李雷的 JSON，就是用户数据集合其中一行 ，如果你要请求用户列表，那么就会返回一个数组，数组的每一项就是 JSON）
- Key-value 存储（Redis）
- 图存储（FlockDB）
- 对象存储（db4o）
- XML 存储（BaseX）

### 为什么要用 NoSQL？ 

- 简单（没有原子性、一致性、隔离性等复杂规范）
- 便于横向拓展
- 适合超大规模的数据存储
- 很灵活地存储复杂结构的数据（Schema Free）

注：**模式自由（Schema-free)**，所谓“面向集合”（Collection-Oriented），意思是数据被分组存储在数据集中，被称为一个集合（Collection)。每个集合在数据库中都有一个唯一的标识名，并且可以包含无限数目的文档。集合的概念类似关系型数据库（RDBMS）里的表（Table），不同的是它不需要定义任何模式（Schema)

## MongoDB 简介

### 什么是 MongoDB？

- 来自于英文单词 “Humongous”，中文含义为 “庞大”
- 面向文档存储的开源数据库
- 由 C++ 编写而成

### 为什么要用 MongoDB？

- 性能好（使用内存计算）
- 大规模数据存储（可拓展性）
- 可靠安全（本地复制、自动故障转移）
- 方便存储复杂数据结构（Schema Free）

### MongoDB 下載

- 官网下载
- 支持常见平台（Windows、Linux、OSX）

### 云 MongoDB

- 阿里云、腾讯云（收费）
- MongoDB 官方的 MongoDB Atlas（免费 + 收费）



## MongoDB Atlas（云数据库）

[MongoDB Atlas](https://cloud.mongodb.com/)

https://cloud.mongodb.com/v2/5f7f3c2010d7031e97352422#clusters

### 操作步骤

- 注册用户
- 创建集群
- 添加数据库用户
- 设置 IP 地址白名单
- 获取连接地址



## Mongoose 介绍

### 概述

Mongoose 是 NodeJS 的驱动，不能作为其他语言的驱动。Mongoose 有两个特点：

1、通过关系型数据库的思想来设计非关系型数据库

2、基于 mongodb 驱动，简化操作

![1602342031578](assets/1602342031578.png)

​		Mongooose中，有三个比较重要的概念，分别是 **Schema、Model、Documents**。它们的关系是：Schema 生成 Model，Model 创造 Document，Model 和 Document 都可对数据库操作造成影响，但 Model 比 Document 更具操作性。

​		**Scheme 用于定义数据库的结构**。类似创建表时的数据定义（不仅仅可以定义文档的结构和属性，还可以定义文档的实例方法、静态模型方法、复合索引等），每个 Schema 会映射到 mongodb 中的一个 collection，Schema 不具备操作数据库的能力。

​		**Model 是由 Schema 编译而成的构造器，具有抽象属性和行为，可以对数据库进行增删改查。**Model 的每一个实例（instance）就是一个文档 document。

​		**Document 是 Model 创建的实体，它的操作也会影响数据库。**

## 使用 Mongoose 连接 MongoDB

### 操作步骤

- 安装 Mongoose
- 用 Mongoose 连接 MongoDB

导入配置文件

`./config.js`

```js
module.exports = {
    connectionStr: `mongodb+srv://hins:${process.env.DB_PASS}@hins.naxyu.mongodb.net/<dbname>?retryWrites=true&w=majority`,
}
```

`./index.js`

```js
const { connectionStr } = require('./config');
// 连接 mongodb 
mongoose.connect(connectionStr,{ useNewUrlParser: true, useUnifiedTopology: true }, ()=>console.log('MongoDB 连接成功了!'));
mongoose.connection.on('error', console.error);
```



## 补：NPM库：dotenv，从文件加载环境变量

Node.js中的dotenv库的使用，由于项目不同需求，需要配置不同环境变量，按需加载不同的环境变量文件，使用dotenv，可以完美解决这一问题。

使用dotenv，只需要将程序的环境变量配置写在.env文件中。

### 一、.env的作用

`.env`文件是用来自定义配置的一个简单方法，可以将一些不能在代码中存储的敏感/账号数据从代码中剥离出来，作为环境变量存储在环境中。

### 二、.env的使用方法

`.env` 文件通常不包含在版本控制内，它可能包含敏感的 API Key 或者 密码。所有需要环境变量定义(不敏感的定义)的项目都需要创建一个`.env.example` 文件，这个环境变量包含他们自己定义的环境变量或者联合开发包含的环境变量。项目合作开发者可以独立的复制 `.env.example`并且重命名为`.env`，并且修改为正确的本地环境配置，存储密码key或者提供他们必要的值。 在这个使用方法中 `.env` 文件应该添加到`.gitignore`文件中并且永远不会被项目的合作者签入/签出。这个方法确保里边没有敏感的 API Key 或者 密码在版本控制中出现从而减少了安全风险，并且开发环境中的配置永远不会告知合作开发者。

### .env file

```undefined
DB_HOST=localhost
DB_USER=root
DB_PASS=s1mpl3
```

然后，在Node.js程序启动时运行：

```jsx
require('dotenv').config() // 默认读取项目根目录下的.env文件
```

接着，我们就可以在接下来的程序中方便地使用环境变量了：

```jsx
const db = require('db')
db.connect({
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASS
})
```

## Mongoose 中的 Schema

Schema 主要用于定义 MongoDB 中集合 Collection 里文档 document 的结构　　

定义 Schema 非常简单，指定字段名和类型即可，支持的类型包括以下8种

```
String      字符串
Number      数字    
Date        日期
Buffer      二进制
Boolean     布尔值
Mixed       混合类型
ObjectId    对象ID    
Array       数组
```

通过 mongoose.Schema 来调用 Schema ，然后使用 new 方法来创建 schema 对象

```js
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var mySchema = new Schema({
  title:  String,
  author: String,
  body:   String,
  comments: [{ body: String, date: Date }],
  date: { type: Date, default: Date.now },
  hidden: Boolean,
  meta: {
    votes: Number,
    favs:  Number
  }
});
```

- 注意：创建Schema对象时，声明字段类型有两种方法，一种是首字母大写的字段类型，另一种是引号包含的小写字段类型

```
var mySchema = new Schema({title:String, author:String});
//或者 
var mySchema = new Schema({title:'string', author:'string'});
```

`_id`：

　　每一个文档 document 都会被 mongoose 添加一个不重复的_id，_id 的数据类型不是字符串，而是 ObjectID 类型。如果在查询语句中要使用 _id，则需要使用 `findById` 语句，而不能使用 `find` 或 `findOne` 语句



## Mongoose 中的 Model

模型Model是根据 Schema 编译出的构造器，或者称为类，通过 Model 可以实例化出文档对象 document。

文档 document 的创建和检索都需要通过模型 Model 来处理。

```js
mongoose.model()
```

使用 model() 方法，将 Schema 编译为 Model。model() 方法的第一个参数是模型名称

- 注：Mongoose会将集合名称设置为模型名称的小写版

### 实例化文档document

通过对原型 Model1 使用new方法，实例化出文档 document 对象

```js
var mongoose = require('mongoose');
mongoose.connect("mongodb://u1:123456@localhost/db1", function(err) {
    if(err){
        console.log('连接失败');
    }else{
        console.log('连接成功');
        var schema = new mongoose.Schema({ num:Number, name: String, size: String});
        var MyModel = mongoose.model('MyModel', schema);
        var doc1 = new MyModel({ size: 'small' });
        console.log(doc1.size);//'small'
    }
});
```



## 设计用户模块的 Schema

### 操作步骤

- 分析用户模块的属性
- 编写用户模块的 Schema
- 使用 Schema 生成用户 Model

`./models/users.js`

```js
const mongoose = require('mongoose');

const { Schema, model } = mongoose;

// 生成文档 Schema，定义结构
const userSchema = new Schema({
    name: { type: String, required: true },
});

// 用户模型
module.exports = model('User', userSchema);
```

## 用 MongoDB 实现用户的增删改查

### 操作步骤

- 用 Mongoose 实现增删改查接口
- 用 Postman 测试接口

### 定义和添加模型

- 模型使用 `Schema` 接口进行定义。 `Schema` 可以定义每个文档中存储的字段，及字段的验证要求和默认值。

- `mongoose.model()` 方法将模式“编译”为模型。模型就可以用来查找、创建、更新和删除特定类型的对象。

 `./models/user.js`

```js
const mongoose = require('mongoose');

const { Schema, model } = mongoose;

// 生成文档 Schema，定义一个模式
const userSchema = new Schema({
    name: { type: String, required: true },
});

// 创建用户模型，使用模式“编译”模型
module.exports = model('User', userSchema);
```

### 增删改查

`./controllers/users.js`

- 

```js
// 用户模型
const User = require('../models/users');

class UsersCtl {
    // 1、获取用户列表
    async find(ctx) {
        ctx.body = await User.find();
    }
    // 2、获取
    async findById(ctx) {
        const user = await User.findById(ctx.params.id);
        if(!user) { ctx.throw(404, '用户不存在'); }
        ctx.body = user;
    }
    // 3、新建用户
    async created(ctx) {
        // type 数据类型 required 是否必需
        ctx.verifyParams({
            name: {type: 'string', required: true},
        });
        const user = await new User(ctx.request.body).save();
        ctx.body = user;
    }
    // 4、修改用户
    async updated(ctx) {
        ctx.verifyParams({
            name: {type: 'string', required: true},
        });
        const user = await User.findOneAndUpdate(ctx.params.id, ctx.request.body);
        if(!user) { ctx.throw(404, '用户不存在'); }
        ctx.body = user;
    }
    async delete(ctx) {
        const user = await User.findByIdAndRemove(ctx.params.id);
        if(!user) { ctx.throw(404, '用户不存在'); }
        // 删除成功，但是不返回内容
        ctx.status = 204;
    }
}
```



## Session 简介

Session 称为 ”会话控制“，在服务端生成的，存储在服务器端，即存在内存中。session 在Web开发环境下是指一类用来在客户端与服务器端之间保持状态的解决方案。

Session 是一种用户认证与授权的方式。

### 工作原理

![1602346451396](assets/1602346451396.png)

- 客户端发送 `POST` 请求并且携带用户名和密码给服务端；
- 服务端对用户名和密码进行核对，核对成功后，生成身份认证相关的 `session` 数据，然后保存在内存中或者内存数据库中，并通过响应头将 `cookie` 设置成 `SessionId` 返回给客户端；
- 客户端则会把该 `SessionId`  储存在 `cookie` 当中；
- 此后，客户端所有的请求都会携带值为 `SessionId`  的 `cookie`
- 服务器会通过该 `SessionId`来寻找`session` 数据并解析该数据，来判断用户是否登录以及用户的相关权限。 
- 注：前端如果想退出登录时，清除客户端本地 `cookie` 即可；后端想强制前端重新认证的话，在服务器直接清除 `session` 即可；

### Session 的优势

-  相比 JWT，最大的优势就在于可以主动清除 session 了
- session 保存在服务器端，相对较为安全
- 结合 cookie 使用，较为灵活，兼容性较好

### Session 的劣势

- cookie + session 在跨域场景表现并不好
- 如果是分布式部署，需要做多机共享 session 机制
- 基于 cookie 的机制很容易被 CSRF（跨站请求伪造攻击）
- 查询 session 信息可能会有数据库查询操作

### Session 相关的概念介绍

- session：主要存放服务器端，相对安全
- cookie：主要存放在客户端，并且不是很安全
- sessionStorage：仅在当前会话下有效，关闭页面或浏览器后被清除
- localStorage：除非被清除，否则永久保存（经常用来存储 JWT 生成的 Token）



## JWT 简介

### 什么是 JWT？

- JSON Web Token 是一个开发标准（RFC 7519）
- 定义了一种紧凑且独立的方式，可以将各方之间的信息作为 JSON 对象进行安全传输
- 该信息可以验证和信任，因为是经过数字签名的

### JWT 的构成

- 头部（Header）
- 有效载荷（Payload）
- 签名（Signature）

### JWT 的例子

```json
eyJhbGci0iJIUzI1NiIsInR5cCI6IkpXVCJ9.
eyJzdWIi0iIxMjMNTY30DkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaXNTb2NpYWwiOnRydWVg.
4pcPyMD89olPSyXnrXCjTwXyr4BsezdI1AVTmud2fU4
```

- 注：使用 base64 编码过

#### Header-头部

- typ：token 的类型，这里固定为 JWT
- alg：使用的 hash 算法，例如：HMAC SHA256 或者 RSA
- 编码前后
  - `{"alg":"HS256" , "typ":"JWT"}`
  - `'eyJhbGciOiAiSFMyNTYiLCAidHlwljogIkpXVCJ9'`

#### Payload-有效载荷

- 存储需要传递的信息，如用户 ID、用户名等
- 还包含元数据，如过期实践、发布人等
- 与 Header 不同，Payload 可以加密
- 编码前后（base64url 编码会忽略最后的等号）
  - `{"user_id":"zhangsan"}`
  - `'eyJ1c2VyX2lkIjoiemhhbmdzYW4ifQ=='`
  - `'eyJ1c2VyX2lkIjoiemhhbmdzYW4ifQ'`

### Signature-签名

- 对 Header 和 Payload 部分进行签名
- 保证 Token 在传输的过程中没有被篡改或者损坏
- **Signatrue 算法**
  - `Signature = HMACSHA256(base64UrlEncode(header) + "." + base64UrlEncode(payload),secret)`

### JWT 工作原理

![1602408446136](assets/1602408446136.png)

- 客户端发送 `POST` 请求并且携带用户名和密码给服务端；
- 服务端对用户名和密码进行核对，核对成功后，将用户 id 等其他用户信息作为 JWT 的**有效载荷 Payload**，将 其与头部进行 base64 编码后形成了一个 JWT，服务端将其作为登录成功请求的返回结果返回给客户端；
- 客户端则会把该 JWT 储存在 `LocalStorage`或者 `SessionStorage` 中；
- 此后，客户端所有的请求都会把 JWT 字符串（`Authorization: Bearer ...JWT...`）发送给服务器端；
- 服务器检查该其是否存在，如果存在则验证 JWT 字符串的有效性（例如：检查签名是否正确，令牌是否过期等），验证通过后，服务器则解析并使用 JWT 中包含的用户信息进行相应的逻辑处理，并且返回相应的结果。
- 注：一旦用户注销，令牌将在客户端被销毁，不需要与服务器进行交互，关键是令牌是无状态的。服务器不需要保存令牌或当前 session 的记录。

## JWT vs Session

### 可拓展性

### 安全性

## 在 Node.js 中使用 JWT

### 操作步骤

- 安装 jsonwebtoken
- 签名
- 验证

### 示例

```js
> jwt = require('jsonwebtoken');
{ decode: [Function],
  verify: [Function],
  sign: [Function],
  JsonWebTokenError: [Function: JsonWebTokenError],
  NotBeforeError: [Function: NotBeforeError],
  TokenExpiredError: [Function: TokenExpiredError] }
> token = jwt.sign({name: 'enoo'},'secret');
'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiZW5vbyIsImlhdCI6MTYwNDg1MjAxMH0.zIJ3Yb9UTPjMCWr0Xu6iRmaqOA6ZIZxVcUTNrouK7Wc'        
> jwt.decode(token);
{ name: 'enoo', iat: 1604852010 }
> jwt.verify(token,'secret');
{ name: 'enoo', iat: 1604852010 }
> jwt.verify(token,'secret1');	  // 密钥错误
Thrown:
{ JsonWebTokenError: invalid signature
    at E:\GitHub\ZhiHu-API\project\node_modules\jsonwebtoken\verify.js:133:19
    at getSecret (E:\GitHub\ZhiHu-API\project\node_modules\jsonwebtoken\verify.js:90:14)
    at Object.module.exports [as verify] (E:\GitHub\ZhiHu-API\project\node_modules\jsonwebtoken\verify.js:94:10) name: 'JsonWebTokenError', message: 'invalid signature' }
> jwt.verify(token.replace('e','a'),'secret1'); // token 不一致
Thrown:
{ JsonWebTokenError: invalid token
    at Object.module.exports [as verify] (E:\GitHub\ZhiHu-API\project\node_modules\jsonwebtoken\verify.js:75:17) name: 'JsonWebTokenError', message: 'invalid token' }
>
```

## 实现用户注册

### 操作步骤

- 设计用户 Schema

- 编写保证唯一性的逻辑

### 示例

`./models/users.js`

  ```js
// 生成文档 Schema，定义一个模式
const userSchema = new Schema({
    name: { type: String, required: true },
    password: {type: String, required: true, select: false},
});
  ```

- `select`：选择隐藏，在 `find` 查询时可以加上 `.select('+password')`

`./controllers/user.js`

```JS
// 创建用户，唯一性检验
const repeatedUser = await User.findOne({name});
// 409，冲突
if(repeatedUser) { ctx.throw(409, '用户已经存在'); } 
```

- `findOne`：查询到第一个就返回

## 实现登录并获取 Token

### 操作步骤

- 登录接口设计
- 用 jsonwebtoken 生成 token

### 示例

`./routes/user.js`

```js
// 6、用户登录
router.post('/login',login);
```

`./controllers/users.js`

```js
const jsonwebtoken = require('jsonwebtoken');
const { secret } = require('../config');        // 引入 token 密钥
// ............
async login(ctx){
    ctx.verifyParams({
        name: { type: 'string', required: true },
        password: { type: 'string', required: true }
    });
    // 校验用户名密码
    const user = await User.findOne(ctx.request.body);
    if (!user) { ctx.throw(401, '用户名或密码不正确'); }
    // 生成 token
    const { _id, name } = user;
    const token = jsonwebtoken.sign({ _id, name }, secret, { expiresIn: '1d' });
    ctx.body = { token };
}
```

## 编写 koa 中间件实现用户认证与授权

### 操作步骤

- 认证：验证 token，并获取用户信息（auth 中间件）
  - 客户端将 token 写在请求头中，格式：
    - `{ Authorization: Bearer token}` 
- 授权：使用中间件保护接口  

### 示例

`./routes/users.js`

```js
// 认证中间件
const auth = async (ctx, next) => {
    // header 把请求头都改变为小写，当没有 token 请求头，则默认为空，反正报错
    const { authorization = '' } = ctx.request.header;
    // { Authorization: Bearer token}
    const token = authorization.replace('Bearer ','');
    try{
        // 报错：token 被篡改或者为空，属于 401 错误：未认证错误。
        const user = jsonwebtoken.verify(token, secret);
        // 用于存储用户信息
        ctx.state.user =  user;
    }catch(err){
        ctx.throw(401, err.message);
    }
    // 执行后续中间件
    await next();
}

//.....

// 4、修改用户，需认证（auth）—> 授权（checkOwner）
router.patch('/:id', auth, checkOwner,updated);
// 5、删除用户，需认证（auth）—> 授权（checkOwner）
router.delete('/:id', auth, checkOwner, del);
```

`./controllers/users.js`

```js
// 授权
async checkOwner(ctx, next){
    // 用户只能删除自己
    // 403 Forbidden，没有权限访问
    if(ctx.params.id !== ctx.state.user._id){
        ctx.throw( ctx.throw(403, '没有权限'));
    }
    await next();
}
```

## 用 koa-jwt 中间件实现用户认证与授权

### 操作步骤

- 安装 koa-jwt
- 使用中间件保护接口
- 使用中间件获取用户信息

## 上传图片需求分析

### 上传图片需求场景

- 用户头像
- 封面图片
- 问题和回答中的图片
- 话题图片

### 上传图片的功能点

- 基础功能：上传图片、生成图片链接
- 附加功能：限制上传图片的大小与类型、生成高中低三种分辨率的图片链接、生成 CDN

### 上传图片的技术方案

- 阿里云 OSS 等云服务，推荐在生产环境下使用
- 直接上传到服务器，不推荐在生产环境下中使用
- 免费七牛云

## 使用 koa-body 中间件获取上传的文件

### 操作步骤

- 安装 `koa-body`，替换 `koa-bodyparser`
  - `koa-boydparser` 只支持 JSON 和 form 两种格式的请求体，不支持文件格式
- 设置图片上传目录
- 使用 Postman 上传文件

### 示例

`./index.js` 注册解析中间件——`koaBody`

```js
const koaBody = require('koa-body');
const path = require('path');

// ....

// 注册请求体解析中间件——koaBody
app.use(koaBody({
    multipart: true,    // 启用文件格式
    formidable: {
        // __dirname 当前目录下
        uploadDir: path.join(__dirname, '/public/uploads'), // 文件上传路径
        keepExtensions: true,   // 保留扩展名
    }
}));
```

`./controllers/home.js` `upload` 方法

```js
upload(ctx) {
    const file = ctx.request.files.file;
    ctx.body = { path: file.path };
}
```

`./routes/home.js`

```js
router.post('/upload', upload);
```

## 使用 koa-static 中间件生产图片链接

### 操作步骤

- 安装 koa-static
- 设置静态文件目录
- 生成图片链接

### 示例

`./index.js` koa-static 的引入及配置使用

```js
const koaStatic = require('koa-static');
// ......
// koa-static 静态资源管理
app.use(koaStatic(path.join(__dirname, 'public')));
```

`./controllers/home.js`

```js
const path = require('path');
class HomeCtl {
    index(ctx) {
        ctx.body = '这是主页';
    }
    upload(ctx) {
        const file = ctx.request.files.file;
        // 使用 path.basename 方法返回最后一部分的文件名及拓展名
        const basename = path.basename(file.path);
        ctx.body = { url: `${ctx.origin}/uploads/${basename}` };
    }
}
```



## 编写前端页面上传文件

### 操作步骤

- 编写上传文件的前端页面
- 与后端接口联调测试  

### 示例

```js
<form action="/upload" enctype="multipart/form-data" method="POST">
   <input type="file" name="file" accept="image/*">
   <button type="submit">上传</button>
</form>
```

## 个人资料需求分析

### 个人资料功能点

- 不同类型（如字符串、数组）的属性
- 字段过滤

## 个人资料的 schema 设计

### 操作步骤

- 分析个人资料的数据结构
- 设计个人资料的 schema

### 示例

`./models/users.js`

```js
// 生成文档 Schema，定义一个模式
const userSchema = new Schema({
    __v: {type: Number, select: false},
    name: { type: String, required: true },
    password: {type: String, required: true, select: false},
    // 用户头像
    avatar_url: { type: String },
    // enum 描述可枚举，从指定字段中返回
    gender: { type: String, enum: ['male', 'famale'], default: 'male', required: true },
    // 一句话介绍
    headline: { type: String },
    // 居住地，数组
    location: { type: [{ type: String }] },
    // 行业
    business: { type: String },
    // 职业经历，多个对象字段
    employments: { 
        type: [{
            company: { type: String },
            job: { type: String },
        }],
    },
    // 教育经历
    educations: {
        type: [{
            school: { type: String },
            major: { type: String },
            diploma: { type: Number, enum: [1, 2, 3, 4, 5] },       // 学历
            entrance_year: { type: Number }, // 入学年份
            graduation_year: { type: Number }, // 毕业年份
        }]
    }
});
```

## 个人资料的参数校验

### 操作步骤

- 分析个人资料的数据结构
- 编写代码校验个人资料参数（更新接口）
- 使用 Postman 测试

### 示例

`./controllers/users.js`

```js
// 4、修改用户
async updated(ctx) {
    ctx.verifyParams({
        name: {type: 'string', required: false },
        password: { type: 'string', required: false },
        avatar_url: { type: 'string', required: false },
        gender: { type: 'string', required: false },
        headline: { type: 'string', required: false },
        // itemType 表示数组中的类型，注意区别于 mongoose 的写法
        locations: { type: 'array', itemType: 'string', required: false },
        business: { type: 'string', required: false }, // 行业
        employment: { type: 'array', itemType: 'object', required: false }, 
        educations: { type: 'array', itemType: 'object', required: false }, 

    });
    const user = await User.findByIdAndUpdate( ctx.params.id, ctx.request.body);
    // console.log(ctx.params, user);
    if(!user) { ctx.throw(404, '用户不存在'); }
    ctx.body = user;
}
```

## 字段过滤——Restful API 最佳实践

### 操作步骤

- 设计 schema 默认隐藏部分字段
- 通过查询字符串显示隐藏字段（`fields`
- 使用 Postman 测试

### 示例

`./models/users.js` 设计 schema 默认隐藏部分字段

```js
// 生成文档 Schema，定义一个模式
const userSchema = new Schema({
    __v: {type: Number, select: false},
    name: { type: String, required: true },
    password: {type: String, required: true, select: false},
    // 用户头像
    avatar_url: { type: String },
    // enum 描述可枚举，从指定字段中返回
    gender: { type: String, enum: ['male', 'famale'], default: 'male', required: true },
    // 一句话介绍
    headline: { type: String },
    // 居住地，数组
    locations: { type: [{ type: String }], select: false},
    // 行业
    business: { type: String, select: false },
    // 职业经历，多个对象字段
    employments: { 
        type: [{
            company: { type: String },
            job: { type: String },
        }],
        select: false
    },
    // 教育经历
    educations: {
        type: [{
            school: { type: String },
            major: { type: String },
            diploma: { type: Number, enum: [1, 2, 3, 4, 5] },       // 学历
            entrance_year: { type: Number }, // 入学年份
            graduation_year: { type: Number }, // 毕业年份
        }],
        select: false
    }
});
```

`./controllers/users.js` 通过查询字符串（fields）显示隐藏字段

```js
// 2、获取
async findById(ctx) {
    // 获取查询字符串种的字段
    const { fields } = ctx.query;
    // split 分隔为数组  filter 过滤不存在的字段 map 对数组进行遍历 join 拼接成字符串
    const selectFields = fields.split(';').filter(f => f).map(f => ' +' + f).join('');
    // console.log(fields, selectFields);
    const user = await User.findById(ctx.params.id).select(selectFields);
    if(!user) { ctx.throw(404, '用户不存在'); }
    ctx.body = user;
}
```

## 关注与粉丝需求分析

### 细化关注与粉丝功能点

- 关注、取消关注 
- 获取关注人、粉丝列表（用户-用户多对多关系）

## 关注与粉丝的 schema 设计

### 操作步骤

- 分析关注与粉丝的数据结构
- 设计关注与粉丝 schema  

### 示例

`./models/users.js`

```js
// 关注列表
following: {
    // 存储用户 id，使用 mongoose 提供的特殊类型
    // Schema.Types.ObjectId ,  
    // ref：引用的简写，将 ObjectId 与 schema 关联起来
    // 关联着 User 中的 id -> User id
    type: [{ type: Schema.Types.ObjectId, ref: 'User'}],
    select: false,
}
```

## 关注与粉丝接口——RESTful 风格

### 操作步骤

- 实现获取关注者 和粉丝列表接口
- 实现关注和取消关注接口
- 使用 Postman 测试

### 示例

`./controllers/users.js`

```js
// 7. 获取关注者接口
async listFollowing(ctx) {
    // 获取关注者的具体信息，通过 populate 获取关联 Schema 的 ObjectId 的信息
    const user = await User.findById(ctx.params.id).select('+following').populate('following');
    if (!user) { ctx.throw(404); }
    ctx.body = user.following; 
}
// 8、获取粉丝列表接口
async listFollowers(ctx) {
    // 查询用户列表中的关注列表，包含查询用户的 id，即为用户的粉丝
    const user = await User.find( { following: ctx.params.id });
    ctx.body = user;
}
// 9、关注
async follow(ctx) {
    const me = await User.findById(ctx.state.user._id).select('+following');
    // 不可关注自己
    if (ctx.params.id == ctx.state.user._id) { return }
    // 判断是否已经关注,
    // 将关注列表的 id 转为字符串（原本为 mongoose 自带的特殊类型）    
    if (!me.following.map(id => id.toString()).includes(ctx.params.id)) {
        // 未关注
        me.following.push(ctx.params.id);
        // 保存到数据库
        me.save();
    }
    // 成功状态，但是不返回内容
    ctx.status = 204;
}
// 10、取关
async unfollow(ctx) {
    const me = await User.findById(ctx.state.user._id).select('+following');
    // 获取取消关注的人在关注列表中的索引
    const index = me.following.map(id => id.toString()).indexOf(ctx.params.id);
    if (index > -1) {
        // 移除指定的参数
        me.following.splice(index, 1);
        me.save();
    }
    ctx.status = 204;
}
```

`./routes/users.js`

```js
// 7、用户关注者列表，嵌套关系
router.get('/:id/following', listFollowing);
// 8、用户粉丝列表，嵌套关系
router.get('/:id/followers', listFollowers);
// 9、关注
router.put('/following/:id', auth, follow);
// 10、取关
router.delete('/following/:id', auth, unfollow);
```

## 编写校验用户存在与否的中间件

### 操作步骤

- 编写校验用户存在与否的中间件
- 使用 Postman 测试‘

### 示例

`./controllers/users.js`

```js
 // 检查用户存在与否 中间件
async checkUserExist(ctx, next) {
    const user = await User.findById(ctx.params.id);
    if (!user) { ctx.throw(404, '用户不存在'); }
    // 执行后续中间件
    await next();
}
```

## 话题模块需求分析

#### 话题模块功能点

- 话题的增改查
- 分页、模糊搜索
- 用户属性中的话题引用
- 关注 / 取消关注话题、用户关注的话题列表

## 话题增改查接口——RESTful 风格

### 操作步骤

- 设计 Schema
- 实现 RESTful 风格的增改查接口

- 使用 Postman 测试

### 示例

`./models/topics.js`

```js
const mongoose = require('mongoose');

const { Schema, model } = mongoose;

// 生成文档 Schema，定义一个模式
const topicSchema = new Schema({
    __v: { type: Number, select: false },
    name: { type: String, required: true },
    avatar_url: { type: String },
    // 获取话题简介
    introduction: { type: String, select: false },
});

// 创建用户模型，使用模式“编译”模型
module.exports = model('Topic', topicSchema);
```

`./controllers/topics.js`

```js
const Topic = require('../models/topics');        // 话题模型

class TopicCtl {
    async find(ctx) {
        ctx.body = await Topic.find();
    }
    async findById(ctx) {
        // 默认值为空字符串
        const { fields = '' } = ctx.query;
        const selectFields = fields.split(';').filter(f => f).map(f => ' +' + f).join('');
        const topic = await Topic.findById(ctx.params.id).select(selectFields);
        ctx.body = topic;
    }
    async create(ctx) {
        ctx.verifyParams({
            name: { type: 'string', required: true },
            avatar_url: { type: 'string', required: false },
            introduction: { type: 'string', required: false },
        });
        const topic = await new Topic(ctx.request.body).save();
        ctx.body = topic;
    }
    async update(ctx) {
        ctx.verifyParams({
            name: { type: 'string', required: false },
            avatar_url: { type: 'string', required: false },
            introduction: { type: 'string', required: false },
        });
        // 返回的是更新前的数据
        const topic = await Topic.findByIdAndUpdate(ctx.params.id, ctx.request.body);
        ctx.body = topic;
    }
}

module.exports = new TopicCtl;
```

`./routes/topics.js`

```js
const jwt = require('koa-jwt');
// 用户路由
const Router = require('koa-router');
// 前缀写法
const router = new Router({prefix: '/topics'});
const { find, findById, create, update } = require('../controllers/topics');

const { secret } = require('../config');

// 认证中间件
const auth = jwt({ secret });

router.get('/', find);
router.post('/', auth,create);
router.get('/:id', findById);
router.patch('/:id', auth,update);

module.exports = router;
```

## 分页——RESTful API 最佳实践

### 操作步骤

- 实现分页逻辑
- 使用 Postman 测试

### 示例

`./controllers/topics.js` 获取话题列表分页功能

```js
async find(ctx) {
    // 若无指定数量，默认 perPage 为 10
    const { per_page = 3 } = ctx.query;
    // 确保最低为 0，防止传入 -1 0
    const page = Math.max(ctx.query.page * 1, 1) - 1;
    // 确保最低为 1，防止传入 -1 0
    const perPage = Math.max(per_page * 1, 1);
    // limit 返回x项，skip 跳过几项开始返回
    ctx.body = await Topic.find().limit(perPage).skip(page * perPage);
}
```

`./controllers/user.js`获取用户列表分页功能，同理如上

## 模糊搜索——RESTful API 最佳实践

### 操作步骤

- 实现模糊搜索逻辑
- 使用 Postman 测试逻辑

### 示例

`./controllers/topics.js`

```js
// ...
    // 模糊搜索：使用正则表达式匹配
    ctx.body = await Topic
        .find({ name: new RegExp(ctx.query.q) })
        .limit(perPage).skip(page * perPage);
```

## 用户属性中的话题引用

### 操作步骤

- 使用话题引用替代部分用户属性

### 示例

`./models/users.js` 设置用户模型关联话题

```js
// ... 
locations: { type: [{ type: Schema.Types.ObjectId, ref: 'Topic' }], select: false},
    // 行业
    business: { type: Schema.Types.ObjectId, ref: 'Topic', select: false },
    // 职业经历，多个对象字段
    employments: { 
        type: [{
            company: { type: Schema.Types.ObjectId, ref: 'Topic' },
            job: { type: Schema.Types.ObjectId, ref: 'Topic' },
        }],
        select: false
    },
    // 教育经历
    educations: {
        type: [{
            school: { type: Schema.Types.ObjectId, ref: 'Topic' },
            major: { type: Schema.Types.ObjectId, ref: 'Topic' },
            diploma: { type: Number, enum: [1, 2, 3, 4, 5] },       // 学历
            entrance_year: { type: Number }, // 入学年份
            graduation_year: { type: Number }, // 毕业年份
        }],
        select: false
    },
    // 关注列表
    following: {
        // 存储用户 id，使用 mongoose 提供的特殊类型
        // Schema.Types.ObjectId ,  
        // ref：引用的简写，将 ObjectId 与 schema 关联起来
        // 关联着 User 中的 id -> User id
        type: [{ type: Schema.Types.ObjectId, ref: 'User'}],
        select: false,
    }
// ...
```

`./controllers/users.js` 设置查询时关联字段

```js
// 2、获取用户列表
    async findById(ctx) {
        // 获取查询字符串种的字段
        const { fields = '' } = ctx.query;
        // split 分隔为数组  filter 过滤不存在的字段 map 对数组进行遍历 join 拼接成字符串
        const selectFields = fields.split(';').filter(f => f).map(f => ' +' + f).join('');
        // populate 也需要动态获取，否则无法隐藏
        const populateStr = fields.split(';').filter(f => f).map(f => {
            if (f === 'employments') {
                return 'employments.company employments.job';
            }
            if (f === 'educations') {
                return 'educations.school educations.major';
            }
            return f;
        }).join(' ');
        // console.log(fields, selectFields);
        const user = await User
            .findById(ctx.params.id)
            .select(selectFields)
            .populate(populateStr);
        if (!user) { ctx.throw(404, '用户不存在'); }
        ctx.body = user;
    }
```

## 关注话题接口——RESTful API 风格的关注接口

### 操作步骤

- 实现关注话题逻辑（用户-话题多对多关系）
- 使用 Postman 测试

### 示例

`./controllers/users.js`

```js
	// 11、获取关注的话题
    async listFollowingTopics(ctx) {
        const user = await User.findById(ctx.params.id).select('+followingTopics').populate('followingTopics');
        if (!user) { ctx.throw(404, '用户不存在'); }
        ctx.body = user.followingTopics;
    }
    // 12、关注话题
    async followTopic(ctx) {
        const me = await User.findById(ctx.state.user._id).select('+followingTopics');
        if (!me.followingTopics.map(id => id.toString()).includes(ctx.params.id)) {
            me.followingTopics.push(ctx.params.id);
            me.save();
        }
        ctx.status = 204;
    }
    // 13、取关话题
    async unfollowTopic(ctx) {
        const me = await User.findById(ctx.state.user._id).select('+followingTopics');
        const index = me.followingTopics.map(id => id.toString()).indexOf(ctx.params.id);
        if (index > -1) {
            me.followingTopics.splice(index, 1);
            me.save();
        }
        ctx.status = 204;
    }
```

`./controllers/topics.js` 话题存在检验中间件

```js
	// 检查话题是否存在 中间件
    async checkTopicExist(ctx, next) {
        const topic = await Topic.findById(ctx.params.id);
        if (!topic) { ctx.throw(404, '用户不存在'); }
        // 执行后续中间件
        await next();
    }
    // 获取话题粉丝列表接口
    async listTopicFollowers(ctx) {
        const user = await User.find({ followingTopics: ctx.params.id });
        ctx.body = user;
    }
```

`./routes/users.js`

```js
// 11、用户关注者列表，嵌套关系
router.get('/:id/followingTopics', listFollowingTopics);
// 12、关注话题
router.put('/followingTopic/:id', auth, checkTopicExist, followTopic);
// 13、取关话题
router.delete('/followingTopic/:id', auth, checkTopicExist, unfollowTopic);
```

## 问题模块需求分析

### 问题模块功能点

- 问题的增删改查
- 用户的问题列表（用户-问题一对多关系）
- 话题的问题列表 +  问题的话题列表（话题-问题多对多关系）
- 关注/取消关注问题

## 用户-问题一对多关系设计与实现

### 操作步骤

- 实现增删改查接口
- 实现用户的问题列表接口

### 示例

`./models/questions.js`

```js
const mongoose = require('mongoose');

const { Schema, model } = mongoose;

// 生成文档 Schema，定义一个模式
const questionsSchema = new Schema({
    __v: { type: Number, select: false },
    title: { type: String, required: true },
    description: { type: String },
    questioner: { type: Schema.Types.ObjectId, ref: 'User', required: true, select: false },
});

// 使用模式“编译”模型
module.exports = model('Question', questionsSchema);
```

`./controllers/questions.js`

```js
const Question = require('../models/questions'); 

class QuestionCtl {
    async find(ctx) {
        // 若无指定数量，默认 perPage 为 10
        const { per_page = 10 } = ctx.query;
        // 确保最低为 0，防止传入 -1 0
        const page = Math.max(ctx.query.page * 1, 1) - 1;
        // 确保最低为 1，防止传入 -1 0
        const perPage = Math.max(per_page * 1, 1);
        const q = new RegExp(ctx.query.q);
        // $or 匹配任意一项都能命中，匹配标题或者描述
        ctx.body = await Question
            .find({ $or: [ { title: q }, { description: q } ] })
            .limit(perPage).skip(page * perPage);
    }
    // 检查问题是否存在 中间件
    async checkQuestionExist(ctx, next) {
        const question = await Question.findById(ctx.params.id).select('+questioner');
        if (!question) { ctx.throw(404, '问题不存在'); }
        // 存储问题，减少重复查询
        ctx.state.question = question;
        // 执行后续中间件
        await next();
    }
    async findById(ctx) {
        // 默认值为空字符串
        const { fields = '' } = ctx.query;
        const selectFields = fields.split(';').filter(f => f).map(f => ' +' + f).join('');
        const question = await Question.findById(ctx.params.id).select(selectFields).populate('questioner');
        ctx.body = question;
    }
    async create(ctx) {
        ctx.verifyParams({
            title: { type: 'string', required: true },
            description: { type: 'string', required: false },
        });
        const question = await new Question({ ...ctx.request.body, questioner: ctx.state.user._id }).save();
        ctx.body = question;
    }
    async checkQuestioner(ctx, next) {
        const { question } = ctx.state;
        if (question.questioner.toString() !== ctx.state.user._id ) {
            ctx.throw(403, '没有权限');
        }
        await next();
    }
    async update(ctx) {
        ctx.verifyParams({
            title: { type: 'string', required: false },
            description: { type: 'string', required: false },
        });
        // 返回的是更新前的数据
        await ctx.state.question.updateOne(ctx.request.body);
        ctx.body = ctx.state.question;
    }
    async delete(ctx) {
        await Question.findByIdAndRemove(ctx.params.id);
        ctx.status = 204;
    }
}

module.exports = new QuestionCtl;
```

`./controllers/users.js`

```js
	// 14. 列出问题
    async listQuestions(ctx) {
        const questions = await Question.find({ questioner: ctx.params.id });
        ctx.body = questions;
    }
```

`./routes/questions.js`

```js
const jwt = require('koa-jwt');
// 用户路由
const Router = require('koa-router');
// 前缀写法
const router = new Router({prefix: '/questions'});
const { find, findById, create, update, delete: del , checkQuestionExist, checkQuestioner } = require('../controllers/questions');

const { secret } = require('../config');

// 认证中间件
const auth = jwt({ secret });

router.get('/', find);
router.post('/', auth, create);
// 有 id 的需检查是是否存在
router.get('/:id', checkQuestionExist,findById);
router.patch('/:id', auth, checkQuestionExist, checkQuestioner,update);
router.delete('/:id', auth, checkQuestionExist, checkQuestioner, del);

module.exports = router;
```

## 话题-问题多对多关系设计与实现

### 操作步骤

- 实现问题的话题列表接口
- 实现话题的问题列表的接口

### 示例

`./models/questions.js` 新增话题字段，关联话题 id，形成话题-问题多对多

```js
/ 生成文档 Schema，定义一个模式
const questionsSchema = new Schema({
    __v: { type: Number, select: false },
    title: { type: String, required: true },
    description: { type: String },
    questioner: { type: Schema.Types.ObjectId, ref: 'User', required: true, select: false },
    // 新增
    topics: {
        type: [{ type: Schema.Types.ObjectId, ref: 'Topic' }],
        select: false,
    }
});
```

`./controllers/topics.js`

```js
// 获取话题的问题列表
async listQuestions(ctx) {
    const questions = await Question.find({ topics: ctx.params.id });
    ctx.body = questions;
}
```

`./routes/topics.js`

```js
router.get('/:id/questions', checkTopicExist, listQuestions);
```

## 答案模块需求分析

- 答案的增删改查
- 问题-答案/用户-答案一对多
- 赞/踩答案
- 收藏答案

## 问题-答案模块二级嵌套的增删改查接口

### 操作步骤

- 设计数据库 Schema（重点在于一对多关系的设计）
- 实现增删改查接口
- 测试

### 示例

`./models/answers.js` 答案 schema 设计

```js
// 生成文档 Schema，定义一个模式
const answerSchema = new Schema({
    __v: { type: Number, select: false },
    content: { type: String, required: true },    // 内容
    answerer: { type: Schema.Types.ObjectId, ref: 'User', required: true, select: false },  // 回答者
    questionId: { type: String, required: true }, // 从属问题 id
});
```

`./controllers/answers.js` 控制器

```js
const Answer = require('../models/answers'); 

class AnswerCtl {
    async find(ctx) {
        // 若无指定数量，默认 perPage 为 10
        const { per_page = 10 } = ctx.query;
        // 确保最低为 0，防止传入 -1 0
        const page = Math.max(ctx.query.page * 1, 1) - 1;
        // 确保最低为 1，防止传入 -1 0
        const perPage = Math.max(per_page * 1, 1);
        const q = new RegExp(ctx.query.q);
        // 查询内容是否符合某个关键字，并且精确匹配 questionId
        ctx.body = await Answer
            .find({ content: q, questionId: ctx.params.questionId })
            .limit(perPage).skip(page * perPage);
    }
    // 检查问题是否存在 中间件
    async checkAnswerExist(ctx, next) {
        const answer = await Answer.findById(ctx.params.id).select('+answerer');
        if (!answer) { ctx.throw(404, '答案不存在'); }
        if (answer.questionId !== ctx.params.questionId) {
            ctx.throw(404, '该问题下没有此答案');
        }
        // 存储问题，减少重复查询
        ctx.state.answer = answer;
        // 执行后续中间件
        await next();
    }
    async findById(ctx) {
        // 默认值为空字符串
        const { fields = '' } = ctx.query;
        const selectFields = fields.split(';').filter(f => f).map(f => ' +' + f).join('');
        const answer = await Answer.findById(ctx.params.id).select(selectFields).populate('answerer');
        ctx.body = answer;
    }
    async create(ctx) {
        ctx.verifyParams({
            content: { type: 'string', required: true },
        });
        const answerer = ctx.state.user._id;
        const { questionId } = ctx.params;
        const answer = await new Answer({ ...ctx.request.body, answerer, questionId }).save();
        ctx.body = answer;
    }
    async checkAnswerer(ctx, next) {
        const { answer } = ctx.state;
        if (answer.answerer.toString() !== ctx.state.user._id ) {
            ctx.throw(403, '没有权限');
        }
        await next();
    }
    async update(ctx) {
        ctx.verifyParams({
            content: { type: 'string', required: false },
        });
        // 返回的是更新前的数据
        await ctx.state.answer.updateOne(ctx.request.body);
        ctx.body = ctx.state.answer;
    }
    async delete(ctx) {
        await Answer.findByIdAndRemove(ctx.params.id);
        ctx.status = 204;
    }
}

module.exports = new AnswerCtl;
```

`./routes/answers.js`

```js
const jwt = require('koa-jwt');
// 用户路由
const Router = require('koa-router');
// 前缀写法
const router = new Router({prefix: '/questions/:questionId/answers'});
const { find, findById, create, update, delete: del , checkAnswerExist, checkAnswerer } = require('../controllers/answers');

const { secret } = require('../config');

// 认证中间件
const auth = jwt({ secret });

router.get('/', find);
router.post('/', auth, create);
// 有 id 的需检查是是否存在
router.get('/:id', checkAnswerExist,findById);
router.patch('/:id', auth, checkAnswerExist, checkAnswerer,update);
router.delete('/:id', auth, checkAnswerExist, checkAnswerer, del);

module.exports = router;
```

## 互斥关系的赞/踩答案接口设计与实现

### 操作步骤

- 设计数据库 Schema
- 实现接口

### 示例

`./models/users.js` 新增 users  Schema 字段

```js
// ...
	// 赞列表
    likingAnswers: {
        type: [{ type: Schema.Types.ObjectId, ref: 'Answer' }],
        select: false,
    },
    // 踩列表
    dislikingAnswers: {
        type: [{ type: Schema.Types.ObjectId, ref: 'Answer' }],
        select: false,
    },
// ...
```

`./controllers/user.js` 编写控制器

```js
    // 15、赞答案列表
    async listLikingAnswers(ctx) {
        const user = await User.findById(ctx.params.id).select('+likingAnswers').populate('likingAnswers');
        if (!user) { ctx.throw(404, '用户不存在'); }
        ctx.body = user.likingAnswers;
    }
    // 16、点赞答案
    async likeAnswer(ctx, next) {
        const me = await User.findById(ctx.state.user._id).select('+likingAnswers');
        // 防止重复
        if (!me.likingAnswers.map(id => id.toString()).includes(ctx.params.id)) {
            me.likingAnswers.push(ctx.params.id);
            me.save();
            // 操作符 inc：用于增加减少删除
            await Answer.findByIdAndUpdate(ctx.params.id, { $inc: { voteCount: 1 }});
        }
        ctx.status = 204;
        await next();
    }
    // 17、取消赞某个答案
    async unlikeAnswer(ctx) {
        const me = await User.findById(ctx.state.user._id).select('+likingAnswers');
        // 获取答案在列表中的索引
        const index = me.likingAnswers.map(id => id.toString()).indexOf(ctx.params.id);
        // 判断是否存在
        if (index > -1) {
            me.likingAnswers.splice(index, 1);
            me.save();
            await Answer.findByIdAndUpdate(ctx.params.id, { $inc: { voteCount: -1 }});
        }
        ctx.status = 204;
    }
    // 18、踩答案列表
    async listDislikingAnswers(ctx) {
        const user = await User.findById(ctx.params.id).select('+dislikingAnswers').populate('dislikingAnswers');
        if (!user) { ctx.throw(404, '用户不存在'); }
        ctx.body = user.dislikingAnswers;
    }
    // 19、踩答案
    async dislikeAnswer(ctx, next) {
        const me = await User.findById(ctx.state.user._id).select('+dislikingAnswers');
        // 防止重复
        if (!me.dislikingAnswers.map(id => id.toString()).includes(ctx.params.id)) {
            me.dislikingAnswers.push(ctx.params.id);
            me.save();
        }
        ctx.status = 204;
        await next();
    }
    // 20、取消踩某个答案
    async undislikeAnswer(ctx) {
        const me = await User.findById(ctx.state.user._id).select('+dislikingAnswers');
        // 获取答案在列表中的索引
        const index = me.dislikingAnswers.map(id => id.toString()).indexOf(ctx.params.id);
        // 判断是否存在
        if (index > -1) {
            me.dislikingAnswers.splice(index, 1);
            me.save();
        }
        ctx.status = 204;
    }
```

`./routes/users.js`

```js
// 赞  两者互斥，作为中间件时，需要执行 next
router.get('/:id/likingAnswers', listLikingAnswers);
router.put('/likingAnswers/:id', auth, checkAnswerExist, likeAnswer, undislikeAnswer);
router.delete('/likingAnswers/:id', auth, checkAnswerExist, unlikeAnswer);
// 踩
router.get('/:id/dislikingAnswers', listDislikingAnswers);
router.put('/dislikingAnswers/:id', auth, checkAnswerExist,  dislikeAnswer, unlikeAnswer);
router.delete('/dislikingAnswers/:id', auth, checkAnswerExist, undislikeAnswer);
```

`./controllers/answers.js` 修改答案检查中间件

```js
	// 检查答案是否存在 中间件
    async checkAnswerExist(ctx, next) {
        const answer = await Answer.findById(ctx.params.id).select('+answerer');
        if (!answer) { ctx.throw(404, '答案不存在'); }
        // 只有在删改查时候才检查此逻辑，赞和踩答案的时候不检查
        if (ctx.params.questionId && answer.questionId !== ctx.params.questionId) {
            ctx.throw(404, '该问题下没有此答案');
        }
        // 存储问题，减少重复查询
        ctx.state.answer = answer;
        // 执行后续中间件
        await next();
    }
```

## RESTful 风格的收藏答案接口

### 操作步骤

- 设计数据库 Schema
- 实现接口

### 示例（类似于赞/踩接口）

## 评论模块需求分析

### 评论模块功能点

- 评论的增删改查
- 答案-评论/问题-评论/用户-评论一对多关系
- 一级评论与二级评论
- 赞/踩评论

## 问题-答案-评论模块三级嵌套的增删改查接口



# 项目问题解决

## findOneAndUpdate() 问题

```js
(node:12668) DeprecationWarning: Mongoose: `findOneAndUpdate()` and `findOneAndDelete()` without the `useFindAndModify` option set to 
false are deprecated. See: https://mongoosejs.com/docs/deprecations.html#findandmodify
```

- **警告：**Mongoose:不推荐使用未将“useFindAndModify”选项设置为false的“FindAndDupDate（）”和“FindAndDelete（）”。

- 使用mongoose的findOneAndUpdate、FindAndDelete两个方法，返回的数据是未更新的数据，但是库里的数据已经更新了；

# 注意点

- 将敏感信息放在**"隐藏"**文件中，写入环境变量，通过环境变量来获取

- PostMan 调试：可以将 token 保存到软件的全局变量，使用的时候直接取

  - 自动化脚本：

    ```js
    var jsonData = pm.response.json();
    pm.globals.set("token", jsonData.token);
    ```

-  用于存储用户信息  `ctx.state.user =  user;`