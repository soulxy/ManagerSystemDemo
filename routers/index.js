let router = require('koa-router')();

//登录页面
router.get('/', async (ctx, next) => {
  await ctx.render('login', {
    
  });
});

//管理员管理首页
router.get('/admin', async (ctx, next) => {
  let user;
  if(ctx.session && ctx.session.userObj) {
    user = ctx.session.userObj;
  }else {
    await ctx.render
  }
  await ctx.render('admin',{
   user: ctx.session.userObj
  });
});

//新闻管理
router.get('/news', async (ctx, next) => {
  await ctx.render('news', {});
});

//404
router.get('/404', async (ctx, next) => {
  await ctx.render('404');
});
module.exports = router;
