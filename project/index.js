const Koa = require('koa');
const app = new Koa();

// use 使用中间件
app.use((ctx)=>{
    ctx.body = 'Hello Zhihu API';
});

app.listen(3000);


