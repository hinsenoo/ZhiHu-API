const Koa = require('koa');
const bodyparser = require('koa-bodyparser');
const app = new Koa();
const routing = require('./routes');

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
// 注册请求体解析中间件
app.use(bodyparser());
// 批量读取注册路由
routing(app);

app.listen(3000, () => console.log('程序启动在 3000 端口'));


