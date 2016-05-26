/**
 * Created by Administrator on 2016/5/23.
 */

;(
    function() {
        //republic mission
        let $mission = $('.active.step.mission');
        let $form = $('.ui.form');
        let $table = $('.ui.definition.table');

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
            },
            time: {
                identifier: 'time',
                rules: [{
                    type   : 'empty',
                    prompt : '请输入培训起始时间'
                }]
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

        //发布任务
        $mission.on('click', function(e) {
            $('.ui.modal')
                .modal('setting', 'transition', 'horizontal flip')
                .modal({
                    closable  : false,
                    onDeny    : function(){
                        return true;
                    },
                    onApprove : function(e) {
                        //检验表单
                        //提交表单
                       /* let inputs = $form.find('input');
                        // if(!$form.form('get value','title') || !$form.form('get value','content') || !$form.form('get value','time')) {
                        if(!inputs.eq(0).val() || !inputs.eq(1).val() || !inputs.eq(2).val()){
                            return false;
                        }*/
                        $form.form('vaild form');
                        if($form.form('is vaild')) {
                            // $form.api(editAJAX);
                            //TODO:表单验证未起效
                            $.ajax({
                                url: "/company/editMission",
                                data: $form.form('get values'),
                                method: 'post',
                                beforeSend: function(xhr) {
                                }
                            }).done(function( result ) {
                                if ( result && result.status && result.status.code == 500 ) {
                                    errorModel();
                                    return false;
                                }else if(result.status.code == 200){
                                    console.log('-->',result.data);
                                    $table.find('.title').html(result.data.title);
                                    $table.find('.content').html(result.data.content);
                                    $table.find('.time').html(result.data.time);
                                    return true;
                                }
                            });
                        }
                    }
                })
                .modal('show')
            ;
        });

        //时间控件
        let headerHtml = $("#material-header-holder .ui-datepicker-material-header");

        let changeMaterialHeader = function(header, date) {
            let year   = date.format('YYYY');
            let month  = date.format('MMM');
            let dayNum = date.format('D');
            let isoDay = date.isoWeekday();

            let weekday = new Array(7);
            weekday[1] = "Monday";
            weekday[2] = "Tuesday";
            weekday[3] = "Wednesday";
            weekday[4] = "Thursday";
            weekday[5] = "Friday";
            weekday[6] = "Saturday";
            weekday[7]=  "Sunday";

            $('.ui-datepicker-material-day', header).text(weekday[isoDay]);
            $('.ui-datepicker-material-year', header).text(year);
            $('.ui-datepicker-material-month', header).text(month);
            $('.ui-datepicker-material-day-num', header).text(dayNum);
        };

        $.datepicker._selectDateOverload = $.datepicker._selectDate;
        $.datepicker._selectDate = function(id, dateStr) {
            let target = $(id);
            let inst = this._getInst(target[0]);
            inst.inline = true;
            $.datepicker._selectDateOverload(id, dateStr);
            inst.inline = false;
            this._updateDatepicker(inst);

            headerHtml.remove();
            $(".ui-datepicker").prepend(headerHtml);
        };

        $("input[data-type='date']").on("focus", function() {
            $(".ui-datepicker").prepend(headerHtml);
        });

        $("input[data-type='date']").datepicker({
            showButtonPanel: true,
            closeText: 'OK',
            onSelect: function(date, inst) {
                changeMaterialHeader(headerHtml,moment(date, 'MM/DD/YYYY'));
            },
        });

        changeMaterialHeader(headerHtml, moment());
        $('input').datepicker('show');

        //打分
        $('.ui.rating')
            .rating()
        ;
        let $btn = $('.ui.button');
        let $ratings = $('.ui.star.rating');
        let ratingArr = [];
        $btn.on('click', function(e) {
            $ratings.each(function() {
                let self = $(this);
                ratingArr.push({
                    id: self.data('id'),
                    cid: self.data('cid'),
                    rating: self.rating('get rating')
                });
            });
            $.ajax({
                url: '/company/addRating',
                method: 'post',
                data: { ratingArr : ratingArr}
            }).done(function(res) {
                if(res && res.status && res.status.code == 500) {
                    errorFun();
                }else if(res.status.code == 200) {
                    location.href = '/company';
                }
            });
        });
    }
)();
