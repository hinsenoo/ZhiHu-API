const Koa = require('koa');
const bodyparser = require('koa-bodyparser');
const error = require('koa-json-error');
const paramter = require('koa-parameter');
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
// 校验参数中间件（通常用于校验请求体)
// 传入 app 可以作为去全局方法来使用
app.use(paramter(app));
// 批量读取注册路由
routing(app);

app.listen(3000, () => console.log('程序启动在 3000 端口'));


