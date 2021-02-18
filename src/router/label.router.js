const Router = require('koa-router');

const labelRouter = new Router({prefix:'/label'});

const {
    verifyAuth
} = require('../middleware/auth.middleware');

const {
    create,
    list
} = require('../controller/label.controller');

// 创建标签
labelRouter.post('/create', verifyAuth, create);
// 展示标签列表
labelRouter.get('/', list);

module.exports = labelRouter;