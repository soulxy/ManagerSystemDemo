/*
* 用户登录用到的router
* */
let router = require('koa-router')();

//用户管理
router.post('/loginIn',async (ctx, next) => {
  // let result = await ctx.mongo.db('koaMDB').collection('user').findOne({sid: ctx.request.body.username});
  try {
      let result = await ctx.request.db.get('user').findOne({id: ctx.request.body.username});
      if(!result) {
          ctx.body = {
              status: {
                  code: 400,
                  msg: '用户名错误'
              },
              data: ''
          };
      }else if(result.password == ctx.request.body.password) {
          ctx.body = {
              status: {
                  code: 200,
                  msg: '登录成功'
              },
              data: result
          };
          //保存session
          ctx.session.userObj = result;
      }else {
          ctx.body = {
              status: {
                  code: 401,
                  msg: '密码错误'
              },
              data: ''
          };
      }
  }catch(e) {
      ctx.body = {
          status: 500,
          msg: e || '服务器错误'
      };
  }finally {
      await next();
  }

});

module.exports = router;
