/**
 * Created by Administrator on 2016/5/6.
 */

;
(function(){


    //复选框
    $('.ui.checkbox')
        .checkbox()
    ;



    //表单验证
    let $btn = $('.ui.button.primary');
    let $form = $('.ui.form');
    let formValidationRules = {
        id: {
            identifier: 'id',
            rules: [{
                type   : 'empty',
                prompt : '请输入公司登陆号'
            }, {
                type   : 'number',
                prompt : '请输入合理登陆号，用户名为纯数字'
            }]
        },
        name: {
            identifier: 'name',
            rules: [{
                type   : 'empty',
                prompt : '请输入公司名字'
            }]
        },
        address: {
            identifier: 'address',
            rules: [{
                type   : 'empty',
                prompt : '请输入公司地址'
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
                address: resultObj.data.address,
                status: resultObj.data.status ? true :false
            };
            $form.form('set values', temp);
        }else if(resultObj.status.code == 500) {
            errorModel();
        }else if(resultObj.status.code == 400) {
            noFoundModel();
        }

    }

    let addApiAJAX = {
        action: 'add company',
        method: 'POST',
        beforeSend: function (settings) {
            console.log('beforeSend');
            NProgress.start();
            settings.data = $form.form('get values',['id','name','address']);
            settings.data.status = $form.form('get values', ['status']).status ? 1 : 0;
            return settings;
        },
        onSuccess: function (response) {
            NProgress.done();
            console.log('--->1',response);
            location.href = '/admin/company';
        },
        onFailure: function (response) {
            NProgress.done();
            console.log('===>2',response);
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
        action: 'update company',
        method: 'PUT',
        urlData: { id: resultObj ? resultObj.data.id : 0 },
        beforeSend: function (settings) {
            console.log('beforeSend');
            NProgress.start();
            settings.data = $form.form('get values',['id','name','address']);
            settings.data.status = $form.form('get values', ['status']).status ? 1 : 0;
            return settings;
        },
        onSuccess: function (response) {
            NProgress.done();
            console.log('--->1',response);
            location.href = '/admin/company';
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