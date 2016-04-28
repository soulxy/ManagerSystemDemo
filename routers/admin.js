/**
 * Created by Administrator on 2016/4/28.
 *
 * 管理员访问的路由
 * 老师管理：增删改
 */

let router = require('koa-router');

//获取老师列表
router.get('/teacher', async (ctx, next) => {
    let result;
    try {
        let teachersList = await ctx.request.db.get('teacher').find();
        result = {
            status: { code: 200, msg: '查找成功' }, data:teachersList
        };
    }catch(e) {
        result = {
            status: { code: 500, msg: e || '服务器错误' }
        };
    }finally {
        ctx.body = result;
        await next();
    }
});

//获取单个老师
router.get('/teacher/:id', async (ctx, next) => {
    let tid = ctx.request.params.id;
    let result;
    try {
        let teacher = ctx.request.db.get('teacher').find({id: tid});
        if(!teacher) {
            result = {
                status: { code: 400, msg: '不存在'}
            };
        }else {
            result = {
                status: { code: 400, msg: '查找成功' }, data: teacher
            };
        }
    }catch(e) {
        result = {
            status: { code: 500, msg: e || '服务器错误'}
        }
    }finally {
        ctx.body = result;
        await next();
    }
});

//添加老师
router.post('/teacher/add', async (ctx, next) => {
    let teacherObj = ctx.request.body;
    let result;
    try {
        let teachers = await ctx.request.db.get('teacher').insert(teacherObj);
        result = {
            status: { code: 200, msg: '添加成功' }
        };
    }catch(e) {
        result = {
            status: { code: 500, msg: e || '服务器错误' }
        };
    }finally {
        ctx.body = result;
        await next();
    }
});

//修改老师
router.post('/teacher/update/:id', async (ctx, next) => {
    let tid = ctx.request.params.id;
    let teacherObj = ctx.request.body;
    let result;
    try {
        let teacher = await ctx.request.db.get('teacher').findOne({id: tid});
        if(!teacher) {//没有该老师
            result = {
                status: { code: 400, msg: '不存在' }
            };
        }else {//更新
            await ctx.request.db.get('teacher').update({id: tid},{$set: teacherObj});
        }
    }catch(e) {
        result = {
            status: { code: 500, msg: e || '服务器错误' }
        };
    }finally {
        ctx.body = result;
        await next();
    }
});

//删除老师
router.get('/teacher/delete/:id', async (ctx, next) => {
    let tid = ctx.request.params.id;
    let result;
    try {
        await ctx.request.db.get('teacher').remove({id: tid});
    }catch(e) {
        result = {
            status: { code: 500, msg: e || '服务器错误' }
        };
    }finally {
        ctx.body = result;
        await next();
    }
});

module.exports = router;


