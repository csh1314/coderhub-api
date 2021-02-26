const jwt = require('jsonwebtoken');

const errorType = require('../constants/error-types');
const userService = require('../service/user.service');
const authService = require('../service/auth.service');
const md5password = require('../utils/password-handle');
const { PUBLIC_KEY } = require('../app/config');

const verifyLogin = async (ctx, next) => {
    // 1. 获取用户名和密码
    const { name, password} = ctx.request.body;
    // 2. 判断用户名和密码是否为空
    if(!name || !password){
        // 返回错误
        const error = new Error(errorType.NAME_OR_PASSWORD_IS_REQUIRED);
        return ctx.app.emit('error', error, ctx);
    }
    // 3，判断用户是否存在（用户不存在）
    const result = await userService.getUserByName(name);
    const user = result[0];
    if(!user){
        const error = new Error(errorType.USER_DOES_NOT_EXIST);
        return ctx.app.emit('error', error, ctx);
    }
    // 4.判断密码是否匹配一致（加密）
    if(md5password(password) !== user.password){
        const error = new Error(errorType.PASSWORD_IS_INCORRECT);
        return ctx.app.emit('error', error, ctx);
    }

    ctx.user = user;
    await next();
}

const verifyAuth = async (ctx, next) => {
    console.log("验证授权的middleware~");
    // 1. 取出token
    const authorization = ctx.headers.authorization;
    if(!authorization){
        const error = new Error(errorType.UNAUTHORIZATION);
        return ctx.app.emit('error', error, ctx);
    }
    const token = authorization.replace('Bearer ','');
    // 2. 验证token 
    try {
        const result = jwt.verify(token, PUBLIC_KEY, {
            algorithms: ["RS256"]
        });
        const { name } = result;
        const [userInfo] = await userService.getUserByName(name);
        ctx.userInfo = userInfo;
        ctx.token = authorization;
        await next();
    } catch (err) {
        const error = new Error(errorType.UNAUTHORIZATION);
        ctx.app.emit('error', error, ctx);
    }
    
}

const verifyPermission = async (ctx, next) => {
    console.log("验证用户权限的middleware~");
    // 1.获取参数
    // 方案一：这种封装需要接口为restful风格的
    // 以${tableName}Id为key值
    const [ resourceKey ] = Object.keys(ctx.params);
    const tableName = resourceKey.replace('Id','');
    const resourceId = ctx.params[resourceKey];
    const { id } = ctx.userInfo;

    // 2.查询是否具备权限
    try {
        const isPermission = await authService.checkResource(tableName, resourceId, id);
        if(!isPermission) throw new Error();
        await next();
    } catch (err) {
        const error = new Error(errorType.UNPERMISSION);
        return ctx.app.emit('error', error, ctx);
    }
}

// 方案二：使用闭包 传入tableName
//  使用中间件则 verifyPermission(tableName)
// const verifyPermission = (tableName) => {
//     return async (ctx, next) => {
//         console.log("验证用户权限的middleware~");
//         // 1.获取参数
//         const { momentId } = ctx.params;
//         const { id } = ctx.user;
//         // 2.查询是否具备权限
//         try {
//             const isPermission = await authService.checkResource(tableName,momentId, id);
//             if(!isPermission) throw new Error();
//             await next();
//         } catch (err) {
//             const error = new Error(errorType.UNPERMISSION);
//             return ctx.app.emit('error', error, ctx);
//         }
//     }
// }

module.exports = {
    verifyLogin,
    verifyAuth,
    verifyPermission
}