/*
    "babel-core": "^6.7.6",
    "babel-preset-es2015": "^6.6.0",
    "babel-preset-stage-3": "^6.5.0",
*/
'use strict';
const Koa = require('koa');
let app = new Koa();

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
const admin = require('./routers/admin');
const company = require('./routers/company');

import monk from "monk";
import session from "koa-session2";
import Store from "./Store.js";

app.use(bodyParser());

app.use(session({store: new Store()}));

app.use(convert(json()));

app.use(logger());

app.use(statics(__dirname + '/public'));

app.use(views(__dirname + '/views', {
  extension: 'jade'
}));

app.use(async (ctx, next) => {
  const start = new Date;
  await next();
  const ms = new Date - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

/*app.use(async (ctx, next) => {
  console.log('--->',ctx.session);
  //验证是否登录，没登录跳转到登录页并验证是否有权限访问
  //TODO
  if(!ctx.session || !ctx.session.userObj) {//未登录
    await ctx.render('/login');
  }
  await next();
});*/
//连接数据库
let db = monk('localhost:27017/koaMDB');
app.use(async (ctx, next) => {
  ctx.request.db = db;
  await next();
});

router.use('', index.routes(), index.allowedMethods());
router.use('/users', users.routes(), users.allowedMethods());
router.use('/admin', admin.routes(), admin.allowedMethods());
router.use('/company', company.routes(), company.allowedMethods());

app.use(router.routes(), router.allowedMethods());



module.exports = app;