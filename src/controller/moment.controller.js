const fs = require('fs');

const momentService = require('../service/moment.service');
const fileService = require('../service/file.service');

const {
    PICTURE_PATH
} = require('../constants/file-paths');

class MomentController {
    async create(ctx, next) {
        // 1.获取数据(user_id, content)
        const userId = ctx.userInfo.id;
        const content = ctx.request.body.content;
        // 2，将数据插入到数据库
        const result = await momentService.create(userId, content);
        ctx.body = result;
    }

    async list(ctx, next) {
        // 1.获取数据(offset/size)
        const { offset, size } =ctx.query;
        // 2.查询列表
        const result = await momentService.getMomentList(offset, size);
        ctx.body = result;
    }

    async detail(ctx, next) {
        // 1.获取数据(momentId)
        const { momentId } = ctx.params;
        // 2. 根据id查询数据
        const result = await momentService.getMomentById(momentId);
        ctx.body = result[0];
    }

    async update(ctx, next) {
        const { momentId } = ctx.params;
        const { content } = ctx.request.body;
        // 修改内容
        const result = await momentService.update(content, momentId);
        ctx.body = result;
    }
    async remove(ctx, next) {
        const { momentId } = ctx.params;
        // 删除动态
        const result = await momentService.remove(momentId);
        ctx.body = result;
    }
    async addLabels(ctx, next) {
        // 1.得到动态标签和动态id
        const { momentId } = ctx.params;
        const { labels } = ctx;
        // 2.添加所有标签 id 
        for(let label of labels){
            // 判断该动态是否已存在标签
            const isExist = await momentService.hasLabel(momentId, label.id);
            if(!isExist){
                await momentService.addLabel(momentId, label.id);
            }
        }
        ctx.body = {
            statusCode:200,
            message:"给动态添加标签成功~"
        };
    }
    async approval(ctx, next){
        // 1.得到动态和用户id
        const { momentId } = ctx.params;
        const userId = ctx.userInfo.id;
        // 2.判断是否已点赞
        const isApproval = await momentService.isApproval(userId, momentId);
        if(!isApproval){
            await momentService.approval(userId, momentId);
        }else{
           // 已点赞 -> 取消点赞
            await momentService.cancelApproval(userId, momentId);
        }
        ctx.body = {
            statusCode:200,
            message:"操作成功~",
            data:!isApproval
        }
    }
    async isApproval(ctx, next) {
        // 1.得到动态和用户id
        const { momentId } = ctx.params;
        const userId = ctx.userInfo.id;
         // 2.是否已点赞
        const isApproval = await momentService.isApproval(userId, momentId);
        ctx.body = {
            statusCode:200,
            data:isApproval
        }
    }
    async pictureInfo(ctx, next) {
        // 1.通过 filename 得到文件信息
        let { filename } = ctx.params;
        const fileInfo = await fileService.getFileByFilename(filename);
        const { type } = ctx.query;
        const types = ["small", "middle", "large"];
        if(type&&types.some(item => item === type.toLowerCase())){
            filename = filename.replace(/\./,`-${type.toLowerCase()}.`);
        }
        // 2.提供图像信息
        ctx.response.set('content-type', fileInfo.mimetype);
        ctx.body = fs.createReadStream(`${PICTURE_PATH}/${filename}`);
    }
}

module.exports = new MomentController();