/**
 * Created by Administrator on 2016/5/2.
 */

;(
    function(){
        $('.dropdown')
            .dropdown({
                action: 'combo'
            })
        ;
        if(flage) {
            errorModel();
        }

        //确认弹层
        $('.item.delete').on('click', function(e) {
            let self = $(this);
            $('.ui.modal.confirm')
                .modal({
                    closable  : false,
                    onDeny    : function(){
                        return true;
                    },
                    onApprove : function() {
                        console.log('delete--->====>');
                        //删除老师
                        self.api({
                            method: 'delete',
                            action: 'delete teacher',
                            urlData: { id: self.data('id') },
                           /* mockResponse: {
                                success: true
                            },*/
                            beforeSend: function (settings) {
                                console.log('beforeSend',self.data('id'),settings);
                                NProgress.start();
                                return settings;
                            },
                            onSuccess: function (response) {
                                console.log('success===:',response);

                                NProgress.done();
                            },
                            onFailure: function (response) {
                                console.log('beforeSend--2',response);

                                NProgress.done();
                                errorModel();
                            },
                            onError: function (errorMessage) {
                                console.log('beforeSend--3',errorMessage);

                                NProgress.done();
                            },
                            onAbort: function (errorMessage) {
                                console.log('beforeSend--4',errorMessage);

                                NProgress.done();
                            }
                        });
                    }
                })
                .modal('show')
            ;
        });

    }
)(flage);