/*
    "babel-core": "^6.7.6",
    "babel-preset-es2015": "^6.6.0",
    "babel-preset-stage-3": "^6.5.0",
*/

const Koa = require('koa');
const app = new Koa();

import views from "koa-views";
import bodyParser from "koa-bodyparser";
import logger from "koa-logger";
import convert from "koa-convert";
import json from "koa-json";
import statics from "koa-static";
import onerror from "koa-onerror";
// import mongodb from "koa-mongo";
const router = require('koa-router')();
const index = require('./routers/index');
const users = require('./routers/users');
import monk from "monk";
import session from "koa-session2";
import Store from "./Store.js";

app.use(bodyParser());

/*app.use(async (ctx, next) => {
  session({
    store: new Store({
      port: 6379,          // Redis port
      host: '127.0.0.1',   // Redis host
      // family: 4,           // 4 (IPv4) or 6 (IPv6)
      // password: '',
      db: 0
    })
  });
  await next();
});*/

app.use(convert(json()));

app.use(logger());

app.use(statics(__dirname + '/public'));

app.use(views(__dirname + '/views', {
  extension: 'jade'
}));

let sessionTry = session({store: new Store({})});
console.warn('===>',sessionTry);
app.use(session({store: new Store({})}));

app.use(async (ctx, next) => {
  console.log('** typeof session', typeof ctx.session);
  await next();
});

app.use(async (ctx, next) => {
  const start = new Date;
  await next();
  const ms = new Date - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

//连接数据库
/*app.use(mongodb({
  host: 'localhost',
  port: 27017,
  user: '',
  pass: '',
  db: 'koaMDB',
  max: 100,
  min: 1,
  timeout: 30000,
  log: false
}));*/
let db = monk('localhost:27017/koaMDB');
app.use(async (ctx, next) => {
  ctx.request.db = db;
  await next();
});

router.use('/', index.routes(), index.allowedMethods());
router.use('/users', users.routes(), users.allowedMethods());

app.use(router.routes(), router.allowedMethods());

// app.on('error', function(err, ctx){
//   console.log(err);
//   log.error('server error', err, ctx);
// });

module.exports = app;