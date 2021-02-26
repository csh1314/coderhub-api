const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const cors = require('@koa/cors');

const useRoutes = require('../router');
const errorHandler = require('./error-handle');

const app = new Koa();

app.useRoutes = useRoutes;
// 设置跨域
// app.use(async (ctx, next)=> {
//     ctx.set('Access-Control-Allow-Origin', '*')
//     ctx.set('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type')
//     ctx.set('Access-Control-Allow-Methods','PUT,POST,GET,DELETE,OPTIONS')
//     await next();
// });
app.use(cors());

app.use(bodyParser());
app.useRoutes();
app.on('error', errorHandler);
module.exports = app;