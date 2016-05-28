/**
 * Created by Administrator on 2016/5/25.
 */


;(
    function() {
        //上传作业
        let $updateDownLoad = $('.labeled.icon.menu').find('.blue');
        let $uploadForm = $('.ui.form.upload');

        $updateDownLoad.on('click', function(e) {
            $('.ui.modal')
                .modal({
                    closable  : false,
                    onDeny    : function(){
                        return true;
                    },
                    onApprove : function() {
                        if(!$uploadForm.form('get value', ['file'])) {
                            return false;
                        }
                        $.ajax({
                            url: '/student/uploadeFile',
                            method: 'post',
                            data: {
                                file: $uploadForm.form('get value', ['file'])
                            }
                        }).done( function(result) {
                            if(result && result.status && result.status.code == 500) {
                                errorFun();
                            }else if(result.status.code == 200) {
                                return true;
                            }
                        });
                    }
                })
                .modal('show')
            ;
        });

        //选老师
        let $chooseTeaBtn = $('.button.fluid');
        $chooseTeaBtn.on('click', function(e) {
            var self = $(this);
            $('.coupled.modal')
                .modal({
                    allowMultiple: false
                })
            ;
            // open second modal on first modal buttons
            $('.second.modal')
                .modal('attach events', '.first.modal .button')
            ;
            // show first immediately
            $('.first.modal')
                .modal({
                    closable  : false,
                    onDeny    : function(){
                        return true;
                    },
                    onApprove : function() {
                        $.ajax({
                            url: '/student/chooseTea',
                            method: 'post',
                            data: { teacherId : self.data('id') },
                            beforeSend: function(){
                                NProgress.start();
                            }
                        }).done(function(res) {
                            NProgress.done();
                            if(res && res.status && res.status.code == 500) {
                                errorFun();
                            } else if(res.status.code == 200 ) {
                                return true;
                            }
                        });
                    }
                })
                .modal('show')
            ;
        });

        //发布留言
        let $msgBtn = $('.ui.blue.labeled');
        let $msgForm = $('.ui.form');

        let formValidationRules = {
            title: {
                identifier: 'title',
                rules: [{
                    type   : 'empty',
                    prompt : '请输入标题'
                }]
            },
            content: {
                identifier: 'content',
                rules: [{
                    type   : 'empty',
                    prompt : '请输入内容'
                }]
            }
        };
        let addAJAX = {
            action: 'add message',
            method: 'post',
            beforeSend: function (settings) {
                console.log('beforeSend');
                NProgress.start();
                settings.data = $msgForm.form('get values',['title','content']);
                return settings;
            },
            onSuccess: function (response) {
                NProgress.done();
                console.log('--->1',response);
                location.href = '/student/message';
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

        $msgForm.form({
            fields : formValidationRules,
            onSuccess: function(event, element){
                event.preventDefault();
            },
            onFailure: function(formErrors, fields){
                return false;
            }
        });

        $msgBtn.on('click', function(e) {
            $msgForm.form('valid form');
            if($msgForm.form('is vaild')) {
                $msgForm.api(addAJAX);
            }else {
                return false;
            }
        });

    }
)();