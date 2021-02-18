
const fileService = require('../service/file.service');
const userService = require('../service/user.service');
const { APP_HOST, APP_PORT } = require('../app/config');
const addExtname = require('../utils/file-addExtname');

class FileController {
    async saveAvatarInfo(ctx, next) {
        const { id } = ctx.user;
        // 1.得到图像信息
        const { mimetype, size} = ctx.req.file;
        const newFilename = await addExtname(ctx.req.file);
        // 2.将图像信息保存至数据库
        await fileService.createAvatarInfo(newFilename, mimetype, size, id);
        // 3.更新用户表中的avatar_url
        const avatarUrl = `${APP_HOST}:${APP_PORT}/users/${id}/avatar/${newFilename}`;
        await userService.updateUserAvatar(avatarUrl, id);
        ctx.body = {
            statusCode: 200,
            message: "上传成功~",
            avatarUrl: avatarUrl
        }
    }
    async savePicturesInfo(ctx, next) {
        // 1.获取文件信息
        const { momentId } = ctx.query;
        const { id } = ctx.user;
        const files = ctx.req.files;
        // 2.将所有文件信息保存
        for(let file of files){
            const { mimetype, size } = file;
            const filename = await addExtname(file);
            await fileService.createFileInfo(filename, mimetype, size, momentId, id);
        }
        ctx.body = {
            statusCode: 200,
            message: "上传成功~"
        }
    }
}

module.exports = new FileController();