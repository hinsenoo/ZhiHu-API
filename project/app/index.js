const Koa = require('koa');
const bodyparser = require('koa-bodyparser');
const error = require('koa-json-error');
const app = new Koa();
const routing = require('./routes');

// 错误处理中间件
app.use(error({
    // 在生产环境禁用错误堆栈的返回
    // 获取环境变量 process.env.NODE_ENV
    postFormat: (e, { stack, ...rest }) => process.env.NODE_ENV  === 'production' ? rest : { stack, ...rest }
}));
// 注册请求体解析中间件
app.use(bodyparser());
// 批量读取注册路由
routing(app);

app.listen(3000, () => console.log('程序启动在 3000 端口'));


