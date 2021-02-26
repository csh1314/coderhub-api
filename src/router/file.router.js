const Router = require('koa-router');

const fileRouter = new Router({prefix:'/upload'});


const {
    avatarHandler,
    picturesHandler,
    picturesResize
} = require('../middleware/file.middleware');
const {
    verifyAuth
} = require('../middleware/auth.middleware');
const {
    saveAvatarInfo,
    savePicturesInfo
} = require('../controller/file.controller');

// 上传头像
fileRouter.post('/avatar', verifyAuth, avatarHandler, saveAvatarInfo);
// 上传配图
fileRouter.post('/pictures', verifyAuth, picturesHandler, picturesResize, savePicturesInfo);
module.exports = fileRouter;