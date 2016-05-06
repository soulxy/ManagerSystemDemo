/**
 * Created by Administrator on 2016/4/30.
 */

let router = require('koa-router')();

//获取老师列表
router.get('/list', async (ctx, next) => {
    let result;
    try {
        let companies = await ctx.request.db.get('teacher').find();
        result = {
            status: {code: 200, msg: '查询成功'},
            data: companies
        };
    }catch(e) {
        result = {
            status: {code: 500, msg: e || '服务器错误'}
        }
    }finally {
        ctx.body = result;
    }
});

module.exports = router;
