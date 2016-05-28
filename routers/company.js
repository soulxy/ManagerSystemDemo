/**
 * Created by Administrator on 2016/4/30.
 */

let router = require('koa-router')();

let errorFun = function(msg){
    throw new Error(msg);
};

//获取公司列表
router.get('/list', async (ctx, next) => {
    let result;
    try {
        let companies = await ctx.request.db.get('company').find();
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

//公司登陆完进入的首页
router.get('/', async (ctx, next) => {
    let result;
    let userId = ctx.session.userObj && ctx.session.userObj.id;
    try {
        let company = await ctx.request.db.get('company').findOne({ id:  userId});
        let teacher = await ctx.request.db.get('teacher').findOne({ cid: userId});
        let mission = await ctx.request.db.get('mission').findOne({ cid: userId});
        result = {
            status: { code: 200 , msg: '查找成功'},
            data: {
                company: company,
                teacher: teacher,
                mission: mission
            }
        };
    } catch(e) {
        result = { status: { code: 500, msg: e || '服务器错误'} };
    } finally {
        await ctx.render('./companies/index', {
            result: result
        });
    }



});

//添加修改培训任务
router.post('/editMission', async (ctx, next) => {
    let result;

    let missionObj = ctx.request.body;
    let userId = ctx.session.userObj && ctx.session.userObj.id;
    if(!missionObj) {
        console.log('空了');
        errorFun('输入为空');
    }

    let data;
    try {
        let mission = await ctx.request.db.get('mission').findOne({ cid:  userId});
        console.log('====>',mission,missionObj,userId);
        missionObj.cid = userId;
        if(!mission) {//add
            await ctx.request.db.get('mission').insert(missionObj);
        }else {//update
            await ctx.request.db.get('mission').update({cid: userId},{$set: missionObj});
        }
        data = await ctx.request.db.get('mission').findOne({ cid:  userId});
        result = {
            status: {code: 200, msg: "操作成功" },
            data: data
        };
    } catch(e) {
        result = {
            status: {code: 500, msg: e || "服务器错误"}
        };
    }finally {
        ctx.body = result;
    }
});

//打分页面
router.get('/rating', async (ctx, next) => {
    let result;
    try {
        let userId = ctx.session.userObj && ctx.session.userObj.id;
        let teacher = await ctx.request.db.get('teacher').findOne({cid : userId});
        let students = await ctx.request.db.get('student').find({ cid: userId});
        result = {
            status: {code: 200, msg: '查找成功'},
            data: students
        };
    } catch(e) {
        result = {
            status: {code: 500, msg: e || '服务器错误'}
        };
    } finally {
        await ctx.render('./companies/rating', {
            result: result
        });
    }

});

//打分
router.post('/addRating', async (ctx, next) => {
    let ratingArr = ctx.request.body.ratingArr;
    ratingArr.score = '';
    let result;
    try {
        await ctx.request.db.get('rating').insert(ratingArr);
        result = {
            status: { code: 200, msg: "打分成功"}
        };
    } catch(e) {
        result = {
            status: { code: 500, msg: e || "服务器错误"}
        };
    } finally {
        ctx.body = result;
    }
});

module.exports = router;
