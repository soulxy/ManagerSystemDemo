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

    }
)();