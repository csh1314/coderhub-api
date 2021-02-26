const labelService = require('../service/label.service');

class LabelController{
    async create(ctx, next) {
        const { name } = ctx.request.body;
        await labelService.create(name);
        ctx.body = {
            statusCode:20000,
            message:'创建成功~'    
        };
    }
    async list(ctx, next) {
        const {limit, offset} = ctx.query;
        const result = await labelService.list(limit, offset);
        ctx.body = result;
    }
}


module.exports = new LabelController();