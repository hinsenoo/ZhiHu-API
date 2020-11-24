// 内存数据库
// const db = [{ name: "李雷" }];

const jsonwebtoken = require('jsonwebtoken');
const User = require('../models/users');        // 用户模型
const { secret } = require('../config');        // 引入 token 密钥

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
            name: { type: 'string', required: true},
            password: { type: 'string', required: true},
        });
        const {name} = ctx.request.body;
        // 创建用户唯一性检验
        const repeatedUser = await User.findOne({name});
        // 409，冲突
        if(repeatedUser) { ctx.throw(409, '用户已经存在'); } 
        const user = await new User(ctx.request.body).save();
        ctx.body = user;
    }
    // 授权
    async checkOwner(ctx, next){
        // 用户只能删除自己
        // 403 Forbidden，没有权限访问
        if(ctx.params.id !== ctx.state.user._id){
            ctx.throw( ctx.throw(403, '没有权限'));
        }
        await next();
    }
    // 4、修改用户
    async updated(ctx) {
        ctx.verifyParams({
            name: {type: 'string', required: false},
            password: { type: 'string', required: false},
        });
        const user = await User.findOneAndUpdate('5faa55da62e3563f0c3595ff', ctx.request.body);
        if(!user) { ctx.throw(404, '用户不存在'); }
        ctx.body = user;
    }
    // 5、删除用户
    async delete(ctx) {
        const user = await User.findByIdAndRemove(ctx.params.id);
        if(!user) { ctx.throw(404, '用户不存在'); }
        // 删除成功，但是不返回内容
        ctx.status = 204;
    }
    // 6、登录
    async login(ctx){
        ctx.verifyParams({
            name: { type: 'string', required: true },
            password: { type: 'string', required: true }
        });
        // 校验用户名密码
        const user = await User.findOne(ctx.request.body);
        if (!user) { ctx.throw(401, '用户名或密码不正确'); }
        // 生成 token
        const { _id, name } = user;
        const token = jsonwebtoken.sign({ _id, name }, secret, { expiresIn: '1d' });
        ctx.body = { token };
    }
}

module.exports = new UsersCtl;