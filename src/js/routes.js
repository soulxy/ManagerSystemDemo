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
         'get teacher list': '/teacher/list',//老师列表

         'add student': '/admin/student/addStu',//添加学生
         'update student': '/admin/teacher/updateStu/{id}',//修改学生
         'delete student': '/admin/teacher/deleteStu/{id}',//删除学生

         'add company': '/admin/companies/addCom',
         'update company': '/admin/companies/updateCom',
         'delete company': '/admin/companies/deleteCom',
         'get company list': '/companies/list',//公司列表

         'add news': '/admin/news/addNews',
         'update news': '/admin/news/updateNews/{id}',
         'delete new': '/admin/news/deleteNews/{id}',

         'delete message': '/admin/message/deleteMsg',

         'update setting': '/admin/setting/updateSetting',//更新密码

        //company
         'edit company mission': '/company/editMission',//添加修改任务
};