/**
 * Created by Administrator on 2016/4/28.
 *
 * 管理员访问的路由
 * 老师管理：增删改查
 * 学生管理：增删改查
 * 公司管理：增删改查
 * 新闻管理：增删改查
 * 留言管理：删查
 * 设置管理：修改密码
 */

let router = require('koa-router')();
let _ = require('lodash');
let format = require('date-format');

let errorFun = function(msg){
    throw new Error(msg);
};

//获取老师列表  带分页
router.get('/teacher', async (ctx, next) => {
    let result,companyArr = [];
    let params = {},pageObj = {};
    params.page = ctx.request.query.page || 1;
    params.pageSize = ctx.request.pageSize || 2;

    try {
        let teachersList = await ctx.request.db.get('teacher').find({},{ limit: params.pageSize, skip:(params.page - 1)*params.pageSize});
        let count = await ctx.request.db.get('teacher').count();
        pageObj.countPage = Math.ceil(count / params.pageSize);
        pageObj.currentPage = params.page;
        let companyList = await ctx.request.db.get('company').find();
        //将公司id-》name 存到数组待用
        _.forEach(companyList, function(item, key) {
            companyArr[item.id] = item.name;
        });

        //将对应的公司名插入其中
        _.forEach(teachersList, function(item, key){
            item.cname = (item.cid && companyArr[item.cid]) || '空';
        });

        result = {
            status: { code: 200, msg: '查找成功' }, data:{ teacher: teachersList, pageObj: pageObj}
        };
    }catch(e) {
        result = {
            status: { code: 500, msg: e || '服务器错误' }
        };
    }finally {
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
            errorFun('输入为空');
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
            result = {
                status: { code: 200, msg: '修改成功' }
            };
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
    try {
        await ctx.request.db.get('teacher').remove({ id: tid});
        await ctx.request.db.get('user').remove({ id: tid});

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

//查看学生（分页）
router.get('/student', async (ctx, next) => {
    let result,companyArr = [], teacherArr = [];
    let params = {},pageObj = {};
    params.page = ctx.request.query.page || 1;
    params.pageSize = ctx.request.pageSize || 2;

    try {
        let studentList = await ctx.request.db.get('student').find({},{ limit: params.pageSize, skip:(params.page - 1)*params.pageSize});
        let count = await ctx.request.db.get('student').count();
        let teacherList= await ctx.request.db.get('teacher').find();
        let companyList = await ctx.request.db.get('company').find();

        pageObj.countPage = Math.ceil(count / params.pageSize);
        pageObj.currentPage = params.page;


        //老师 公司 id->name
        _.forEach(companyList, (item, key) => {
            companyArr[item.id] = item.name;
        });
        _.forEach(teacherList, (item, key) => {
            teacherArr[item.id] = item.name;
        });

        //将对应的公司名老师插入其中
        _.forEach(studentList, (item, key) => {
            item.tname = (item.tid && teacherArr[item.tid]) || '空';
            item.cname = (item.cid && companyArr[item.cid]) || '空';
        });

        result = {
            status: { code: 200, msg: '查找成功' }, data:{ student: studentList, pageObj: pageObj}
        };
    }catch(e) {
        result = {
            status: { code: 500, msg: e || '服务器错误' }
        };
    }finally {
        await ctx.render('student', { results: result});
    }
});

//展示添加 修改学生页面
router.get('/student/add', async (ctx, next) => {
    await ctx.render('student-add-update');
});

router.get('/student/update/:id', async (ctx, next) => {
    let result;
    try {
        let student = await ctx.request.db.get('student').findOne({ id: ctx.params.id});
        result = {
            status: { code: 200, msg: '查询成功'}, data: student
        };
    }catch(e){
        result = {
            status: { code: 500, msg: e || '服务器错误'}
        };
    } finally {
        await ctx.render('student-add-update', { result: result});
    }

});

//添加学生
router.post('/student/addStu', async (ctx, next) => {
    let studentObj = ctx.request.body;
    let result;
    try {
        if(!studentObj) {
            console.log('空了');
            errorFun('输入为空');
        }
        let student = await ctx.request.db.get('student').insert(studentObj);
        await ctx.request.db.get('user').insert({ id: student.id, password: '123456', role: 2});
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

//修改学生
router.put('/student/updataStu/:id', async (ctx, next) => {
    let sid = ctx.params.id;
    let studentObj = ctx.request.body;
    let result;
    try {
        if(!studentObj) {
            console.log('空了');
            errorFun('输入为空');
        }
        let student = await ctx.request.db.get('student').find({ id: sid});
        if(!student) {
            result = {
                status: { code: 400, msg: '找不到'}
            };
        }else {
            await ctx.request.db.get('student').update({id: sid},{$set: studentObj});
            result = {
                status: { code: 200, msg: '修改成功' }
            };
        }
    }catch(e) {
        result = {
            status: { code: 500, msg: e || '服务器错误' }
        };
    }finally {
        ctx.body = result;
    }
});

//删除学生
router.del('/student/deleteStu/:id', async (ctx, next) => {
    let sid = ctx.params.id;
    let result;
    try {console.log('--->',sid);
        await ctx.request.db.get('student').remove({ id: sid});
        await ctx.request.db.get('user').remove({ id: sid});
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

//查看公司（分页）
router.get('/company', async (ctx, next) => {
    let result, teacherArr = [];
    let params = {}, pageObj = {};
    params.page = ctx.request.query.page || 1;
    params.pageSize = ctx.request.pageSize || 2;

    try {
        let companyList = await ctx.request.db.get('company').find({},{ limit: params.pageSize, skip:(params.page - 1)*params.pageSize});
        let count = await ctx.request.db.get('company').count();
        // let teacherList= await ctx.request.db.get('teacher').find();

        pageObj.countPage = Math.ceil(count / params.pageSize);
        pageObj.currentPage = params.page;


       /* //老师 id->name
        _.forEach(teacherList, (item, key) => {
            teacherArr[item.id] = item.name;
        });

        //将对应的公司名老师插入其中
        _.forEach(companyList, (item, key) => {
            item.tname = (item.tid && teacherArr[item.tid]) || '空';
        });*/

        result = {
            status: { code: 200, msg: '查找成功' }, data:{ company: companyList, pageObj: pageObj}
        };
    }catch(e) {
        result = {
            status: { code: 500, msg: e || '服务器错误' }
        };
    }finally {console.log('--->run');
        await ctx.render('company.jade', { results: result});
    }
});

//展示添加 修改公司页面
router.get('/company/add', async (ctx, next) => {
    await ctx.render('company-add-update');
});

router.get('/company/update/:id', async (ctx, next) => {
    let result;
    try {
        let company = await ctx.request.db.get('company').findOne({ id: ctx.params.id});
        result = {
            status: { code: 200, msg: '查询成功'}, data: company
        };
    }catch(e){
        result = {
            status: { code: 500, msg: e || '服务器错误'}
        };
    } finally {
        await ctx.render('company-add-update', { result: result});
    }

});

//添加公司
router.post('/company/addCom', async (ctx, next) => {
    let companyObj = ctx.request.body;
    let result;
    try {
        if(!companyObj) {
            console.log('空了');
            errorFun('输入为空');
        }
        let company = await ctx.request.db.get('company').insert(companyObj);
        await ctx.request.db.get('user').insert({ id: company.id, password: '123456', role: 3});
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

//修改公司
router.put('/company/updataCom/:id', async (ctx, next) => {
    let cid = ctx.params.id;
    let companyObj = ctx.request.body;
    let result;
    try {
        if(!companyObj) {
            console.log('空了');
            errorFun('输入为空');
        }
        let company = await ctx.request.db.get('company').find({ id: cid});
        if(!company) {
            result = {
                status: { code: 400, msg: '找不到'}
            };
        }else {
            await ctx.request.db.get('company').update({id: cid},{$set: companyObj});
            result = {
                status: { code: 200, msg: '修改成功' }
            };
        }
    }catch(e) {
        result = {
            status: { code: 500, msg: e || '服务器错误' }
        };
    }finally {
        ctx.body = result;
    }
});

//删除公司
router.del('/company/deleteCom/:id', async (ctx, next) => {
    let cid = ctx.params.id;
    let result;
    try {
        await ctx.request.db.get('company').remove({ id: cid});
        await ctx.request.db.get('user').remove({ id: cid});
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

//查看新闻（分页）
router.get('/news', async (ctx, next) => {
    let result;
    let params = {}, pageObj = {};
    params.page = ctx.request.query.page || 1;
    params.pageSize = ctx.request.pageSize || 2;

    try {
        let newsList = await ctx.request.db.get('news').find({},{ limit: params.pageSize, skip:(params.page - 1)*params.pageSize});
        let count = await ctx.request.db.get('news').count();

        pageObj.countPage = Math.ceil(count / params.pageSize);
        pageObj.currentPage = params.page;
        result = {
            status: { code: 200, msg: '查找成功' }, data:{ news: newsList, pageObj: pageObj}
        };
    }catch(e) {
        result = {
            status: { code: 500, msg: e || '服务器错误' }
        };
    }finally {
        await ctx.render('news', { results: result});
    }
});

//展示添加 修改新闻页面
router.get('/news/add', async (ctx, next) => {
    await ctx.render('news-add-update');
});

router.get('/news/update/:id', async (ctx, next) => {
    let nid = ctx.params.id;
    let result;
    try {
        let news = await ctx.request.db.get('news').findById(nid);
        if(!news) {
            result = {
                status: {code: 400, msg: '空'}
            };
        }else{
            result = {
                status: { code: 200, msg: '查询成功'}, data: news
            };
        }
    }catch(e){
        result = {
            status: { code: 500, msg: e || '服务器错误'}
        };
    } finally {
        await ctx.render('news-add-update', { result: result});
    }

});

//添加新闻
router.post('/news/addNews', async (ctx, next) => {
    let newsObj = ctx.request.body;
    newsObj.datetime = format.asString(new Date());
    let result;
    try {
        if(!newsObj) {
            console.log('空了');
            errorFun('输入为空');
        }
        let news = await ctx.request.db.get('news').insert(newsObj);
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

//修改新闻
router.put('/news/updateNews/:id', async (ctx, next) => {
    let nid = ctx.params.id;
    let newsObj = ctx.request.body;
    let result;
    try {
        if(!newsObj) {
            console.log('空了');
            errorFun('输入为空');
        }
        let news = await ctx.request.db.get('news').findById(nid);
        if(!news) {
            result = {
                status: { code: 400, msg: '找不到'}
            };
        }else {console.log('===============>',newsObj);
            await ctx.request.db.get('news').update({id: cid},{$set: newsObj});
            result = {
                status: { code: 200, msg: '修改成功' }
            };
        }
    }catch(e) {
        result = {
            status: { code: 500, msg: e || '服务器错误' }
        };
    }finally {
        ctx.body = result;
    }
});


//删除新闻
router.del('/news/deleteNews/:id', async (ctx, next) => {
    let nid = ctx.params.id;
    let result;
    try {
        await ctx.request.db.get('news').remove({ _id: nid});
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

//查看留言（分页）
router.get('/message', async (ctx, next) => {
    let result;
    let params = {}, pageObj = {};
    params.page = ctx.request.query.page || 1;
    params.pageSize = ctx.request.pageSize || 2;

    try {
        let newsList = await ctx.request.db.get('message').find({},{ limit: params.pageSize, skip:(params.page - 1)*params.pageSize});
        let count = await ctx.request.db.get('message').count();

        pageObj.countPage = Math.ceil(count / params.pageSize);
        pageObj.currentPage = params.page;
        result = {
            status: { code: 200, msg: '查找成功' }, data:{ message: messageList, pageObj: pageObj}
        };
    }catch(e) {
        result = {
            status: { code: 500, msg: e || '服务器错误' }
        };
    }finally {
        await ctx.render('message', { results: result});
    }
});

//删除留言
router.del('/message/deleteMsg/:id', async (ctx, next) => {
    let mid = ctx.params.id;
    let result;
    try {
        await ctx.request.db.get('news').remove({ _id: mid});
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

//修改密码页展示
router.get('/setting', async (ctx, next) => {
    await ctx.render('setting');
});
//修改密码
router.put('/setting/updateSetting', async (ctx, next) => {
    let pwdObj = ctx.request.body;
    let result = {};
    let userObj = ctx.session.userObj;
    console.log('----修改密码>',pwdObj,userObj);
    ctx.body = {
        status: {code :200},data:userObj
    };
    console.log('----');
   /* try {
        if(!pwdObj || (!pwdObj.oldPwd || !pwdObj.newPwd || !pwdObj.renewPwd)) {
            errorFun('输入为空');
        }
        if(pwdObj.newPwd != pwdObj.renewPwd) {
            errorFun('两次新密码不一致');
        }
        let user = await ctx.request.db.get('user').findOne({ id: userObj.id});
        console.log('user---------->',user);
        if(!user) {
            result = {
                status: { code: 400, msg: '不存在该用户'}
            };
        }else if(user.password != pwdObj.oldPwd) {
            result = {
                status: { code: 401, msg: '原始密码输入错误'}
            };
            console.log('res===1>',result);
        }else {
            let re = await ctx.request.db.get('user').update({ id: user.id}, { $set: {'password': userObj.newPwd } } );
            console.log('--->',re);
            result = {
                status: { code: 200, msg: '修改成功'}
            };
        }

    }catch(e) {console.log('error--->',e);
        result = {
            status: { code: 500, msg: e || '服务器错误'}
        };
    }finally {console.log('-------->/n',result);
        ctx.body = result;
    }*/
});

module.exports = router;


