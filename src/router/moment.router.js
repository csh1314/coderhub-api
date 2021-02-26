const Router = require('koa-router');

const momentRouter = new Router({prefix: '/moment'});

const {
    create,
    detail,
    list,
    update,
    remove,
    addLabels,
    approval,
    isApproval,
    pictureInfo
} = require('../controller/moment.controller');
const {
    verifyAuth,
    verifyPermission
} = require('../middleware/auth.middleware');
const {
    verifyLabelExists
} = require('../middleware/label.middleware');

// 发布动态
momentRouter.post('/publish', verifyAuth, create);
// 得到动态列表
momentRouter.get('/', list);
// 得到动态详情
momentRouter.get('/:momentId', detail);
// 修改/删除动态 需要权限： 登录 -> 是否许可
momentRouter.patch('/:momentId', verifyAuth, verifyPermission, update);
momentRouter.delete('/:momentId', verifyAuth, verifyPermission, remove);

// 给动态添加标签
momentRouter.post('/:momentId/labels', verifyAuth, verifyPermission, verifyLabelExists, addLabels);

// 给动态点赞/取消点赞
momentRouter.post('/:momentId/approval', verifyAuth, approval)

// 查看是否已赞
momentRouter.get('/:momentId/isApproval', verifyAuth, isApproval)

// 得到动态配图
momentRouter.get('/images/:filename', pictureInfo);

module.exports = momentRouter;