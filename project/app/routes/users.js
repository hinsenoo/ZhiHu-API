const jwt = require('koa-jwt');
// 用户路由
const Router = require('koa-router');
// 前缀写法
const router = new Router({prefix: '/users'});
const {find,findById,created,updated, delete: del, login, checkOwner } = require('../controllers/users');

const { secret } = require('../config');

// 认证中间件
const auth = jwt({ secret });

// 编写认证中间件===============================
// const auth = async (ctx, next) => {
//     // header 把请求头都改变为小写，当没有 token 请求头，则默认为空，反正报错
//     const { authorization = '' } = ctx.request.header;
//     // { Authorization: Bearer token}
//     const token = authorization.replace('Bearer ','');
//     try{
//         // 报错：token 被篡改或者为空，属于 401 错误：未认证错误。
//         const user = jsonwebtoken.verify(token, secret);
//         // 用于存储用户信息
//         ctx.state.user =  user;
//     }catch(err){
//         ctx.throw(401, err.message);
//     }
//     // 执行后续中间件
//     await next();
// }

// 内存数据库
const db = [{ name: "李雷" }];

// 1、获取用户列表
router.get('/', find);
// 2、新建用户
router.post('/', created);
// 3、获取用户
router.get('/:id', findById);
// 4、修改用户，需认证（auth）—> 授权（checkOwner）
router.patch('/:id', auth, checkOwner,updated);
// 5、删除用户，需认证（auth）—> 授权（checkOwner）
router.delete('/:id', auth, checkOwner, del);
// 6、用户登录
router.post('/login',login);

module.exports = router;