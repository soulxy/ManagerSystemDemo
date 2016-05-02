/**
 * Created by Administrator on 2016/4/22.
 * 路由配置
 */

$.fn.api.settings
    .api = {
 'login in': '/users/loginIn',// 登录
 'add teacher': '/admin/teacher/addTea',//添加老师
 'update teacher': '/admin/teacher/updateTea/{id}',//修改老师
 'delete teacher': '/admin/teacher/deleteTea/{id}',//删除老师
 'get company list': '/company/list',//公司列表
 
};