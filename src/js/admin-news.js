/**
 * Created by Administrator on 2016/5/7.
 */

;(
    function() {

        //复选框
        $('.ui.checkbox')
            .checkbox()
        ;



        //表单验证
        let $btn = $('.ui.button.primary');
        let $form = $('.ui.form');
        let formValidationRules = {
            title: {
                identifier: 'title',
                rules: [{
                    type   : 'empty',
                    prompt : '请输入新闻标题'
                }]
            },
            content: {
                identifier: 'content',
                rules: [{
                    type   : 'empty',
                    prompt : '请输入新闻内容'
                }]
            }
        };

        //如果有result即修改页面
        let temp = {},resultObj = res;
        if(resultObj && resultObj.status) {
            if(resultObj.status.code == 200) {
                temp = {
                    title: resultObj.data.title,
                    content: resultObj.data.content,
                    datetime: resultObj.data.datetime,
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
            action: 'add news',
            method: 'POST',
            beforeSend: function (settings) {
                console.log('beforeSend');
                NProgress.start();
                settings.data = $form.form('get values',['title','content']);
                settings.data.status = $form.form('get values', ['status']).status ? 1 : 0;
                return settings;
            },
            onSuccess: function (response) {
                NProgress.done();
                console.log('--->1',response);
                location.href = '/admin/news';
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
            action: 'update news',
            method: 'PUT',
            urlData: { id: (resultObj && resultObj.status.code == 200) ? resultObj.data._id : 0 },
            beforeSend: function (settings) {
                console.log('beforeSend');
                NProgress.start();
                settings.data = $form.form('get values',['title','content']);
                settings.data.status = $form.form('get values', ['status']).status ? 1 : 0;
                return settings;
            },
            onSuccess: function (response) {
                NProgress.done();
                console.log('--->1',response);
                location.href = '/admin/news';
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
    }
)(res);