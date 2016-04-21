##babel 配置
    {
      "presets": ["stage-3", "es2015"]
    }
    本来想在gulpfile写es6风格代码，但是启动`gulp` 花费时间太长了 还是算了吧
    gulpfile.babel.js
    .babaelrc


## 一把泪一把鼻涕的写着koa2.0

	去死吧babel6！！！！

	踩了的坑！！！！！！ 都是泪 list

	0.没有同步更新的中间件，然后走进了1坑

	1.koa-views koa-router 没用到最新版本

	2.安装mongodb插件也是坑：不会用mongodb、插件有bug 不能用shell，还得单独起mongod.exe服务

	3.心好累  配置npm start 启动，明明我都没动 删了重写就可以用了 跟我闹啊啊啊啊