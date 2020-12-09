const jwt = require('koa-jwt');
// 用户路由
const Router = require('koa-router');
// 前缀写法
const router = new Router({prefix: '/topics'});
const { find, findById, create, update, checkTopicExist, listTopicFollowers } = require('../controllers/topics');

const { secret } = require('../config');

// 认证中间件
const auth = jwt({ secret });

router.get('/', find);
router.post('/', auth,create);
// 有 id 的需检查是是否存在
router.get('/:id', checkTopicExist,findById);
router.patch('/:id', auth, checkTopicExist, update);
router.get('/:id/followers', checkTopicExist, listTopicFollowers);

module.exports = router;