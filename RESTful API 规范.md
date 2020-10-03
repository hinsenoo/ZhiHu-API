## REST 是什么？

- **Representational() State Transfer**
  - Representational：数据的表现形式（JSON、XML......）
  - State：当前状态或者数据
  - Transfer：数据传输
- 万维网软件架构**风格**
- 用来**创建网络服务**

## REST 的 6 个限制

**1. 客户端—服务器（Client-Sever，CS 架构）**

- 关注点分离
- 服务端专注数据存储，提升了简单性
- 前端专注用户解密，提升了可移植性

**2. 无状态（Stateless）**

- 所有用户会话信息都保持在客户端
- 每次请求必须包括所有信息，不能依赖上下文信息
- 服务端不用保存会话信息，提升了简单性、可靠性、可见性

**3. 缓存（Cache）**

- 所有服务端响应都要被标为可缓存或不可缓存
- 减少前后端交互，提升了性能

**4. 统一接口（Uniform Interface）**

- 接口设计尽可能统一通用，提升了简单性、可见性
- 接口与实现解耦，使前后端可以独立开发迭代

**5. 分层系统（Layered System）**

- 每层只知道相邻的一层，后面隐藏的就不知道了
- 客户端不知道是和代理还是真实服务器通信
- 其他层：安全层、负载均衡、缓存层等

**6. 按需代码（Code-On-Demand 可选）**

- 客户端可以下载运行服务端传来的代码（ 比如 JS ）
- 通过减少一些功能，简化了客户端

### 统一接口的限制（子限制）

- **1. 资源的标识**
  - 资源是任何可以命名的事物，比如用户、评论等
  - 每个资源可以通过 URI 被唯一的标识
    - `https://api.github.com/users`
    - `https://api.github.com/users/lewis617`
- **2. 通过表述来操作资源**
  - 表述就是 Representation，比如 JSON、XML 等
  - 客户端不能直接操作（比如 SQL）服务端资源
  - 客户端应该通过表述（比如 JSON）来操作资源
- **3. 自描述消息**
  - 每个消息（请求或响应）必须提供足够的信息让接受者理解
  - 媒体类型（`application/json、application/xml`）
  - HTTP 方法：GET（查）、POST（增）、DELETE（删）
  - 是否缓存：Cache-Control
- **4. 超媒体作为应用状态引擎**
  - 超媒体：带文字的链接
  - 应用状态：一个网页
  - 引擎：驱动、跳转
  - 合起来：点击链接跳转到另一个网页

## 什么是 RESTful API?

- **符合 REST 架构风格的 API**

## RESTful API 具体什么样子？

- 基本的 URI，如 `https://api.github.com/users`
- 标准 HTTP 方法，如 `GET,POST,PUT,PATCH,DELETE`
  - 补：PUT——整体替换更新、PATCH——部分更新
- 传输的数据媒体类型，如 `JSON、XML`

例子：

- `GET /users` # 获取 user 列表
- `GET /users/12` # 查看某个具体的 user
- `POST /users` #  新建一个 user
- `PUT/users/12`  # 更新 user 12.
- `DELETE/users/12`  # 删除 user 12

## RESTful API 设计最佳实践

### 请求设计规范

- URI 使用名称，尽量用复数，如 /`users`

- URI 使用嵌套关系表示关联关系，如 `/users/12/repos/5`

- 使用正确的 HTTP 方法，如 `GET/POST/PUT/DELETE`

- 不符合 CRUD(增删改查) 的情况：`POST/action/子资源`

### 响应设计规范

- 查询

- 分页

- 字段过滤

- 状态码（2xx-成功、3xx-重定向、4xx-客户端错误、5xx-服务端错误）

- 错误处理

### 安全

- HTTPS
- 鉴权
- 限流                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 

### 开发者友好

- 文档
- 超媒体



