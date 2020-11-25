// ES6 类写法
class HomeCtl {
    index(ctx) {
        ctx.body = '这是主页';
    }
    upload(ctx) {
        const file = ctx.request.files.file;
        ctx.body = { path: file.path };
    }
}

// 实例化类并导出
module.exports = new HomeCtl();