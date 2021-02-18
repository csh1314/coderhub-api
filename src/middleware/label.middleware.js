const labelService = require('../service/label.service');


const verifyLabelExists = async (ctx, next) => {
    // 1.取出要添加的所有标签
    const { labels } = ctx.request.body;
    // 2，判断每一个标签在label表中是否存在
    const newLabels = [];
    for(let name of labels){
        let label = {};
        const labelResult = await labelService.getLabelByName(name);
        if(!labelResult){
            // 3.不存在即创建
            const result = await labelService.create(name);
            label = { id:result.insertId, name};
        }else{
            label = { id:labelResult.id, name};
        }
        newLabels.push(label);
    }
    ctx.labels = newLabels;
    await next();
}


module.exports = {
    verifyLabelExists
}