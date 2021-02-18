const fs = require('fs');
const path = require('path');

const addExtname = async (file) => {
    const { filename, originalname} = file;
    const filePath = file.path;
    // 将上传的图片加上后缀名
    // console.log(ctx.req.file);
    const fileExt = path.extname(originalname);
    fs.renameSync(filePath,`${filePath}${fileExt}`);
    return `${filename}${fileExt}`;
}

module.exports = addExtname;