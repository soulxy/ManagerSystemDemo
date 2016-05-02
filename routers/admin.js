/**
 * Created by Administrator on 2016/4/28.
 *
 * 管理员访问的路由
 * 老师管理：增删改
 */

let router = require('koa-router')();
let _ = require('lodash');

//获取老师列表
router.get('/teacher', async (ctx, next) => {
    let result,companyArr = [];
    try {
        let teachersList = await ctx.request.db.get('teacher').find();
        let companyList = await ctx.request.db.get('company').find();

        //将公司id-》name 存到数组待用
        _.forEach(companyList, function(item, key) {
            companyArr[item.id] = item.name;
        });

        //将对应的公司名插入其中
        _.forEach(teachersList, function(item, key){
            item.cname = companyArr[item.cid];
        });
        console.log('===>',teachersList);
        result = {
            status: { code: 200, msg: '查找成功' }, data:teachersList
        };
    }catch(e) {
        result = {
            status: { code: 500, msg: e || '服务器错误' }
        };
    }finally {
        // ctx.body = result;
        await ctx.render('teacher', { results: result});
    }
});

//展示添加和修改页面
router.get('/teacher/add', async (ctx, next) => {
    await ctx.render('teacher-add-update');
});

router.get('/teacher/update/:id', async (ctx, next) => {
    let tid = ctx.params.id;
    let result;
    try {
        let teacher = await ctx.request.db.get('teacher').findOne({id: tid});
        if(teacher) {
            result = {
                status: { code: 200, msg: '查询成功' }, data: teacher
            };
        }else{
            result = {
                status: { code: 400, msg: '不存在该老师信息' }
            };
        }

    }catch(e) {
        result = {
            status:{ code: 500, msg: e || '服务器错误'}
        };
    }finally {
        await ctx.render('teacher-add-update', {
            result: result
        });
    }
});

//添加老师 同时在用户表添加账号 密码默认123456
router.post('/teacher/addTea', async (ctx, next) => {
    let teacherObj = ctx.request.body;
    let result;
    try {
        if(!teacherObj) {
            console.log('空了');
            throw new Error('输入为空');
        }
        let teachers = await ctx.request.db.get('teacher').insert(teacherObj);
        await ctx.request.db.get('user').insert({ id: teacherObj.id, password: '123456', role: 1});
        result = {
            status: { code: 200, msg: '添加成功' }
        };
    }catch(e) {
        result = {
            status: { code: 500, msg: e || '服务器错误' }
        };
    }finally {
        ctx.body = result;
    }
});

//获取单个老师
router.get('/teacher/:id', async (ctx, next) => {
    let tid = ctx.params.id;
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

//修改老师
router.put('/teacher/updateTea/:id', async (ctx, next) => {
    let tid = ctx.params.id;
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
    }
});

//删除老师
router.del('/teacher/deleteTea/:id', async (ctx, next) => {
    let tid = ctx.params.id;
    let result;
    try {console.log('----->',tid);
        /*await ctx.request.db.get('teacher').remove({ id: tid});
        await ctx.request.db.get('user').remove({ id: tid});*/
        result = {
            status: { code: 200, msg: '删除成功'}
        };
    }catch(e) {
        result = {
            status: { code: 500, msg: e || '服务器错误' }
        };
    }finally {
        ctx.body = result;
    }
});

module.exports = router;


