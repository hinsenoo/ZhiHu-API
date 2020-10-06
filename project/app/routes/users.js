// 用户路由
const Router = require('koa-router');
// 前缀写法
const router = new Router({prefix: '/users'});
const {find,findById,created,updated, delete: del } = require('../controllers/users');

// 内存数据库
const db = [{ name: "李雷" }];

// 1、获取用户列表
router.get('/', find);
// 2、新建用户
router.post('/', created);
// 3、获取用户
router.get('/:id', findById);
// 4、修改用户
router.put('/:id', updated);
// 5、删除用户
router.delete('/:id', del);

module.exports = router;