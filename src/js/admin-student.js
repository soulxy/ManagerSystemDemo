/**
 * Created by Administrator on 2016/5/5.
 */


;
(function(){

    //下拉菜单
    $('.ui.dropdown')
    /*.dropdown({
     action: 'hide',
     onChange: function(value, text, $selectedItem) {
     console.log('-->',value,text,$selectedItem);
     }
     })*/
        .dropdown('get value')
    ;

    //复选框
    $('.ui.checkbox')
        .checkbox()
    ;

    //获取公司列表
    $('.ui.dropdown.s-companies')
        .dropdown({
            apiSettings: {
                action: 'get company list',
                method:'get',
                onResponse: function (respone) {
                    let companies = {};
                    if(respone && respone.status && respone.status.code == 200) {
                        companies.success = true;
                        companies.results = [];
                        for(let item of respone.data) {
                            companies.results.push({
                                name: item.name,
                                value: item.id
                            });
                        }
                    }else {
                        companies.success = false;
                    }
                    return companies;
                }
            },
            maxSelections: 1
        })
    ;

    //获取老师列表
    $('.ui.dropdown.s-teacher')
        .dropdown({
            apiSettings: {
                action: 'get teacher list',
                method:'get',
                onResponse: function (respone) {
                    let teachers = {};
                    if(respone && respone.status && respone.status.code == 200) {
                        teachers.success = true;
                        teachers.results = [];
                        for(let item of respone.data) {
                            teachers.results.push({
                                name: item.name,
                                value: item.id
                            });
                        }
                    }else {
                        teachers.success = false;
                    }
                    return teachers;
                }
            },
            maxSelections: 1
        })
    ;

    //表单验证
    let $btn = $('.ui.button.primary');
    let $form = $('.ui.form');
    let formValidationRules = {
        id: {
            identifier: 'id',
            rules: [{
                type   : 'empty',
                prompt : '请输入学生学号'
            }, {
                type   : 'number',
                prompt : '请输入合理学号，用户名为纯数字'
            }]
        },
        name: {
            identifier: 'name',
            rules: [{
                type   : 'empty',
                prompt : '请输入学生名字'
            }]
        },
        gender: {
            identifier: 'gender',
            rules: [{
                type   : 'empty',
                prompt : '请选择性别'
            }]
        },
        profession: {
            identifier: 'profession',
            rules: [{
                type   : 'empty',
                prompt : '请选择专业'
            }]
        }
    };

    //如果有result即修改页面
    let temp = {},resultObj = res;
    if(resultObj && resultObj.status) {
        if(resultObj.status.code == 200) {
            temp = {
                id: resultObj.data.id,
                name: resultObj.data.name,
                gender: resultObj.data.gender,
                profession: resultObj.data.profession,
                company: resultObj.data.cid,
                teacher: resultObj.data.tid,
                status: resultObj.data.status==1 ? true :false
            };
            $form.form('set values', temp);
        }else if(resultObj.status.code == 500) {
            errorModel();
        }else if(resultObj.status.code == 400) {
            noFoundModel();
        }

    }

    let addApiAJAX = {
        action: 'add student',
        method: 'POST',
        beforeSend: function (settings) {
            console.log('beforeSend');
            NProgress.start();
            settings.data = $form.form('get values',['id','name','gender','profession']);
            settings.data.cid = $form.form('get values', ['company']).company;
            settings.data.tid = $form.form('get values', ['teacher']).teacher;
            settings.data.status = $form.form('get values', ['status']).status ? 1 : 0;
            return settings;
        },
        onSuccess: function (response) {
            NProgress.done();
            console.log('--->1',response);
            location.href = '/admin/student';
        },
        onFailure: function (response) {
            NProgress.done();
            console.log('===>2',response);
            errorModel();
        },
        onError: function (errorMessage) {
            NProgress.done();
            console.log('===>3',errorMessage);
        },
        onAbort: function (errorMessage) {
            NProgress.done();
            console.log('===>4',errorMessage);
        }
    };

    let updateAJAX = {
        action: 'update teacher',
        method: 'PUT',
        urlData: { id: resultObj ? resultObj.data.id : 0 },
        beforeSend: function (settings) {
            console.log('beforeSend');
            NProgress.start();
            settings.data = $form.form('get values',['id','name','gender','profession']);
            settings.data.cid = $form.form('get values', ['company']).company;
            settings.data.tid = $form.form('get values', ['teacher']).teacher;
            settings.data.status = $form.form('get values', ['status']).status ? 1 : 0;
            return settings;
        },
        onSuccess: function (response) {
            NProgress.done();
            console.log('--->1',response);
            location.href = '/admin/student';
        },
        onFailure: function (response) {
            NProgress.done();
            console.log('===>2',response);
            errorModel();
        },
        onError: function (errorMessage) {
            NProgress.done();
            console.log('===>3',errorMessage);
        },
        onAbort: function (errorMessage) {
            NProgress.done();
            console.log('===>4',errorMessage);
        }
    };


    $form.form({
        fields : formValidationRules,
        onSuccess: function(event, element){
            event.preventDefault();
        },
        onFailure: function(formErrors, fields){
            return false;
        }
    });

    $btn.on('click', function(e){
        e.preventDefault();
        console.log('验证表单');
        $form.form('vaild form');
        if($form.form('is vaild')){
            console.log('表单验证通过');
            if(!resultObj) {
                $form.api(addApiAJAX);

            }else if(resultObj.status.code == 200) {
                $form.api(updateAJAX);

            }else if(resultObj.status.code == 400) {
                noFoundModel();
            }else if(resultObj.status.code == 500) {
                errorModel();
            }

        }else {
            return false;
        }
    });

})(res);