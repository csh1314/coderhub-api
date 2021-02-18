const Router = require('koa-router');

const {
    verifyAuth,
    verifyPermission
} = require('../middleware/auth.middleware');
const {
    create,
    reply,
    update,
    remove,
    list
} = require('../controller/comment.controller');

const commentRouter = new Router({prefix: '/comment'});

// 发布评论
commentRouter.post('/publish', verifyAuth, create);
// 回复评论
commentRouter.post('/:commentId/reply', verifyAuth, reply);
// 修改/删除评论   登录 -> 是否许可
commentRouter.patch('/:commentId', verifyAuth, verifyPermission, update);
commentRouter.delete('/:commentId', verifyAuth, verifyPermission, remove)
// 获取评论列表
commentRouter.get('/', list);
module.exports = commentRouter;