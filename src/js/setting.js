/**
 * Created by Administrator on 2016/5/11.
 */

;(
    function() {

        //表单验证
        let $btn = $('.ui.button.primary.submit');
        let $form = $('.ui.form');
        let formValidationRules = {
            oldPwd: {
                identifier  : 'oldPwd',
                rules: [
                    { type   : 'empty', prompt : '请输入旧密码' },
                    { type   : 'minLength[6]', prompt : '最小长度6位'}
                ]
            },
            newPwd: {
                identifier  : 'newPwd',
                rules: [
                    { type  : 'empty', prompt : '请输入新密码' },
                    { type  : 'minLength[6]', prompt : '最小长度6位'}
                ]
            },
            renewPwd: {
                identifier  : 'renewPwd',
                rules: [
                    { type  : 'empty', prompt : '请输入再次确认密码' },
                    { type  : 'minLength[6]', prompt : '最小长度6位'}
                ]
            },
            match: {
                identifier  : 'renewPwd',
                rules: [
                    { type  : 'match[newPwd]', prompt : '两次输入新密码不一致' }
                ]
            }
        };

        let updateAJAX = {
            action: 'update setting',
            method: 'put',
            beforeSend: function (settings) {
                console.log('beforeSend');
                NProgress.start();
                settings.data = $form.form('get values',['oldPwd', 'newPwd', 'renewPwd']);
                return settings;
            },
            onSuccess: function (response) {
                NProgress.done();
                console.log('--->1',response);
                location.href = '/admin';
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

        $btn.on('click', function(e) {
            console.log('验证表单');
            $form.form('vaild form');
            if($form.form('is vaild')) {
                console.log('提交表单');
                $form.api(updateAJAX);
            }else {
                return false;
            }
        });
    }
)();