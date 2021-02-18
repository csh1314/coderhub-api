const Router = require('koa-router');

const {
    create, 
    avatarInfo
} = require('../controller/user.controller');
const {
    verifyUser,
    handlePassword
} = require('../middleware/user.middleware');

const userRouter = new Router({prefix: '/users'});

// 注册用户 -> 非空+用户名是否已用 -> 加密pwd -> 存入数据库
userRouter.post('/register', verifyUser, handlePassword, create);

// 得到用户头像
userRouter.get('/:userId/avatar/:filename', avatarInfo);


module.exports = userRouter;