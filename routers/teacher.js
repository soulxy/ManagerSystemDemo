/**
 * Created by Administrator on 2016/4/30.
 */

let router = require('koa-router')();
let _ = require('lodash');

let errorFun = function(msg){
    throw new Error(msg);
};

let errorRes = function(e) {
    return {
        status: {code: 500, msg: e || '服务器错误'}
    };
};

let successRes = function(msg, obj) {
    return {
        status: { code: 200 ,msg: msg},
        data: obj
    };
};

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

//老师首页
router.get('/', async (ctx, next) => {
    let result;
    let userId = ctx.session.userObj && ctx.session.userObj.id;
    let ratingArr = [];
    let homeworkArr = [];

    let params = {}, pageObj = {};
    params.page = ctx.request.query.page || 1;
    params.pageSize = ctx.request.query.pageSize || 2;

    try {
        let teacher = await ctx.request.db.get('teacher').findOne({ id: userId});
        let company = {},mission = {};
        if(teacher && teacher.cid) {
            company = await ctx.request.db.get('company').findOne({ id: teacher.cid});
        }
        if(company && company.id) {
            mission = await ctx.request.db.get('mission').findOne({ cid: company.id});
        }

        let students = await ctx.request.db.get('student').find({tid: userId});

        let rating = await ctx.request.db.get('rating').find();

        let homework = await ctx.request.db.get('homework').find();

        let count = students.length;

        pageObj.countPage = Math.ceil(count / params.pageSize);
        pageObj.currentPage = params.page;

        if(rating) {
            _.forEach(rating, function(item) {
                ratingArr[item.id] = item;
            });
        }
        if(homework) {
            _.forEach(homework, function(item) {
                homeworkArr[item.sid] = item.file;
            });
        }
        _.forEach(students, function(item) {
            item.rating = ratingArr[item.id].rating || '';
            item.score = ratingArr[item.id].score || '';
            item.homework = homeworkArr[item.id] || '';
        });

        result = successRes('查询成功', {teacher: teacher, students: students, company: company, mission: mission, pageObj: pageObj});
    } catch(e) {
        result = errorRes(e);
    } finally {
        await ctx.render('./teachers/index', { result: result});
    }
});

//给学生评分
router.post('/scoring', async (ctx, next) => {
    let result;
    let userId = ctx.session.userObj && ctx.session.userObj.id;

    let paramsObj = ctx.request.body;

    try {
        let rating = await ctx.request.db.get('rating').update({id: paramsObj.id}, {$set: {score: paramsObj.score}});
        result = successRes('评分成功', {});
    } catch(e) {
        result = errorRes(e);
    } finally {
        ctx.body = result;
    }
});

//修改培训公司
router.put('/company', async (ctx, next) => {
    let result;
    let userId = ctx.session.userObj && ctx.session.userObj.id;
    let cid = ctx.request.body.cid;
    
    try {
        await ctx.request.db.get('teacher').update({id: userId}, {$set: {cid: cid}});
        result = successRes('修改成功', {});
    } catch(e) {
        result = errorRes(e);
    } finally {
        ctx.body = result;
    }
});

module.exports = router;
