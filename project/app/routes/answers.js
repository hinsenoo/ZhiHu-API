const jwt = require('koa-jwt');
// 用户路由
const Router = require('koa-router');
// 前缀写法
const router = new Router({prefix: '/questions/:questionId/answers'});
const { find, findById, create, update, delete: del , checkAnswerExist, checkAnswerer } = require('../controllers/answers');

const { secret } = require('../config');

// 认证中间件
const auth = jwt({ secret });

router.get('/', find);
router.post('/', auth, create);
// 有 id 的需检查是是否存在
router.get('/:id', checkAnswerExist,findById);
router.patch('/:id', auth, checkAnswerExist, checkAnswerer,update);
router.delete('/:id', auth, checkAnswerExist, checkAnswerer, del);

module.exports = router;