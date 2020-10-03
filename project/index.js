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
usersRouter.get('/:id',auth, (ctx)=>{
    ctx.body = `这是用户 ${ctx.params.id}`;
});

// router.routes() 来加载路由中间件
app.use(router.routes());
app.use(usersRouter.routes());
app.use(usersRouter.allowedMethods());



// use 使用中间件
// 编写 koa 路由中间件
// app.use(async (ctx)=>{
//     if(ctx.url === '/'){
//         ctx.body = '这是主页';
//     }else if(ctx.url === '/users'){
//         if(ctx.method === 'GET'){
//             ctx.body = '这是用户列表页';
//         }else if(ctx.method === 'POST'){
//             ctx.body = '创建用户';
//         }else{
//             // 405：不允许这个方法
//             ctx.status = 405;
//         }
//     }else if(ctx.url.match(/\/users\/\w+/)){
//         // 匹配正则：\w 匹配字母 + 一个或多个
//         // 匹配符合小括号内的内容: userId
//         // [
//         //     "/users/111",
//         //     "111"    
//         // ]
//         const userId = ctx.url.match(/\/users\/(\w+)/)[1];
//         ctx.body = `这是用户 ${userId}`;

//     }else {
//         // 404：服务器上没有找到请求的资源
//         ctx.status = 404;
//     }
// });

app.listen(3000);


