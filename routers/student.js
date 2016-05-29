/**
 * Created by Administrator on 2016/5/25.
 */
let router = require('koa-router')();
let _ = require('lodash');
let format = require('date-format');

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
        let company = await ctx.request.db.get('company').findOne({ id: teacher.cid});
        let mission = await ctx.request.db.get('mission').findOne({ id: company.cid});
        let news = await ctx.request.db.get('news').find();
        let homework = await ctx.request.db.get('homework').findOne({ sid: userId});

        //新加功能：学生成绩显示
        let rating = await ctx.request.db.get('rating').findOne({ id: userId});

        result = {
            status : {code :200 , msg: '查询成功' },
            data: {
                student: student,
                teacher: teacher,
                company: company,
                news: news,
                mission: mission,
                homework: homework,
                rating: rating
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
    let userArr = [];

    let params = {}, pageObj = {};
    params.page = ctx.request.query.page || 1;
    params.pageSize = ctx.request.query.pageSize || 2;

    try {
        let message = await ctx.request.db.get('message').find({}, { limit: params.pageSize, skip:(params.page - 1)*params.pageSize});
        let count = await ctx.request.db.get('message').count();
        let user = await ctx.request.db.get('student').find();

        pageObj.countPage = Math.ceil(count / params.pageSize);
        pageObj.currentPage = params.page;


        if(message && user) {
            _.forEach(user, function(item) {
                userArr[item.id] = item;
            });

            _.forEach(message, function(item) {
                item.user = userArr[item.uid];
            });
        }

        result = {
            status: { code: 200, msg: '查询成功'},
            data: { message: message, pageObj: pageObj }
        };
    } catch(e) {
        result = errorRes(e);
    } finally {
        console.log('--------1>',result);
        await ctx.render('./students/message', {
            result: result
        });
    }
});

//发布留言

router.post('/addMsg', async (ctx, next) => {
    let result;
    let msgObj = ctx.request.body;
    let userId = ctx.session.userObj && ctx.session.userObj.id;
    msgObj.datetime = format.asString(new Date());
    msgObj.uid = userId;
    let allMsgObj = {};

    try {
        await ctx.request.db.get('message').insert(msgObj);
        let user = await ctx.request.db.get('student').findOne({id: userId});
        allMsgObj.message = msgObj;
        allMsgObj.message.user = user;
        result = {
            status: { code: 200 , msg : '添加成功'},
            data: allMsgObj
        };
    } catch(e) {
        result = errorRes(e);
    } finally {
        console.log('----------->res',result);
        ctx.body = result;
    }
});

//回复留言

module.exports = router;