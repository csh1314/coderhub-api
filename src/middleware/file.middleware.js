const path = require('path');

const Jimp = require('jimp');
const Multer = require('koa-multer');

const {
    AVATAR_PATH,
    PICTURE_PATH
} = require('../constants/file-paths');

// 头像上传
const avatarUpload = Multer({
    dest:AVATAR_PATH
})
const avatarHandler = avatarUpload.single('avatar');

// 多图片上传
const picturesUpload = Multer({
    dest:PICTURE_PATH
})
const picturesHandler = picturesUpload.array('pictures');


const picturesResize = async (ctx, next) =>{
    // 1.获取所有图像
    const files = ctx.req.files;
    // 2.处理图像 (sharp/jimp)
    for(let file of files) {
        let destPath = path.join(file.destination, file.filename);
        let extName = path.extname(file.originalname);
        await Jimp.read(file.path).then(image => {
            image.resize(1290, Jimp.AUTO).write(`${destPath}-large${extName}`);
            image.resize(640, Jimp.AUTO).write(`${destPath}-middle${extName}`);
            image.resize(320, Jimp.AUTO).write(`${destPath}-small${extName}`);
        })
    }
    await next();
}

module.exports = {
    avatarHandler,
    picturesHandler,
    picturesResize
}