/**
 * QiniuController
 *
 * @description :: Server-side logic for managing qinius
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
'use strict';
module.exports = {
    
    upLoadImg(req,res){
        var qiniu = require("qiniu");
    
        //需要填写你的 Access Key 和 Secret Key
        qiniu.conf.ACCESS_KEY = 'moZ_Kg5aT2xdrjg39N4MlIozKzioQ6Pggxdjy4M3';
        qiniu.conf.SECRET_KEY = '3TFyL6jTfbW8AbLK4uiR8fOI511A_Y_4pHkiQqVB';
    
        //要上传的空间
        let bucket = 'kpink71';
    
        //上传到七牛后保存的文件名
        let key = 'my-nodejs-logo.png';
        // key=req.body.upfile;
    
        //构建上传策略函数，设置回调的url以及需要回调给业务服务器的数据
        function uptoken(bucket, key) {
          var putPolicy = new qiniu.rs.PutPolicy(bucket+":"+key);
          // putPolicy.callbackUrl = 'http://7xrhn6.com1.z0.glb.clouddn.com/callback';
          // putPolicy.callbackBody = 'filename=$(fname)&filesize=$(fsize)';
          return putPolicy.token();
        }
    
        //生成上传 Token
        let token = uptoken(bucket, key);
    
        //要上传文件的本地路径
        // filePath = './nodejs-logo.png'
        // let filePath = req.body.upfile;
        let filePath = './assets/images/single_act/qrcode.jpg';
        console.log('----',filePath);
        //构造上传函数
        // function uploadFile(uptoken, key, localFile) {
          var extra = new qiniu.io.PutExtra();
            qiniu.io.putFile(token, key, filePath, extra, function(err, ret) {
              if(!err) {
                // 上传成功， 处理返回值
                console.log(ret.hash, ret.key, ret.persistentId);       
              } else {
                // 上传失败， 处理返回代码
                console.log(err);
              }
              res.send('ok');
          });
        // }
    
        //调用uploadFile上传
        // uploadFile(token, key, filePath);
      }
};

