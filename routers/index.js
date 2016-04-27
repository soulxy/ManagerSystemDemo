var router = require('koa-router')();

//登录页面
router.get('/', async (ctx, next) => {
  await ctx.render('login', {
    
  });
});

//管理员管理首页
router.get('admin', async (ctx, next) => {
  await ctx.render('admin',{
   user: ctx.session.user
  });
});

//新闻管理
router.get('news', async (ctx, next) => {
  await ctx.render('news', {});
});

module.exports = router;
