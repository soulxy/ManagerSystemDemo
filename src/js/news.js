/**
 * Created by Administrator on 2016/5/7.
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

            let $this = $(e.target);console.log('===>',$this.data('id'));
            let deleteAJAX = {
                method: 'delete',
                action: 'delete news',
                urlData: { id: $this.data('id') },
                beforeSend: function (settings) {
                    console.log('beforeSend',settings);
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
            };

            $('.ui.modal.confirm')
                .modal('setting', {
                    closable  : false,
                    onDeny    : function(){
                        return true;
                    },
                    onApprove : function() {
                        console.log('===>approve');
                        //删除老师
                        $.ajax({
                            type: 'DELETE',
                            dataType: 'json',
                            url: '/admin/news/deleteNews/'+JSON.parse($this.data('id')),
                            beforeSend: function() {
                                console.log('beforeSend');
                                NProgress.start();
                            },
                            success: function(result) {
                                console.log('did it',result);
                                NProgress.done();
                                if(result && result.status && result.status.code == 200) {
                                    // 为了同步显示删除后的效果
                                    $this.parents('tr').remove();
                                    return true;
                                }else {
                                    errorModel();
                                }
                            },
                            error: function (xhr, textstatus, errorThrown) {
                                console.log('---errro--->',xhr, textstatus,errorThrown);
                                NProgress.done();
                                errorModel();
                            }
                        });

                    }
                })
                .modal('show')
            ;
        });
    }
)(flage);