/**
 * Created by Administrator on 2016/5/2.
 * 定义一些全局变量、方法
 */


let errorModel = function (){
    //错误提示
    $('.ui.basic.modal.baderror')
        .modal('show')
    ;
};

let noFoundModel = function (){
    //404
    $('.ui.basic.modal.notfound')
        .modal('show')
    ;
};

/*
let confirmModel = function () {
    //确认弹层 必须选择
    $('.ui.basic.modal.confirm')
        .modal('setting', 'closable', false)
        .modal('show')
    ;
};*/
