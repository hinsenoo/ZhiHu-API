// 内存数据库
// const db = [{ name: "李雷" }];

// 用户模型
const User = require('../models/users');

class UsersCtl {
    // 1、获取用户列表
    async find(ctx) {
        ctx.body = await User.find();
    }
    // 2、获取
    async findById(ctx) {
        const user = await User.findById(ctx.params.id);
        if(!user) { ctx.throw(404, '用户不存在'); }
        ctx.body = user;
    }
    // 3、新建用户
    async created(ctx) {
        // type 数据类型 required 是否必需
        ctx.verifyParams({
            name: {type: 'string', required: true},
        });
        const user = await new User(ctx.request.body).save();
        ctx.body = user;
    }
    // 4、修改用户
    async updated(ctx) {
        ctx.verifyParams({
            name: {type: 'string', required: true},
        });
        const user = await User.findOneAndUpdate(ctx.params.id, ctx.request.body);
        if(!user) { ctx.throw(404, '用户不存在'); }
        ctx.body = user;
    }
    async delete(ctx) {
        const user = await User.findByIdAndRemove(ctx.params.id);
        if(!user) { ctx.throw(404, '用户不存在'); }
        // 删除成功，但是不返回内容
        ctx.status = 204;
    }
}

module.exports = new UsersCtl;