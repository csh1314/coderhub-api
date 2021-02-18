const errorType = require('../constants/error-types');

const errorHandler = (error, ctx) => {
    let status, message;

    switch (error.message) {
        case errorType.NAME_OR_PASSWORD_IS_REQUIRED:
            status = 400;//Bad Request
            message = "用户名或者密码不能为空~";
            break;
        case errorType.USER_ALREADY_EXISTS:
            status = 409;//Conflict
            message = "用户名已存在~";
            break;
        case errorType.USER_DOES_NOT_EXIST:
            status = 400;
            message = "用户名不存在~";
            break;
        case errorType.PASSWORD_IS_INCORRECT:
            status =  400;
            message = "密码不正确，请重新登录~";
            break;
        case errorType.UNAUTHORIZATION:
            status =  401;
            message = "无效token~";
            break;
        case errorType.UNPERMISSION:
            status = 401;
            message = "不具备操作权限~";
            break;
        default:
            status = 404;
            message = "NOT FOUND~";
    }
    ctx.status = status;
    ctx.body = message;
}

module.exports = errorHandler;