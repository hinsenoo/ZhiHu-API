// 内存数据库
const db = [{ name: "李雷" }];

class UsersCtl {
    // 1、获取用户列表
    find(ctx) {
        ctx.body = db;
    }
    // 2、新建用户
    findById(ctx) {
        if(ctx.params.id * 1 >= db.length){
            ctx.throw(412, '先决条件失败：id 大于等于数组长度了');
        }
        // 字符串转数字
        ctx.body = db[ctx.params.id * 1];
    }
    // 3、获取用户
    created(ctx) {
        // 从请求体中获取新增加的用户
        db.push(ctx.request.body);
        ctx.body = ctx.request.body;
    }
    // 4、修改用户
    updated(ctx) {
        db[ctx.params.id * 1] = ctx.request.body;
        ctx.body = ctx.request.body;
    }
    delete(ctx) {
        // 删除数组中的内容
        db.splice(ctx.params.id * 1, 1);
        // 删除成功，但是不返回内容
        ctx.status = 204;
    }
}

module.exports = new UsersCtl;