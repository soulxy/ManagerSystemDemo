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
const router = require('koa-router')();
const index = require('./routers/index');
const users = require('./routers/users');

app.use(convert(bodyParser()));

app.use(convert(json()));

app.use(convert(logger()));

app.use(convert(statics(__dirname + '/public')));

app.use(views(__dirname + '/views', {
  extension: 'jade'
}));

app.use(async (ctx, next) => {
  const start = new Date;
  await next();
  const ms = new Date - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

router.use('/', index.routes(), index.allowedMethods());
router.use('/users', users.routes(), users.allowedMethods());

app.use(router.routes(), router.allowedMethods());

app.on('error', function(err, ctx){
  console.log(err);
  log.error('server error', err, ctx);
});

module.exports = app;