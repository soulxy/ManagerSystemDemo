/**
 * Created by Administrator on 2016/5/28.
 */



;(
    function() {
        let $delete = $('.item.delete');
        let $modal = $('.ui.modal.confirm');
        
        $delete.on('click', function(e) {
            let self = $(this);
            let href = self.data('href');

            $modal
                .modal({
                    closable  : false,
                    onDeny    : function(){
                        return true;
                    },
                    onApprove : function() {
                        $.ajax({
                            url: href,
                            method: 'delete'
                        }).done(function(res) {
                            if(res && res.status && res.status.code == 500) {
                                errorModel();
                            } else if(res.status.code == 200) {
                                self.parents('tr').remove();
                                return true;
                            }
                        });
                    }
                })
                    .modal('show');
        });
    }
)();