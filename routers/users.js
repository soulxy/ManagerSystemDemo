"use strict";

var router = require('koa-router')();

//用户管理
router.post('/loginIn',async (ctx, next) => {
  console.log('=====request>',ctx.request,ctx.request.body,ctx.session);
  // let result = await ctx.mongo.db('koaMDB').collection('user').findOne({sid: ctx.request.body.username});
  let result = await ctx.request.db.get('user').findOne({id: ctx.request.body.username});
  console.log('result==>',result);
  if(!result) {
      ctx.body = {
          status: {
              code: 400,
              msg: '用户名错误'
          },
          data: ''
      };
      await next();
  }else if(result.password == ctx.request.body.password) {
      console.log('**********',ctx.session);
      ctx.body = {
          status: {
              code: 200,
              msg: '登录成功'
          },
          data: result
      };
      await next();
  }else {
      ctx.body = {
          status: {
              code: 401,
              msg: '密码错误'
          },
          data: ''
      };
      await next();
  }

});

module.exports = router;
