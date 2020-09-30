const Koa = require('koa');
const app = new Koa();

// use 使用中间件
app.use(async (ctx)=>{
    if(ctx.url === '/'){
        ctx.body = '这是主页';
    }else if(ctx.url === '/users'){
        if(ctx.method === 'GET'){
            ctx.body = '这是用户列表页';
        }else if(ctx.method === 'POST'){
            ctx.body = '创建用户';
        }else{
            // 405：不允许这个方法
            ctx.status = 405;
        }
    }else if(ctx.url.match(/\/users\/\w+/)){
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


