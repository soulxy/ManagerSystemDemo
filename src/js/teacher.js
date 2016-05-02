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
        $('.item.delete').on('click', function(e) {console.log('==>',e);
            $('.ui.modal.confirm')
                .modal({
                    closable  : false,
                    onDeny    : function(){
                        return true;
                    },
                    onApprove : function() {
                        window.alert('Approved!');
                        //删除老师
                        
                    }
                })
                .modal('show')
            ;
        });

    }
)(flage);