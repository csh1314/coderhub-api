const jwt = require('jsonwebtoken');
const { PRIVATE_KEY } = require('../app/config');

const userService = require('../service/user.service');

class AuthController {
    async login(ctx, next) {
        const { id, name } = ctx.user;
        const token = jwt.sign({ id, name }, PRIVATE_KEY, {
            expiresIn: 60 * 60 * 24,
            algorithm: 'RS256'
        })
        const [result] = await userService.getUserByName(name);
        const userInfo = result;
        ctx.body = {
            userInfo,
            token,
            code:20000
        };
    }

    async success(ctx, next){
        ctx.body = {
            code: 20000,
            userInfo: ctx.userInfo,
            token: ctx.token
        };
    }
}

module.exports = new AuthController();