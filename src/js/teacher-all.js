/**
 * Created by Administrator on 2016/5/27.
 */
;(
    function() {
        //下拉菜单
        $('.ui.dropdown')
            .dropdown('get value')
        ;

        //打分
        let $scoringBtn = $('.menu.scoring');
        let $scoringModel = $('.ui.modal.scoring');
        let $scoringForm = $('.ui.form.scoring');
        $scoringBtn.on('click', function(e) {
            //学号
            let self = $(this);
            let studentObj = self.data('obj');
            console.log('res---<',studentObj);
            $scoringModel.find('.homework.display a').attr('href', studentObj.homework);

            $('.ui.modal.scoring')
                .modal({
                    closable  : false,
                    onDeny    : function(){
                        return true;
                    },
                    onApprove : function() {
                        let scoringFormVale = $scoringForm.form('get value', ['score']);
                        if(!scoringFormVale) {
                            return false;
                        }
                        $.ajax({
                            url: '/teacher/scoring',
                            method: 'post',
                            data: {
                                id: studentObj.id, score: scoringFormVale
                            },
                            beforeSend: function(){
                                NProgress.start();
                            }
                        }).done( function(result) {
                            NProgress.done();
                            if(result && result.status && result.status.code == 500) {
                                errorFun();
                            }else if(result.status.code == 200) {
                                let scoreValue = scoringFormVale;
                                let ratingValue = self.parents('td').siblings('.rating').html();
                                let totalValue = parseFloat(ratingValue*20*0.7) + parseFloat(scoreValue*0.3);
                                self.parents('td').siblings('.score').html(scoreValue);
                                self.parents('td').siblings('.total').html(totalValue);
                                return true;
                            }
                        });
                    }
                })
                .modal('show');
        });

        //选培训基地
        let $companyModal = $('.ui.modal.company');
        let $companyBtn = $('.pink.item.active');
        let $companyForm = $('.ui.form.company');

        //获取公司列表
        $('.ui.dropdown.companies')
            .dropdown({
                apiSettings: {
                    action: 'get company list',
                    method:'get',
                    onResponse: function (respone) {
                        let companies = {};
                        if(respone && respone.status && respone.status.code == 200) {
                            companies.success = true;
                            companies.results = [];
                            for(let item of respone.data) {
                                companies.results.push({
                                    name: item.name,
                                    value: item.id
                                });
                            }
                        }else {
                            companies.success = false;
                        }
                        return companies;
                    }
                },
                maxSelections: 1
            })
        ;
        //修改培训公司
        $companyBtn.on('click', function(e) {
            $companyModal
                .modal({
                    closable  : false,
                    onDeny    : function(){
                        return true;
                    },
                    onApprove : function() {
                        let companyId = $companyForm.form('get value', ['company']);
                        if(!companyId) {
                            return false;
                        }
                        $.ajax({
                            url: '/teacher/company',
                            method: 'put',
                            data: {
                                cid: companyId
                            },
                            beforeSend: function(){
                                NProgress.start();
                            }
                        }).done( function(result) {
                            NProgress.done();
                            if(result && result.status && result.status.code == 500) {
                                errorFun();
                            }else if(result.status.code == 200) {
                                return true;
                            }
                        });
                    }
                })
                .modal('show');
        });
    }
)();