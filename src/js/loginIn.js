/**
 * Created by Administrator on 2016/4/22.
 * 登录
 */
;
(function() {
    let $form = $('.ui.form');
    let $button = $('.ui.button');
    let formValidationRules = {
        username: {
            identifier: 'username',
            rules: [{
                type: 'empty',
                prompt: '用户名不能为空'
            }, {
                type: 'number',
                prompt: '请输入合理用户名，用户名为纯数字'
            }]
        },
        password: {
            identifier: 'password',
            rules: [{
                type: 'empty',
                prompt: '密码不能为空'
            }, {
                type: 'length[6]',
                prompt: '密码至少6位字符'
            }]
        }
    };
    let postAJAX = {
        action: 'login in',
        method: 'POST',
        beforeSend: function (settings) {
            console.log('beforeSend');
            NProgress.start();
            settings.data = $form.form('get values');
            return settings;
        },
        onSuccess: function (response) {
            console.log('success:',response);
            NProgress.done();
            if(response.status && response.status.code == 400) {
                //用户名错误
                $form.form('add prompt', 'username');
                $form.form('add errors', ['用户名不存在']);
            }else if(response.status.code == 401) {
                //密码错误
                let field = $form.form('get field', 'username');
                $form.form('add prompt', 'password');
                $form.form('add errors', ['密码错误']);
            } else if(response.status.code == 200) {
                let nextPage;
                switch (response.data.role) {
                    case 0:
                        nextPage = '/admin';
                        break;
                    case 1:
                        nextPage = '/teacher';
                        break;
                    case 3:
                        nextPage = '/compony';
                        break;
                    case 2:
                    default:
                        nextPage = '/student';
                        break;
                }
                location.href = nextPage;
            }
        },
        onFailure: function(response) {
            // request failed, or valid response but response.success = false
            console.log('onFailure...',response);
            NProgress.done();
            $form.form('add errors', [response]);
        },
        onError: function(errorMessage) {
            // invalid response
            console.log('onError...',errorMessage);
            NProgress.done();
        },
        onAbort: function(errorMessage) {
            // navigated to a new page, CORS issue, or user canceled request
            console.log('onAbort...',errorMessage);
            NProgress.done();
        }
    };

    $form.form({
        fields : formValidationRules,
        onSuccess: function(event, b){
            //bug: no event
            let e = event || window.event;
            e.preventDefault();
        },
        onFailure: function(formErrors, fields){
            return false;
        }
    });

    $button.on('click', function(e){
        console.log('开始验证表单...');
        e.preventDefault();
        $form.form('validate form');

        if($form.form("is valid")) {
            console.log('验证通过，提交表单...');
            $form.api(postAJAX);
        }else {
            return false;
        }
    });

})();