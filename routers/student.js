/**
 * Created by Administrator on 2016/5/25.
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
router.get('/', async (ctx, next) => {
    let result;
    let userId = ctx.session.userObj && ctx.session.userObj.id;
    try {
        let student = await ctx.request.db.get('student').findOne({ id: userId});
        let teacher = await ctx.request.db.get('teacher').findOne({ id: student.tid});
        let company = await ctx.request.db.get('company').findOne({ id: student.cid});
        let mission = await ctx.request.db.get('mission').findOne({ id: student.cid});
        let news = await ctx.request.db.get('news').find();
        let homework = await ctx.request.db.get('homework').findOne({ sid: userId});
        result = {
            status : {code :200 , msg: '查询成功' },
            data: {
                student: student,
                teacher: teacher,
                company: company,
                news: news,
                mission: mission,
                homework: homework
            }
        };
    } catch(e) {
        result = {
            status: { code: 500, msg: e || '服务器错误'}
        };
    } finally {

        await ctx.render('./students/index', {
            result: result
        });
    }
});

//上传作业
router.post('/uploadeFile', async (ctx, next) => {
    let file = ctx.request.body.file;
    let userId = ctx.session.userObj && ctx.session.userObj.id;
    let result;
    try {
        let homework = await ctx.request.db.get('homework').findOne({ sid: userId});
        if(!homework) {//add
            await ctx.request.db.get('homework').insert({
                sid: userId,
                file: file
            });
        }else {
            await ctx.request.db.get('homework').update({ sid: userId}, {$set: { file: file}});
        }
        result = {status: { code: 200, msg: '上传成功'} };
    } catch(e) {
        result = {
            status: { code: 500, msg: e || '服务器错误'}
        };
    } finally {
        ctx.body = result;
    }
});

//选课页面
router.get('/course', async (ctx, next) => {
    let result;
    let studentCount;
    let companyArr = [];
    let missionArr = [];
    try {
        let teachers = await ctx.request.db.get('teacher').find();
        let companies = await ctx.request.db.get('company').find();
        let missions = await ctx.request.db.get('mission').find();

        _.forEach(companies, function(item, key) {
            companyArr[item.id] = item.name;
        });

        _.forEach(missions, function(item, key) {
            missionArr[item.cid] = item;
        });

        _.map(teachers, function(item) {
            item.company = {
                name: companyArr[item.cid] || '空',
                mission: missionArr[item.cid] || '空'
            };
        });


        result = {
            status: { code: 200, msg : '查询成功'},
            data: {
                teachers : teachers
            }
        };
    } catch (e) {
        result = {
            status: { code: 500, msg: e || '服务器错误'}
        };
    } finally {
        await ctx.render('./students/course', {
            result: result
        });
    }
});

//选老师
router.post('/chooseTea', async (ctx, next) => {
    let result;
    let tid = ctx.request.body.teacherId;
    let userId = ctx.session.userObj && ctx.session.userObj.id;
    try {
        await ctx.request.db.get('student').update({ id: userId}, { $set: { tid: tid}});
        result = {
            status : { code : 200, msg : '操作成功'}
        };
    } catch(e) {
        result = {
            status : { code : 500, msg : e || '服务器错误'}
        };
    } finally {
        ctx.body = result;
    }
});

//留言页面
router.get('/message', async (ctx, next) => {
    let result;
    try {
        let message = await ctx.request.db.get('message').find();
        result = {
            status: { code: 200, msg: '查询成功'},
            data: message
        };
    } catch(e) {
        result = errorRes(e);
    } finally {
        console.log('--->1',result);
        await ctx.render('./students/message', {
            result: result
        });
    }
});

module.exports = router;