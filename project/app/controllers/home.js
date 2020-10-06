// ES6 类写法
class HomeCtl {
    index(ctx){
        ctx.body = '这是主页';
    }
}

// 实例化类并导出
module.exports = new HomeCtl();